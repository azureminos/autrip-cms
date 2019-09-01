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
/* ==============================
   = React Application          =
   ============================== */
class MobileApp extends React.Component {
	constructor (props) {
		super(props);

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
			botModal: '',
			refModal: null,
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
	confirmAddItinerary (it) {
		console.log('>>>>MobileApp.confirmAddItinerary', it);
		this.setState({
			botModal: modal.ADD_ITINERARY.key,
			refModal: it,
		});
	}
	handleAddItinerary () {
		const it = this.state.refModal;
		console.log('>>>>MobileApp.handleAddItinerary', it);
		const instPackage = PackageHelper.addItinerary(
			this.state.instPackage,
			it.dayNo
		);
		this.setState({
			instPackage: instPackage,
			botModal: '',
		});
	}
	confirmDeleteItinerary (it) {
		console.log('>>>>MobileApp.confirmDeleteItinerary', it);
		this.setState({
			botModal: modal.DELETE_ITINERARY.key,
			refModal: it,
		});
	}
	handleDeleteItinerary () {
		const it = this.state.refModal;
		console.log('>>>>MobileApp.handleDeleteItinerary', it);
		if (it.isRequired) {
			this.setState({
				botModal: modal.FAILED_DELETE_ITINERARY.key,
			});
		} else {
			const instPackage = PackageHelper.deleteItinerary(
				this.state.instPackage,
				it.dayNo
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
	handleLikeAttraction (attraction) {
		// Functions
		var isPlannable = dayItem => {
			return dayItem && dayItem.length > 0 && dayItem[0].timePlannable > 0;
		};
		var isOverloaded = dayItem => {
			var timePlannable = dayItem[0].timePlannable;
			if (timePlannable === 0) {
				return true;
			}
			var timePlanned = 0;
			for (var i = 0; i < dayItem.length; i++) {
				var attraction = dayItem[i].attraction;
				timePlanned
					= timePlanned + attraction.timeTraffic + attraction.timeVisit;
				if (
					i > 0
					&& _.findIndex(dayItem[i].attraction.nearByAttractions, item => {
						return item === dayItem[i - 1].attraction.id;
					}) > -1
				) {
					timePlanned = timePlanned - 1;
				}
			}
			return timePlannable <= timePlanned;
		};
		var isSameCity = (item, comp, cities) => {
			var iCity = Helper.findCityByAttraction(item.id, cities);
			var cCity = Helper.findCityByAttraction(comp[0].attraction.id, cities);
			return iCity === cCity;
		};
		var getLastNearby = (item, dayItems) => {
			var pos = null;
			var days = Object.keys(dayItems);
			for (var i = 0; i < days.length; i++) {
				var iDayItem = dayItems[days[i]];
				if (!isOverloaded(iDayItem)) {
					for (var n = 0; n < iDayItem.length; n++) {
						if (
							_.findIndex(
								iDayItem[n].attraction.nearByAttractions || [],
								nba => {
									return nba === item.id;
								}
							) > -1
						) {
							pos = { dayNo: iDayItem[n].dayNo, daySeq: iDayItem[n].daySeq };
						}
					}
				}
			}
			return pos;
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
		var { instPackage, message } = this.state;
		var { reference } = this.props;
		var { cities } = reference;
		var instItems = instPackage.items;
		console.log(
			`>>>>MobileApp.setLikedAttractions, isCustomised[${instPackage.isCustomised}]`,
			attraction
		);

		if (!instPackage.isCustomised) {
			// Package is not customised (DIY) yet, ask customer to confirm enabling DIY
			this.setState({
				botModal: modal.ENABLE_DIY.key,
			});
		} else {
			// Package is customised (DIY) already, move on with rest of logic
			this.setState({ updating: true });
			var action = attraction.isLiked ? 'DELETE' : 'ADD';

			var dayItems = _.groupBy(instItems, item => {
				return item.dayNo;
			});
			var posLastNearby = getLastNearby(attraction, dayItems);
			// Logic starts here
			var isAddible = false;
			if (action === 'ADD') {
				if (posLastNearby) {
					isAddible = true;
					// Do something
					var dayItem = dayItems[posLastNearby.dayNo];
					for (var i = dayItem.length; i >= posLastNearby.daySeq; i--) {
						dayItem[i] = dayItem[i] || {};
						dayItem[i].id = dayItem[i].id || '-1';
						dayItem[i].dayNo = dayItem[i - 1].dayNo;
						dayItem[i].daySeq = dayItem[i - 1].daySeq + 1;
						dayItem[i].attraction = dayItem[i - 1].attraction;
						dayItem[i].timePlannable = dayItem[i - 1].timePlannable;
					}
					dayItem[posLastNearby.daySeq - 1].attraction = attraction;
					instPackage.items = mergeDayItems(dayItems);
					this.setState({ updating: false, instPackage: instPackage });
				} else {
					// Group by Day
					var days = Object.keys(dayItems);
					for (var i = 0; i < days.length; i++) {
						var dayItem = dayItems[days[i]];
						if (
							isPlannable(dayItem)
							&& isSameCity(attraction, dayItem, cities)
							&& !isOverloaded(dayItem)
						) {
							isAddible = true;
							// Do something
							var idx = dayItem.length;
							dayItem[idx] = {};
							dayItem[idx].id = '-1';
							dayItem[idx].dayNo = dayItem[idx - 1].dayNo;
							dayItem[idx].daySeq = dayItem[idx - 1].daySeq + 1;
							dayItem[idx].attraction = attraction;
							dayItem[idx].timePlannable = dayItem[idx - 1].timePlannable;
							instPackage.items = mergeDayItems(dayItems);
							this.setState({ updating: false, instPackage: instPackage });
							break;
						}
					}
				}
				if (!isAddible) {
					// Do nothing but show warning message
					this.setState({
						updating: false,
						message: 'You have a full itinerary.',
					});
				}
			} else if (action === 'DELETE') {
				var days = Object.keys(dayItems);
				for (var i = 0; i < days.length; i++) {
					var dayItem = dayItems[days[i]];
					var idx = _.findIndex(dayItem, item => {
						return (
							attraction.id === (item.attraction ? item.attraction.id : null)
						);
					});

					if (idx > -1 && dayItem.length === 1) {
						// if it's the only item of the day, show warning and ignore the change
						this.setState({
							updating: false,
							message:
								'Can not remove. It is the only attraction to visit for that day.',
						});
						break;
					} else if (idx > -1 && dayItem.length > 1) {
						// if not the only item of the day, allow change
						dayItem.splice(idx, 1);
						_.each(dayItem, (item, index) => {
							item.daySeq = index + 1;
						});
						instPackage.items = mergeDayItems(dayItems);
						this.setState({ updating: false, instPackage: instPackage });
						break;
					}
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
		// this.setState({ instPackage: instPackage });
	}
	// ----------  Package Instance Flight  ----------
	handleSelectFlight (startDate, endDate) {
		console.log(`>>>>MobileApp.handleSelectFlight`, { startDate, endDate });
		const { instPackage } = this.state;
		instPackage.startDate = startDate;
		instPackage.endDate = endDate;
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
		const { botModal, refModal, instPackage } = this.state;
		const { rates, reference } = this.props;
		const { packageRates, flightRates, hotelRates } = rates;
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
		const itAttractions = Helper.getItineraryAttractionList({
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
		const tabs = {};
		if (instPackage.isCustomised) {
			tabs.Attraction = elAttractions;
			tabs.Hotel = elHotels;
		} else {
			tabs.Itinerary = elAttractions;
		}
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
							instPackage={instPackage}
							rates={rates}
							cities={cities}
						/>
					</FixedTab>
					{elModal}
				</Paper>
			</div>
		);
	}
}

export default MobileApp;
