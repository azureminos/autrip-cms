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
		const { instPackage, rates, cities, isReadonly, showTransport, handleSelectHotel } = this.props;
		const { packageRates, carRates, flightRates, hotelRates } = rates;
		const itAttractions = _.groupBy(instPackage.items, (item) => {
			return item.dayNo;
		});
		const itHotels = _.groupBy(instPackage.hotels, (item) => {
			return item.dayNo;
		});
		console.log('>>>>PackageItinerary, Get itineraries', { itAttractions, itHotels });
		// Generate itinerary accordion
		const elItineraries = {};
		if (showTransport) {
			// Add Flight and Cars
			elItineraries['Flight and Car'] = isReadonly ? (<FlightCar isReadonly />) : (<FlightCar />);
		}

		// Add itinerary for each days
		let lastCity = {};
		_.forEach(_.keys(itAttractions), (dayNo) => {
			const ita = itAttractions[dayNo];
			const ith = itHotels[dayNo];
			const itinerary = {
				dayNo: dayNo,
				isPlannable: !!ita[0].timePlannable || false,
				isOvernight: ith[0].isOvernight || !!ith[0].hotel,
				city: (ita[0].attraction ? Helper.findCityByAttraction(ita[0].attraction.id, cities) : '')
					|| (ith[0].hotel ? Helper.findCityByHotel(ith[0].hotel, cities) : ''),
				attractions: ita,
				hotel: ith[0],
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
						dayNo={dayNo}
						dayHotel={itinerary.hotel}
						hotelRates={hotelRates}
						hotels={hotels}
						handleSelectHotel={handleSelectHotel}
					/>
				);

			elItineraries[title] = (
				<div>
					<ItineraryItem
						itinerary={itinerary}
						attractions={attractions}
					/>
					{hotelSelector}
				</div>
			);
		});

		return (
			<ControlledAccordion mapContents={elItineraries} />
		);
	}
}
