import _ from 'lodash';
import React from 'react';
import Moment from 'moment';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Fab } from '@material-ui/core';
import {
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HotelSlider from './components/hotel-slider';
import FlightCar from './components/flight-car';
import ItineraryItem from './components/itinerary-item';
import HotelItem from './components/hotel-item';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';

const dtFormat = CONSTANTS.get().Global.dateFormat;
const status = CONSTANTS.get().Instance.status;
const triggerText = (dayNo, city) => `Day ${dayNo}: ${city}`;
const titleFlightCar = 'Flight and Car';

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
});
class PackageItinerary extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		this.doHandleAccordionClick = this.doHandleAccordionClick.bind(this);
		this.doHandleSelectFlight = this.doHandleSelectFlight.bind(this);
		// Init data
		const { startDate } = props.transport;
		const likedHotel = _.find(props.hotels, h => {
			return h.isLiked;
		});
		const panelMap = {};
		panelMap[titleFlightCar] = true;
		_.each(this.props.itineraries, it => {
			const title = triggerText(it.dayNo, it.cityBase);
			panelMap[title] = true;
		});
		// Setup state
		this.state = {
			panelMap: panelMap,
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
		this.props.handleSelectFlight(sDate, eDate);
		this.setState({ startDate: sDate });
	}
	doHandleAccordionClick (panel) {
		return (event, expanded) => {
			console.log('>>>>ControlledAccordion, handleChange()', {
				panel: panel,
				expanded: expanded,
			});
			const that = this;
			const { panelMap } = that.state;
			const clicked = that.state.clicked + 1;
			panelMap[panel] = !panelMap[panel];
			that.setState({
				panelMap: panelMap,
				clicked: clicked,
			});
		};
	}
	// Display Widget
	render () {
		console.log('>>>>PackageItinerary, Start render with props', this.props);
		const {
			classes,
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
		const { startDate, panelMap } = this.state;
		// Sub Widgets
		const accordions = [];
		const stStartDate = startDate ? Moment(startDate).format(dtFormat) : '';
		const stEndDate = startDate
			? Moment(startDate)
					.add(totalDays, 'days')
					.format(dtFormat)
			: '';
		// Add Flight and Cars
		accordions.push(
			<ExpansionPanel
				key={titleFlightCar}
				expanded={panelMap[titleFlightCar]}
				onChange={this.doHandleAccordionClick(titleFlightCar)}
			>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					classes={{ content: classes.accodionSummary }}
				>
					<Typography className={classes.accodionTitleText} variant="h5">
						{titleFlightCar}
					</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<FlightCar
						isCustomised={isCustomised}
						departDates={departDates}
						selectedDepartDate={stStartDate}
						selectedReturnDate={stEndDate}
						carOptions={extras.carOptions}
						selectedCarOption={carOption}
						handleSelectFlight={this.doHandleSelectFlight}
						handleSelectCar={handleSelectCar}
					/>
				</ExpansionPanelDetails>
			</ExpansionPanel>
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
		});

		return <div>{accordions}</div>;
	}
}

export default withStyles(styles, { withTheme: true })(PackageItinerary);
