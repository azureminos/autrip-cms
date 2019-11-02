import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Fab } from '@material-ui/core';
import FlightCar from './components/flight-car';
import HotelSlider from './components/hotel-slider';
import HotelList from './components/hotel-list';
import AttractionSlider from './components/attraction-slider';
import AttractionList from './components/attraction-list';
import DescPanel from './components/description-panel';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';

const dtFormat = CONSTANTS.get().Global.dateFormat;
const InstanceStatus = CONSTANTS.get().Instance.status;
const triggerText = (dayNo, city) => `Day ${dayNo}: ${city}`;

const styles = theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular,
	},
	accodionTitleText: {
		float: 'left',
		paddingRight: 8,
	},
	accodionTitleIcon: {
		float: 'right',
		margin: 4,
	},
	accodionSummary: {
		display: 'flex',
		alignItems: 'center',
	},
	itinerary: {
		border: '1px solid',
		borderColor: 'lightgrey',
		padding: '4px',
		margin: '4px',
	},
	dayCity: {
		display: 'table',
		clear: 'both',
		width: '100%',
	},
	titleDayCity: {
		float: 'left',
	},
	iconDayCity: {
		float: 'right',
		margin: '8px',
	},
});
class PackageItinerary extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		this.doHandleSelectFlight = this.doHandleSelectFlight.bind(this);
		// Init data
		const { startDate } = props.transport;
		const likedHotel = _.find(props.hotels, h => {
			return h.isLiked;
		});
		// Setup state
		this.state = {
			idxSelected: likedHotel ? likedHotel.id : -1,
			startDate: startDate,
		};
	}
	// Event Handlers
	doHandleSelectFlight (stStartDate) {
		const sDate = stStartDate ? Moment(stStartDate, dtFormat).toDate() : null;
		const eDate = stStartDate
			? Moment(stStartDate, dtFormat)
					.add(this.props.transport.totalDays, 'days')
					.toDate()
			: null;
		this.props.actions.handleSelectFlight(sDate, eDate);
		this.setState({ startDate: sDate });
	}
	// Display Widget
	render () {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		// Local variables
		const {
			classes,
			isCustomised,
			status,
			transport: { totalDays, departDates, carOption, carOptions },
			itineraries,
			actions,
		} = this.props;
		const {
			handleSelectHotel,
			handleSelectCar,
			handleLikeAttraction,
			handleAddItinerary,
			handleDeleteItinerary,
		} = actions;
		const { startDate } = this.state;
		const isDisabled = status === InstanceStatus.PENDING_PAYMENT;
		const stStartDate = startDate ? Moment(startDate).format(dtFormat) : '';
		const stEndDate = startDate
			? Moment(startDate)
					.add(totalDays, 'days')
					.format(dtFormat)
			: '';
		// Sub Widgets
		const secFlightCar = (
			<FlightCar
				isDisabled={isDisabled}
				departDates={departDates}
				selectedDepartDate={stStartDate}
				selectedReturnDate={stEndDate}
				carOptions={carOptions}
				selectedCarOption={carOption}
				handleSelectFlight={this.doHandleSelectFlight}
				handleSelectCar={handleSelectCar}
			/>
		);
		// Add itinerary for each days
		const secItinerary = _.map(itineraries, (it, idx) => {
			// Event Handlers
			const doHandleAddItinerary = () => {
				// console.log('>>>>PackageItinerary.doHandleAddItinerary', it);
				handleAddItinerary(it);
			};
			const doHandleDeleteItinerary = () => {
				// console.log('>>>>PackageItinerary.doHandleDeleteItinerary', it);
				handleDeleteItinerary(it);
			};
			// Local Variables
			const title = triggerText(it.dayNo, it.cityVisit);
			const isDayChangable
				= isCustomised && idx !== 0 && idx !== itineraries.length - 1;
			// Sub components
			let secAttraction = '';
			let secHotel = '';
			let btnDelete = '';
			let btnAdd = '';
			if (!isCustomised) {
				// always display attraction / hotel icon
				secAttraction = <AttractionList attractions={it.attractions} />;
				secHotel = <HotelList hotels={it.hotels} />;
			} else {
				if (
					status === InstanceStatus.INITIATED
					|| status === InstanceStatus.SELECT_ATTRACTION
				) {
					secAttraction = (
						<div>
							<AttractionList attractions={it.attractions} />
							<AttractionSlider
								dayNo={it.dayNo}
								timePlannable={it.timePlannable}
								attractions={it.attractions}
								handleLikeAttraction={handleLikeAttraction}
							/>
						</div>
					);
					secHotel = <HotelList hotels={it.hotels} />;
					btnDelete = isDayChangable ? (
						<Fab
							size="small"
							color="secondary"
							aria-label="delete"
							onClick={doHandleDeleteItinerary}
							className={classes.iconDayCity}
						>
							<DeleteIcon />
						</Fab>
					) : (
						''
					);
					btnAdd = isDayChangable ? (
						<Fab
							size="small"
							color="primary"
							aria-label="add"
							onClick={doHandleAddItinerary}
							className={classes.iconDayCity}
						>
							<AddIcon />
						</Fab>
					) : (
						''
					);
				} else if (status === InstanceStatus.SELECT_HOTEL) {
					secAttraction = <AttractionList attractions={it.attractions} />;
					secHotel = (
						<div>
							<HotelList hotels={it.hotels} />
							<HotelSlider
								dayNo={it.dayNo}
								hotels={it.hotels}
								handleSelectHotel={handleSelectHotel}
							/>
						</div>
					);
					btnDelete = isDayChangable ? (
						<Fab
							size="small"
							color="secondary"
							aria-label="delete"
							onClick={doHandleDeleteItinerary}
							className={classes.iconDayCity}
						>
							<DeleteIcon />
						</Fab>
					) : (
						''
					);
					btnAdd = isDayChangable ? (
						<Fab
							size="small"
							color="primary"
							aria-label="add"
							onClick={doHandleAddItinerary}
							className={classes.iconDayCity}
						>
							<AddIcon />
						</Fab>
					) : (
						''
					);
				} else {
					secAttraction = <AttractionList attractions={it.attractions} />;
					secHotel = <HotelList hotels={it.hotels} />;
				}
			}

			return (
				<div key={it.dayNo} className={classes.itinerary}>
					<Typography variant="h5" gutterBottom className={classes.dayCity}>
						<div className={classes.titleDayCity}>{title}</div>
						{btnDelete}
						{btnAdd}
					</Typography>
					<DescPanel descShort={it.cityDescShort} descFull={it.cityDesc} />
					{secAttraction}
					{secHotel}
				</div>
			);
		});

		/* _.forEach(itineraries, (it, idx) => {
			let secAttraction = '';
			let secHotel = '';
			const title = triggerText(it.dayNo, it.cityBase);
			if (!isCustomised) {
				// always display attraction / hotel icon
				secAttraction = <AttractionList attractions={it.attractions} />;
				secHotel = <HotelList hotels={it.hotels} />;
			} else {
				if (
					status === InstanceStatus.INITIATED
					|| status === InstanceStatus.SELECT_ATTRACTION
				) {
					secAttraction = <AttractionList attractions={it.attractions} />;
				} else if (status === InstanceStatus.SELECT_HOTEL) {
					secAttraction = <AttractionList attractions={it.attractions} />;
					secHotel = (
						<HotelSlider
							dayNo={it.dayNo}
							hotels={it.hotels}
							handleSelectHotel={handleSelectHotel}
						/>
					);
				} else {
					secAttraction = <AttractionList attractions={it.attractions} />;
					secHotel = <HotelList hotels={it.hotels} />;
				}
			}
			// Display the desciption of package-item
			const desc
				= !isCustomised || idx === 0 || idx === itineraries.length - 1 ? (
					<Typography>{it.cityDesc}</Typography>
				) : (
					''
				);
			// Display Add icon
			const iconAdd
				= isCustomised && it.isClonable > 0 ? (
					<Fab
						size="small"
						color="secondary"
						aria-label="add"
						className={classes.accodionTitleIcon}
						style={{ padding: '0px' }}
					>
						<AddIcon />
					</Fab>
				) : (
					''
				);
			// Display Delete icon
			const iconDelete
				= isCustomised && !it.isRequired ? (
					<Fab
						size="small"
						color="secondary"
						aria-label="delete"
						className={classes.accodionTitleIcon}
						style={{ padding: '0px' }}
					>
						<DeleteIcon />
					</Fab>
				) : (
					''
				);
			// Display Edit icon
			const iconEdit
				= isCustomised && it.timePlannable > 0 ? (
					<Fab
						size="small"
						color="secondary"
						aria-label="edit"
						className={classes.accodionTitleIcon}
						style={{ padding: '0px' }}
					>
						<EditIcon />
					</Fab>
				) : (
					''
				);
			accordions.push(
				<ExpansionPanel
					key={title}
					expanded={panelMap[title]}
					onChange={this.doHandleAccordionClick(title)}
				>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon />}
						classes={{ content: classes.accodionSummary }}
					>
						<Typography className={classes.accodionTitleText} variant="h5">
							{title}
						</Typography>
						{iconAdd}
						{iconEdit}
						{iconDelete}
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<div style={{ width: '-webkit-fill-available' }}>
							{desc}
							{secAttraction}
							{secHotel}
						</div>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			);
		});*/

		return <section>{[secFlightCar].concat(secItinerary)}</section>;
	}
}

export default withStyles(styles, { withTheme: true })(PackageItinerary);
