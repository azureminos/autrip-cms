// ==== MODULES ==========================================
import _ from 'lodash';
import Moment from 'moment';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

// ==== COMPONENTS =======================================
import Helper from '../../lib/helper';
import PackageHelper from '../../lib/package-helper';
import BotModal from './components/bot-modal';
import BotHeader from './components/bot-header';
import BotFooter from './components/bot-footer';
import ProgressBar from './components/progress-bar';
import PackageItinerary from './package-itinerary';
import CONSTANTS from '../../lib/constants';

// ==== CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';

const { Modal, Global, Instance } = CONSTANTS.get();

const styles = theme => ({
	appBody: {
		position: 'absolute',
		top: 80,
		left: 0,
		marginLeft: 8,
		marginRight: 8,
		maxHeight: 515,
		overflowY: 'auto',
		width: '98%',
	},
});
/* ==============================
   = React Application          =
   ============================== */
class MobileApp extends React.Component {
	constructor (props) {
		super(props);
		// Register event handler
		this.handleFtBtnBackward = this.handleFtBtnBackward.bind(this);
		this.handleFtBtnForward = this.handleFtBtnForward.bind(this);
		this.handleFtBtnShare = this.handleFtBtnShare.bind(this);
		this.handleFtBtnPayment = this.handleFtBtnPayment.bind(this);
		this.confirmSubmitPayment = this.confirmSubmitPayment.bind(this);
		this.handleFtBtnJoin = this.handleFtBtnJoin.bind(this);
		this.handleFtBtnLeave = this.handleFtBtnLeave.bind(this);
		this.handleFtBtnLock = this.handleFtBtnLock.bind(this);
		this.handleFtBtnStatus = this.handleFtBtnStatus.bind(this);
		this.handleFtBtnCustomise = this.handleFtBtnCustomise.bind(this);
		this.handleFtBtnNoCustomise = this.handleFtBtnNoCustomise.bind(this);
		// tbd
		this.handleModalClose = this.handleModalClose.bind(this);
		this.enablePackageDiy = this.enablePackageDiy.bind(this);
		this.handleLikeAttraction = this.handleLikeAttraction.bind(this);
		this.confirmAddItinerary = this.confirmAddItinerary.bind(this);
		this.handleAddItinerary = this.handleAddItinerary.bind(this);
		this.confirmDeleteItinerary = this.confirmDeleteItinerary.bind(this);
		this.handleDeleteItinerary = this.handleDeleteItinerary.bind(this);
		this.handleSelectHotel = this.handleSelectHotel.bind(this);
		this.handleSelectFlight = this.handleSelectFlight.bind(this);
		this.handleSelectCar = this.handleSelectCar.bind(this);

		var instItems = _.map(props.instPackage.items, item => {
			return item.attraction
				? Helper.enhanceItem(item, props.reference.cities)
				: item;
		});
		var instHotels = _.map(props.instPackage.hotels, hotel => {
			return hotel.hotel
				? Helper.enhanceHotel(hotel, props.reference.cities)
				: hotel;
		});

		this.state = {
			updating: false,
			message: '',
			modalType: '',
			modalRef: null,
			userId: props.userId,
			instPackage: {
				...props.instPackage,
				items: instItems,
				hotels: instHotels,
			},
		};
	}

	/* ==============================
	   = Helper Methods             =
	   ============================== */

	/* ==============================
	   = State & Event Handlers     =
	   ============================== */
	// ----------  App  ----------
	handleModalClose () {
		console.log('>>>>MobileApp.handleModalClose');
		this.setState({
			modalType: '',
		});
	}
	// ----------  BotFooter  ----------
	handleFtBtnCustomise () {
		console.log('>>>>MobileApp.handleFtBtnCustomise');
		const { instPackage, userId } = this.state;
		for (var i = 0; i < instPackage.members.length; i++) {
			if (instPackage.members[i].loginId === userId) {
				instPackage.members[i].status = Instance.status.INITIATED;
			}
		}
		instPackage.isCustomised = true;
		this.setState({ instPackage: instPackage });
	}
	handleFtBtnNoCustomise () {
		console.log('>>>>MobileApp.handleFtBtnNoCustomise');
		const { instPackage, userId } = this.state;
		for (var i = 0; i < instPackage.members.length; i++) {
			if (instPackage.members[i].loginId === userId) {
				instPackage.members[i].status = Instance.status.INITIATED;
			}
		}
		instPackage.isCustomised = false;
		this.setState({ instPackage: instPackage });
	}
	handleFtBtnBackward () {
		console.log('>>>>MobileApp.handleFtBtnBackward');
		const { instPackage, userId } = this.state;
		for (var i = 0; i < instPackage.members.length; i++) {
			if (instPackage.members[i].loginId === userId) {
				instPackage.members[i].status = PackageHelper.getPreviousStatus(
					instPackage.isCustomised,
					instPackage.members[i].status
				);
			}
		}
		this.setState({ instPackage: instPackage });
	}
	handleFtBtnForward () {
		console.log('>>>>MobileApp.handleFtBtnForward');
		const { instPackage, userId } = this.state;
		if (PackageHelper.validateInstance(instPackage, userId)) {
			for (var i = 0; i < instPackage.members.length; i++) {
				if (instPackage.members[i].loginId === userId) {
					instPackage.members[i].status = PackageHelper.getNextStatus(
						instPackage.isCustomised,
						instPackage.members[i].status
					);
				}
			}
			this.setState({ instPackage: instPackage });
		} else {
			// Todo
		}
	}
	handleFtBtnShare () {
		console.log('>>>>MobileApp.handleFtBtnShare');
	}
	handleFtBtnPayment (outcome) {
		console.log('>>>>MobileApp.handleFtBtnPayment', outcome);
		const { instPackage, userId } = this.state;
		if (PackageHelper.validateInstance(instPackage, userId)) {
			instPackage.status = outcome.status;
			this.setState({
				instPackage: instPackage,
				modalType: '',
				modalRef: null,
			});
		} else {
			// Todo
		}
	}
	handleFtBtnJoin () {
		console.log('>>>>MobileApp.handleFtBtnJoin');
	}
	handleFtBtnLeave () {
		console.log('>>>>MobileApp.handleFtBtnLeave');
	}
	handleFtBtnLock () {
		console.log('>>>>MobileApp.handleFtBtnLock');
	}
	handleFtBtnStatus () {
		console.log('>>>>MobileApp.handleFtBtnStatus');
	}
	// ----------  Payment  ---------
	confirmSubmitPayment () {
		const { instPackage } = this.state;
		console.log('>>>>MobileApp.confirmSubmitPayment', instPackage);
		const ref = {
			dtStart: new Date(),
			dtEnd: new Date(),
			people: 0,
			rooms: 0,
			rate: 0,
			totalRate: 0,
		};
		this.setState({
			modalType: Modal.SUBMIT_PAYMENT.key,
			modalRef: ref,
		});
	}
	// ----------  Itinerary  -------
	confirmAddItinerary (ref) {
		console.log('>>>>MobileApp.confirmAddItinerary', ref);
		this.setState({
			modalType: Modal.ADD_ITINERARY.key,
			modalRef: ref,
		});
	}
	handleAddItinerary () {
		const ref = this.state.modalRef;
		const userId = this.state.userId;
		console.log('>>>>MobileApp.handleAddItinerary', ref);
		const instPackage = PackageHelper.addItinerary(
			this.state.instPackage,
			ref.dayNo
		);
		if (PackageHelper.validateInstance(instPackage, userId)) {
			for (var i = 0; i < instPackage.members.length; i++) {
				if (instPackage.members[i].loginId === userId) {
					instPackage.members[i].status = Instance.status.SELECT_ATTRACTION;
					break;
				}
			}
			this.setState({
				instPackage: instPackage,
				modalType: '',
			});
		} else {
			// Todo
		}
	}
	confirmDeleteItinerary (ref) {
		console.log('>>>>MobileApp.confirmDeleteItinerary', ref);
		this.setState({
			modalType: Modal.DELETE_ITINERARY.key,
			modalRef: ref,
		});
	}
	handleDeleteItinerary () {
		const ref = this.state.modalRef;
		const userId = this.state.userId;
		console.log('>>>>MobileApp.handleDeleteItinerary', ref);
		if (ref.isRequired) {
			this.setState({
				modalType: Modal.FAILED_DELETE_ITINERARY.key,
			});
		} else {
			const instPackage = PackageHelper.deleteItinerary(
				this.state.instPackage,
				ref.dayNo
			);
			if (PackageHelper.validateInstance(instPackage, userId)) {
				for (var i = 0; i < instPackage.members.length; i++) {
					if (instPackage.members[i].loginId === userId) {
						instPackage.members[i].status = Instance.status.SELECT_HOTEL;
						break;
					}
				}
				this.setState({
					instPackage: instPackage,
					modalType: '',
				});
			} else {
				// Todo
			}
		}
	}

	enablePackageDiy () {
		console.log('>>>>MobileApp.enablePackageDiy');
		const { instPackage } = this.state;
		instPackage.isCustomised = true;
		this.setState({
			modalType: '',
		});
	}
	handleLikeAttraction (dayNo, timePlannable, item, attractions) {
		console.log('>>>>MobileApp.handleLikeAttraction', {
			dayNo,
			item,
			attractions,
			instPackage: this.state.instPackage,
		});
		// Functions
		var isOverloaded = attractions => {
			if (timePlannable === 0) {
				return true;
			}
			var timePlanned = 0;
			for (var i = 0; i < attractions.length; i++) {
				var attraction = attractions[i];
				if (attraction.isLiked) {
					timePlanned
						= timePlanned + attraction.timeTraffic + attraction.timeVisit;
					if (
						i > 0
						&& _.findIndex(attractions[i].nearByAttractions, item => {
							return item === attractions[i - 1].id;
						}) > -1
					) {
						timePlanned = timePlanned - 1;
					}
				}
			}
			return timePlannable <= timePlanned;
		};
		var mergeDayItems = dayItems => {
			var items = [];
			var days = Object.keys(dayItems);
			_.each(days, day => {
				_.each(dayItems[day], item => {
					items.push(item);
				});
			});
			return items;
		};
		// Logic starts here
		const { instPackage } = this.state;
		if (!instPackage.isCustomised) {
			// Package is not customised (DIY) yet, ask customer to confirm enabling DIY
			this.setState({
				modalType: Modal.ENABLE_DIY.key,
			});
		} else {
			// Package is customised (DIY) already, move on with rest of logic
			const action = item.isLiked ? 'DELETE' : 'ADD';
			if (action === 'ADD') {
				if (isOverloaded(attractions)) {
					// Activities over booked
					this.setState({
						modalType: Modal.FULL_ITINERARY.key,
						modalRef: { dayNo: dayNo },
					});
				} else {
					// Enough time for extra Activity
					const dayItems = _.groupBy(instPackage.items, item => {
						return item.dayNo;
					});
					const newItem = {
						id: -1,
						isMustVisit: false,
						timePlannable: Global.timePlannable,
						description: '',
						dayNo: dayNo,
						daySeq: Global.idxLastItem,
						attraction: { ...item },
					};
					dayItems[dayNo].push(newItem);
					instPackage.items = mergeDayItems(dayItems);
					this.setState({ instPackage: instPackage });
				}
			} else if (action === 'DELETE') {
				const dayItems = _.groupBy(instPackage.items, item => {
					return item.dayNo;
				});
				if (dayItems[dayNo].length === 1) {
					// Only one activity, can not be deleted
					this.setState({
						modalType: Modal.ONLY_ITINERARY.key,
						modalRef: { dayNo: dayNo },
					});
				} else {
					const newItems = [];
					_.each(dayItems[dayNo], it => {
						if (it.attraction.id !== item.id) {
							newItems.push({ ...it });
						}
					});
					dayItems[dayNo] = newItems;
					instPackage.items = mergeDayItems(dayItems);
					this.setState({ instPackage: instPackage });
				}
			}
		}
	}
	// ----------  Package Instance Hotel  ----------
	handleSelectHotel (dayNo, item) {
		const { instPackage } = this.state;
		console.log('>>>>MobileApp.handleSelectHotel', instPackage);
		for (var i = 0; i < instPackage.hotels.length; i++) {
			const hotel = instPackage.hotels[i];
			if (Number(hotel.dayNo) === Number(dayNo)) {
				const city = hotel.hotel.city;
				hotel.hotel = { ...item, city };
			}
		}
		this.setState({ instPackage: instPackage });
	}
	// ----------  Package Instance Flight  ----------
	handleSelectFlight (startDate, endDate) {
		// console.log(`>>>>MobileApp.handleSelectFlight`, { startDate, endDate });
		const { instPackage } = this.state;
		instPackage.startDate = startDate;
		instPackage.endDate = endDate;
		this.setState({ instPackage: instPackage });
	}
	// ----------  Package Instance Car  ----------
	handleSelectCar (selectedVal) {
		console.log(`>>>>MobileApp.handleSelectCar`, selectedVal);
		const { instPackage } = this.state;
		instPackage.carOption = selectedVal;
	}
	/* ==============================
	   = React Lifecycle            =
	   ============================== */
	componentWillMount () {
		// Do nothing
	}

	render () {
		const { modalType, modalRef, instPackage, userId } = this.state;
		const { classes, rates, reference } = this.props;
		const { packageRates, flightRates } = rates;
		const { cities, packageSummary } = reference;

		console.log('>>>>MobileApp.render >> instPackage', instPackage);
		console.log('>>>>MobileApp.render >> reference', reference);
		console.log('>>>>MobileApp.render >> rates', rates);

		// Variables
		rates.carRates = _.map(cities, c => {
			return {
				id: c.id || '',
				name: c.name || '',
				carRates: c.carRates || [],
			};
		});
		const extras = PackageHelper.enhanceInstance(instPackage, userId);
		extras.carOptions = instPackage.isCustomised
			? Helper.getValidCarOptions(rates.carRates)
			: [instPackage.carOption];

		const departDates = _.map(packageSummary.departureDate.split(','), d => {
			return d.trim();
		});
		const transport = {
			departDates: departDates,
			startDate: instPackage.startDate,
			totalDays: instPackage.totalDays,
			carOption: instPackage.carOption,
		};
		const itineraries = PackageHelper.getFullItinerary({
			isCustomised: instPackage.isCustomised,
			cities: cities,
			packageItems: instPackage.items,
			packageHotels: instPackage.hotels,
		});
		const footerActions = {
			handleBackward: this.handleFtBtnBackward,
			handleForward: this.handleFtBtnForward,
			handleShare: this.handleFtBtnShare,
			handlePay: this.confirmSubmitPayment,
			handleJoin: this.handleFtBtnJoin,
			handleLeave: this.handleFtBtnLeave,
			handleLock: this.handleFtBtnLock,
			handleStatus: this.handleFtBtnStatus,
			handleCustomise: this.handleFtBtnCustomise,
			handleCancelCustomise: this.handleFtBtnNoCustomise,
		};
		const itineraryActions = {
			handleSelectHotel: this.handleSelectHotel,
			handleSelectFlight: this.handleSelectFlight,
			handleSelectCar: this.handleSelectCar,
			handleLikeAttraction: this.handleLikeAttraction,
			handleAddItinerary: this.confirmAddItinerary,
			handleDeleteItinerary: this.confirmDeleteItinerary,
		};
		const modalActions = {
			handleModalClose: this.handleModalClose,
			handleDeleteItinerary: this.handleDeleteItinerary,
			handleAddItinerary: this.handleAddItinerary,
			handlePayment: this.handleFtBtnPayment,
		};

		// ======Web Elements======
		// Bot Modal
		const elModal = modalType ? (
			<BotModal modal={modalType} actions={modalActions} reference={modalRef} />
		) : (
			''
		);

		// Display Web Widget
		return (
			<div id="app">
				<BotHeader userId={userId} instPackage={instPackage} rates={rates} />
				<div className={classes.appBody}>
					<ProgressBar
						step={extras.step}
						isCustomised={instPackage.isCustomised}
					/>
					<PackageItinerary
						isCustomised={instPackage.isCustomised}
						rates={rates}
						transport={transport}
						itineraries={itineraries}
						extras={extras}
						actions={itineraryActions}
					/>
				</div>
				<BotFooter
					instPackage={instPackage}
					extras={extras}
					actions={footerActions}
				/>
				{elModal}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(MobileApp);
