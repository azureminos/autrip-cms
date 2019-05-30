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
	render () {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		const { packageSummary, packageItems, packageHotels, packageRates, carRates, flightRates,
			hotelRates, cities, isReadonly, showTransport } = this.props;
		const itAttractions = _.groupBy(packageItems, (item) => {
			return item.dayNo;
		});
		const itHotels = _.groupBy(packageHotels, (item) => {
			return item.dayNo;
		});
		console.log('>>>>PackageItinerary, Get itineraries', {itAttractions, itHotels});
		// Generate itinerary accordion
		const elItineraries = {};
		if (showTransport) {
			// Add Flight and Cars
			elItineraries['Flight and Car'] = isReadonly ? (<div><FlightCar isReadonly /></div>) : (<div><FlightCar /></div>);
		}

		// Add itinerary for each days
		let lastCity = {};
		_.forEach(_.keys(itAttractions), (dayNo) => {
			const itinerary = {
				dayNo: dayNo,
				isPlannable: !!itAttractions[dayNo][0].timePlannable,
				isOvernight: itHotels[dayNo][0].isOvernight,
				city: Helper.findCityById(itAttractions[dayNo][0].cityId || itHotels[dayNo][0].cityId, cities),
				attractions: itAttractions[dayNo],
				hotel: itHotels[dayNo],
			};
			console.log('>>>>PackageItinerary, formatted itinerary', itinerary);
			const tmpCity = _.find(cities, { name: itinerary.city });
			const city = tmpCity ? tmpCity : lastCity;
			lastCity = city;
			const title = triggerText(dayNo, city.name);
			const hotels = itinerary.isOvernight ? city.hotels : [];
			const attractions = itinerary.isPlannable ? city.attractions : [];
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
