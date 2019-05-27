import _ from 'lodash';
import React from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import ControlledAccordion from './components/accordion';
import HotelSlider from './components/hotel-slider';
import FlightCar from './components/flight-car';
import ItineraryItem from './components/itinerary-item';
import HotelItem from './components/hotel-item';

const triggerText = (dayNo, city) => `Day ${dayNo}, ${city}`;

export default class PackageItinerary extends React.Component {
	render() {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		const { instPackage, cityAttractions, cityHotels, apiUri, selectHotel, isReadonly, showTansport } = this.props;
		const itineraries = _.groupBy(instPackage.items, (item) => {
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
				city: itineraries[dayNo][0].city,
				attractions: itineraries[dayNo],
			};
			// console.log('>>>>PackageItinerary, formatted itinerary', itinerary);
			const city = itinerary.city;
			const title = triggerText(dayNo, city);
			const hotels = _.filter(cityHotels[city], { id: instPackage.hotels[Number(dayNo - 1)] });
			// console.log('>>>>PackageItinerary, accordion setting', setting);

			// Prepare attraction card list
			const hotelSelector = isReadonly ? (
				<HotelItem
					hotels={hotels}
					apiUri={apiUri}
				/>
			) : (
					<HotelSlider
						dayNo={Number(dayNo)}
						instPackage={instPackage}
						hotels={cityHotels[city]}
						apiUri={apiUri}
					/>
				);

			elItineraries[title] = (
				<div>
					<div>Attractions</div>
					<ItineraryItem
						itinerary={itinerary}
						attractions={cityAttractions[city]}
						isCustom={instPackage.isCustom}
						apiUri={apiUri}
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
