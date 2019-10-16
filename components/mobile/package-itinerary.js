import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ControlledAccordion from './components/accordion';
import HotelSlider from './components/hotel-slider';
import FlightCar from './components/flight-car';
import ItineraryItem from './components/itinerary-item';
import HotelItem from './components/hotel-item';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';

const dtFormat = CONSTANTS.get().Global.dateFormat;
const status = CONSTANTS.get().Instance.status;
const triggerText = (dayNo, city) => `Day ${dayNo}: ${city}`;

export default class PackageItinerary extends React.Component {
	constructor (props) {
		super(props);
		const { startDate } = props.transport;
		const likedHotel = _.find(props.hotels, h => {
			return h.isLiked;
		});
		this.state = {
			idxSelected: likedHotel ? likedHotel.id : -1,
			startDate: startDate,
		};
	}

	render () {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		const {
			isCustomised,
			extras,
			transport: { departDates, carOption, totalDays },
			itineraries,
			actions,
		} = this.props;
		const {
			handleSelectHotel,
			handleSelectFlight,
			handleSelectCar,
			handleLikeAttraction,
			handleAddItinerary,
			handleDeleteItinerary,
		} = actions;
		const { startDate } = this.state;
		const doHandleSelectFlight = stStartDate => {
			const sDate = stStartDate ? Moment(stStartDate, dtFormat).toDate() : null;
			const eDate = stStartDate
				? Moment(stStartDate, dtFormat)
						.add(totalDays, 'days')
						.toDate()
				: null;
			handleSelectFlight(sDate, eDate);
			this.setState({ startDate: sDate });
		};
		// Generate itinerary accordion
		const elItineraries = {};
		const stStartDate = startDate ? Moment(startDate).format(dtFormat) : '';
		const stEndDate = startDate
			? Moment(startDate)
					.add(totalDays, 'days')
					.format(dtFormat)
			: '';
		// Add Flight and Cars
		elItineraries['Flight and Car'] = (
			<FlightCar
				isCustomised={isCustomised}
				departDates={departDates}
				selectedDepartDate={stStartDate}
				selectedReturnDate={stEndDate}
				carOptions={extras.carOptions}
				selectedCarOption={carOption}
				handleSelectFlight={doHandleSelectFlight}
				handleSelectCar={handleSelectCar}
			/>
		);

		// Add itinerary for each days
		_.forEach(itineraries, (it, idx) => {
			let secAttraction = '';
			let secHotel = '';
			const title = triggerText(it.dayNo, it.cityBase);
			if (!isCustomised) {
				// always display attraction / hotel icon
				secAttraction = <ItineraryItem attractions={it.attractions} />;
				secHotel = <HotelItem hotels={it.hotels} />;
			} else {
				if (
					extras.statusMember === status.INITIATED
					|| extras.statusMember === status.SELECT_ATTRACTION
				) {
					secAttraction = <ItineraryItem attractions={it.attractions} />;
				} else if (extras.statusMember === status.SELECT_HOTEL) {
					secAttraction = <ItineraryItem attractions={it.attractions} />;
					secHotel = (
						<HotelSlider
							dayNo={it.dayNo}
							hotels={it.hotels}
							handleSelectHotel={handleSelectHotel}
						/>
					);
				} else {
					secAttraction = <ItineraryItem attractions={it.attractions} />;
					secHotel = <HotelItem hotels={it.hotels} />;
				}
			}
			// Display the desciption of package-item
			const desc
				= !isCustomised || idx === 0 || idx === itineraries.length - 1 ? (
					<Typography>{it.cityDesc}</Typography>
				) : (
					''
				);
			elItineraries[title] = (
				<div style={{ width: '-webkit-fill-available' }}>
					{desc}
					{secAttraction}
					{secHotel}
				</div>
			);
		});

		return <ControlledAccordion mapContents={elItineraries} />;
	}
}
