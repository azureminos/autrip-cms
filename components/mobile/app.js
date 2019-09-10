// ==== MODULES ==========================================
import _ from 'lodash';
import Moment from 'moment';
import React from 'react';
import { Paper, Typography } from '@material-ui/core';

// ==== COMPONENTS =======================================
import Helper from '../../lib/helper';
import ModalHelper from '../../lib/bot-modal-helper';
import PackageHelper from '../../lib/package-helper';
import BotModal from './components/bot-modal';
import BotHeader from './components/bot-header';
import FixedTab from './components/fixed-tab';
import PackageAttraction from './package-attraction';
import PackageItinerary from './package-itinerary';
import CONSTANTS from '../../lib/constants';

// ==== CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';

const modal = CONSTANTS.get().Modal;
const global = CONSTANTS.get().Global;
/* ==============================
   = React Application          =
   ============================== */
class MobileApp extends React.Component {
	constructor (props) {
		super(props);

		this.handleModalClose = this.handleModalClose.bind(this);
		this.enablePackageDiy = this.enablePackageDiy.bind(this);
		this.handleLikeAttraction = this.handleLikeAttraction.bind(this);
		this.handleInvalidParticipant = this.handleInvalidParticipant.bind(this);
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
			botModal: '',
			refModal: null,
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
			botModal: '',
		});
	}
	// ----------  Package  ----------
	// ----------  Package Instance -------
	// ----------  Package Instance Items-------
	confirmAddItinerary (ref) {
		console.log('>>>>MobileApp.confirmAddItinerary', ref);
		this.setState({
			botModal: modal.ADD_ITINERARY.key,
			refModal: ref,
		});
	}
	handleAddItinerary () {
		const ref = this.state.refModal;
		console.log('>>>>MobileApp.handleAddItinerary', ref);
		const instPackage = PackageHelper.addItinerary(
			this.state.instPackage,
			ref.dayNo
		);
		this.setState({
			instPackage: instPackage,
			botModal: '',
		});
	}
	handleInvalidParticipant (ref) {
		console.log('>>>>MobileApp.handleErrorParticipant', ref);
		const { total, max, min } = ref;
		if (total > max) {
			this.setState({
				botModal: modal.INVALID_MAX_PARTICIPANT.key,
				refModal: ref,
			});
		} else if (total < min) {
			this.setState({
				botModal: modal.INVALID_MIN_PARTICIPANT.key,
				refModal: ref,
			});
		}
	}
	confirmDeleteItinerary (ref) {
		console.log('>>>>MobileApp.confirmDeleteItinerary', ref);
		this.setState({
			botModal: modal.DELETE_ITINERARY.key,
			refModal: ref,
		});
	}
	handleDeleteItinerary () {
		const ref = this.state.refModal;
		console.log('>>>>MobileApp.handleDeleteItinerary', ref);
		if (ref.isRequired) {
			this.setState({
				botModal: modal.FAILED_DELETE_ITINERARY.key,
			});
		} else {
			const instPackage = PackageHelper.deleteItinerary(
				this.state.instPackage,
				ref.dayNo
			);
			this.setState({
				instPackage: instPackage,
				botModal: '',
			});
		}
	}

	enablePackageDiy () {
		console.log('>>>>MobileApp.enablePackageDiy');
		const { instPackage } = this.state;
		instPackage.isCustomised = true;
		this.setState({
			botModal: '',
		});
	}
	handleLikeAttraction (itinerary, attraction) {
		console.log('>>>>MobileApp.handleLikeAttraction', {
			itinerary,
			attraction,
			instPackage: this.state.instPackage,
		});
		// Functions
		var isOverloaded = itinerary => {
			var timePlannable = itinerary.timePlannable;
			if (timePlannable === 0) {
				return true;
			}
			var timePlanned = 0;
			for (var i = 0; i < itinerary.attractions.length; i++) {
				var attraction = itinerary.attractions[i];
				if (attraction.isLiked) {
					timePlanned
						= timePlanned + attraction.timeTraffic + attraction.timeVisit;
					if (
						i > 0
						&& _.findIndex(itinerary.attractions[i].nearByAttractions, item => {
							return item === itinerary.attractions[i - 1].id;
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
				botModal: modal.ENABLE_DIY.key,
			});
		} else {
			// Package is customised (DIY) already, move on with rest of logic
			const action = attraction.isLiked ? 'DELETE' : 'ADD';
			if (action === 'ADD') {
				if (isOverloaded(itinerary)) {
					// Activities over booked
					this.setState({
						botModal: modal.FULL_ITINERARY.key,
						refModal: itinerary,
					});
				} else {
					// Enough time for extra Activity
					const dayItems = _.groupBy(instPackage.items, item => {
						return item.dayNo;
					});
					const newItem = {
						id: -1,
						isMustVisit: false,
						timePlannable: global.timePlannable,
						description: '',
						dayNo: itinerary.dayNo,
						daySeq: global.idxLastItem,
						attraction: { ...attraction },
					};
					dayItems[itinerary.dayNo].push(newItem);
					instPackage.items = mergeDayItems(dayItems);
					this.setState({ instPackage: instPackage });
				}
			} else if (action === 'DELETE') {
				const dayItems = _.groupBy(instPackage.items, item => {
					return item.dayNo;
				});
				if (dayItems[itinerary.dayNo].length === 1) {
					// Only one activity, can not be deleted
					this.setState({
						botModal: modal.ONLY_ITINERARY.key,
						refModal: itinerary,
					});
				} else {
					const newItems = [];
					_.each(dayItems[itinerary.dayNo], it => {
						if (it.attraction.id !== attraction.id) {
							newItems.push({ ...it });
						}
					});
					dayItems[itinerary.dayNo] = newItems;
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
		const { botModal, refModal, instPackage, userId } = this.state;
		const { rates, reference } = this.props;
		const { packageRates, flightRates } = rates;
		const { cities, packageSummary } = reference;
		rates.carRates = _.map(cities, c => {
			return {
				id: c.id || '',
				name: c.name || '',
				carRates: c.carRates || [],
			};
		});
		console.log('>>>>MobileApp.render >> instPackage', instPackage);
		console.log('>>>>MobileApp.render >> reference', reference);
		console.log('>>>>MobileApp.render >> rates', rates);
		// Variables
		const departDates = _.map(packageSummary.departureDate.split(','), d => {
			return d.trim();
		});
		const transport = {
			departDates: departDates,
			startDate: instPackage.startDate,
			totalDays: instPackage.totalDays,
			carOption: instPackage.carOption,
		};
		const itAttractions = PackageHelper.getItineraryAttractionList({
			isCustomised: instPackage.isCustomised,
			cities,
			packageItems: instPackage.items,
			packageHotels: instPackage.hotels,
		});

		// ======Web Elements======
		// Setup modal element
		const paramModal = ModalHelper.getModal(botModal, this, refModal);
		// Tab item - Attraction
		const elAttractions = (
			<div id="package-attraction">
				<PackageAttraction
					isCustomised={instPackage.isCustomised}
					itAttractions={itAttractions}
					handleLikeAttraction={this.handleLikeAttraction}
					handleAddItinerary={this.confirmAddItinerary}
					handleDeleteItinerary={this.confirmDeleteItinerary}
				/>
			</div>
		);
		// Tab item - Hotel
		const elHotels = (
			<div id="package-itinerary">
				<PackageItinerary
					isCustomised={instPackage.isCustomised}
					rates={rates}
					transport={transport}
					itAttractions={itAttractions}
					handleSelectHotel={this.handleSelectHotel}
					handleSelectFlight={this.handleSelectFlight}
					handleSelectCar={this.handleSelectCar}
				/>
			</div>
		);
		// Tabs
		const tabs = {
			Attraction: elAttractions,
			Itinerary: elHotels,
		};
		// Bot Modal
		const elModal
			= paramModal && botModal ? (
				<BotModal
					isModalOpen={!!botModal}
					title={paramModal.title}
					description={paramModal.description}
					buttons={paramModal.buttons}
					handleModalClose={this.handleModalClose}
				/>
			) : (
				''
			);

		// Display Web Widget
		return (
			<div id="app">
				<Paper>
					<FixedTab tabs={tabs}>
						<BotHeader
							userId={userId}
							instPackage={instPackage}
							rates={rates}
							cities={cities}
							handleInvalidPeople={this.handleInvalidParticipant}
							handleInvalidRoom={this.handleInvalidParticipant}
						/>
					</FixedTab>
					{elModal}
				</Paper>
			</div>
		);
	}
}

export default MobileApp;
