import _ from 'lodash';
import React from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import ControlledAccordion from './components/accordion';
import HotelSlider from './components/hotel-slider';
import FlightCar from './components/flight-car';
import ItineraryItem from './components/itinerary-item';
import HotelItem from './components/hotel-item';

import Helper from '../../lib/helper';

const triggerText = (dayNo, city) => `Day ${dayNo}, ${city}`;

export default class PackageItinerary extends React.Component {
	render() {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		const { packageSummary, packageItems, packageHotels, packageRates, carRates, flightRates,
			hotelRates, cities, isReadonly, showTansport } = this.props;
		const itineraries = _.groupBy(packageItems, (item) => {
			return item.dayNo;
		});
		console.log('>>>>PackageItinerary, Get itineraries', itineraries);
		// Generate itinerary accordion
		const elItineraries = {};
		if (showTansport) {
			// Add Flight and Cars
			elItineraries['Flight and Car'] = isReadonly ? (<div><FlightCar isReadonly /></div>) : (<div><FlightCar /></div>);
		}

		// Add itinerary for each days
		_.forEach(_.keys(itineraries), (dayNo) => {
			const itinerary = {
				dayNo: dayNo,
				city: Helper.findCityById(itineraries[dayNo][0].cityId, cities),
				attractions: itineraries[dayNo],
			};
			console.log('>>>>PackageItinerary, formatted itinerary', itinerary);
			const city = _.find(cities, { name: itinerary.city });
			const title = triggerText(dayNo, city.name);
			const hotels = city.hotels;
			const attractions = city.attractions;
			console.log(`>>>>PackageItinerary ${title} with hotels`, hotels);

			// Prepare attraction card list
			const hotelSelector = isReadonly ? (
				<HotelItem
					hotels={hotels}
				/>
			) : (
					<HotelSlider
						dayNo={Number(dayNo)}
						packageHotels={packageHotels}
						hotelRates={hotelRates}
						hotels={hotels}
					/>
				);

			elItineraries[title] = (
				<div>
					<div>Attractions</div>
					<ItineraryItem
						itinerary={itinerary}
						attractions={attractions}
						isCustom={packageSummary.isCustom}
					/>
					<div>Hotels</div>
					{hotelSelector}
				</div>
			);
		});

		return (
			<ControlledAccordion mapContents={elItineraries} />
		);
	}
}
