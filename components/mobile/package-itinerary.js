import _ from 'lodash';
import React from 'react';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import ControlledAccordion from './components/accordion';
import HotelSlider from './components/hotel-slider';
import FlightCar from './components/flight-car';
import ItineraryItem from './components/itinerary-item';
import HotelItem from './components/hotel-item';

import Helper from '../../lib/helper';

const triggerText = (dayNo, city) => `Day ${dayNo}: ${city}`;

export default class PackageItinerary extends React.Component {
	render () {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		const {
			instPackage,
			rates,
			cities,
			departDates,
			isReadonly,
			showTransport,
			handleSelectHotel,
			handleSelectFlight,
			handleSelectCar,
			itAttractions,
		} = this.props;
		const { packageRates, carRates, flightRates, hotelRates } = rates;
		// Generate itinerary accordion
		const elItineraries = {};
		if (showTransport) {
			const carOptions = _.map(carRates, carRate => {
				return carRate.type;
			});
			// Add Flight and Cars
			elItineraries['Flight and Car'] = isReadonly ? (
				<FlightCar
					departDates={departDates}
					selectedDepartDate={instPackage.startDate}
					selectedReturnDate={instPackage.endDate}
					carOptions={carOptions}
					selectedCarOption={instPackage.carOption}
					handleSelectFlight={handleSelectFlight}
					handleSelectCar={handleSelectCar}
					isReadonly
				/>
			) : (
				<FlightCar
					departDates={departDates}
					selectedDepartDate={instPackage.startDate}
					selectedReturnDate={instPackage.endDate}
					carOptions={carOptions}
					selectedCarOption={instPackage.carOption}
					handleSelectFlight={handleSelectFlight}
					handleSelectCar={handleSelectCar}
				/>
			);
		}

		// Add itinerary for each days
		_.forEach(itAttractions, it => {
			it.isPlannable = it.attractions[0].timePlannable > 0 || false;
			it.isOvernight = it.hotels[0].isOvernight || !!it.hotels[0].hotel;
			console.log('>>>>PackageItinerary, formatted itinerary', it);
			const city = Helper.findCityByName(it.cityBase, cities);
			const title = triggerText(it.dayNo, it.cityBase);
			const hotels = it.isOvernight ? city.hotels : [];
			const attractions = it.isPlannable ? city.attractions : [];
			console.log(`>>>>PackageItinerary ${title} with hotels`, hotels);

			// Prepare attraction card list
			const hotelSelector = isReadonly ? (
				<HotelItem hotels={hotels} />
			) : (
				<HotelSlider
					dayNo={it.dayNo}
					dayHotel={it.hotels[0]}
					hotelRates={hotelRates}
					hotels={hotels}
					handleSelectHotel={handleSelectHotel}
				/>
			);

			elItineraries[title] = (
				<div>
					<ItineraryItem itinerary={it} attractions={attractions} />
					{hotelSelector}
				</div>
			);
		});

		return <ControlledAccordion mapContents={elItineraries} />;
	}
}
