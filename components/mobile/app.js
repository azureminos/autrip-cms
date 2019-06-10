// ==== MODULES ==========================================
import _ from 'lodash';
import Moment from 'moment';
import React from 'react';
import { Paper, Typography } from '@material-ui/core';

// ==== COMPONENTS =======================================
import Helper from '../../lib/helper';
import BotModal from './components/bot-modal';
import BotHeader from './components/bot-header';
import FixedTab from './components/fixed-tab';
import PackageAttraction from './package-attraction';
import PackageItinerary from './package-itinerary';

// ==== CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';

/* ==============================
   = React Application          =
   ============================== */

class MobileApp extends React.Component {
	constructor (props) {
		super(props);

		this.handleModalDiyClose = this.handleModalDiyClose.bind(this);
		this.enablePackageDiy = this.enablePackageDiy.bind(this);
		this.handleLikeAttraction = this.handleLikeAttraction.bind(this);
		this.handleSelectHotel = this.handleSelectHotel.bind(this);
		this.handleSelectFlight = this.handleSelectFlight.bind(this);
		this.handleSelectCar = this.handleSelectCar.bind(this);

		var instItems = _.map(props.instPackage.items, (item) => {
			return item.attraction ? Helper.enhanceItem(item, props.reference.cities) : item;
		});

		this.state = {
			updating: false,
			message: '',
			flagModal: {
				modalDiy: false,
			},
			instPackage: { ...props.instPackage, items: instItems },
		};
	}

	/* ==============================
	   = Helper Methods             =
	   ============================== */


	/* ==============================
	   = State & Event Handlers     =
	   ============================== */
	// ----------  Package  ----------
	// ----------  Package Instance -------
	// ----------  Package Instance Items-------
	handleModalDiyClose () {
		console.log('>>>>MobileApp.handleModalDiyClose');
		const { flagModal } = this.state;
		this.setState({ updating: false, flagModal: { ...flagModal, modalDiy: false } });
	}
	enablePackageDiy () {
		console.log('>>>>MobileApp.enablePackageDiy');
		const { flagModal, instPackage } = this.state;
		this.setState({ updating: false, instPackage: { ...instPackage, isCustomised: true }, flagModal: { ...flagModal, modalDiy: false } });
	}
	handleLikeAttraction (attraction) {
		// Functions
		var isPlannable = (dayItem) => {
			return dayItem && dayItem.length > 0 && dayItem[0].timePlannable > 0;
		};
		var isOverloaded = (dayItem) => {
			var timePlannable = dayItem[0].timePlannable;
			if (timePlannable === 0) {
				return true;
			}
			var timePlanned = 0;
			for (var i = 0; i < dayItem.length; i++) {
				var attraction = dayItem[i].attraction;
				timePlanned = timePlanned + attraction.timeTraffic + attraction.timeVisit;
				if (i > 0 && _.findIndex(dayItem[i].attraction.nearByAttractions, (item) => { return item === dayItem[i - 1].attraction.id; }) > -1) {
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
						if (_.findIndex((iDayItem[n].attraction.nearByAttractions || []), (nba) => {
							return nba === item.id;
						}) > -1) {
							pos = { dayNo: iDayItem[n].dayNo, daySeq: iDayItem[n].daySeq };
						}
					}
				}
			}
			return pos;
		};
		var mergeDayItems = (dayItems) => {
			var items = [];
			var days = Object.keys(dayItems);
			_.each(days, (day) => {
				_.each(dayItems[day], (item) => {
					items.push(item);
				});
			});
			return items;
		};
		// Logic starts here
		var { flagModal, instPackage, message } = this.state;
		var { reference } = this.props;
		var { cities } = reference;
		var instItems = instPackage.items;
		console.log(`>>>>MobileApp.setLikedAttractions, isCustomised[${instPackage.isCustomised}]`, attraction);

		if (!instPackage.isCustomised) {
			// Package is not customised (DIY) yet, ask customer to confirm enabling DIY
			this.setState({ updating: true, flagModal: { ...flagModal, modalDiy: true } });
		} else {
			// Package is customised (DIY) already, move on with rest of logic
			this.setState({ updating: true });
			var action = attraction.isLiked ? 'DELETE' : 'ADD';

			var dayItems = _.groupBy(instItems, (item) => {
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
						if (isPlannable(dayItem) && isSameCity(attraction, dayItem, cities)
							&& !isOverloaded(dayItem)) {
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
					this.setState({ updating: false, message: 'You have a full itinerary.' });
				}
			} else if (action === 'DELETE') {
				var days = Object.keys(dayItems);
				for (var i = 0; i < days.length; i++) {
					var dayItem = dayItems[days[i]];
					var idx = _.findIndex(dayItem, (item) => {
						return attraction.id === (item.attraction ? item.attraction.id : null);
					});
	
					if (idx > -1 && dayItem.length === 1) {
						// if it's the only item of the day, show warning and ignore the change
						this.setState({ updating: false, message: 'Can not remove. It is the only attraction to visit for that day.' });
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
		console.log(`>>>>MobileApp.handleSelectHotel of Day[${dayNo}]`, item);
		this.setState({ updating: true });
		const { instPackage } = this.state;
		for (var i = 0; i < instPackage.hotels.length; i++) {
			const hotel = instPackage.hotels[i];
			if (Number(hotel.dayNo) === Number(dayNo)) {
				hotel.hotel = item.id;
			}
		}
		this.setState({ instPackage: instPackage, updating: false });
	}
	// ----------  Package Instance Flight  ----------
	handleSelectFlight (selectedVal) {
		console.log(`>>>>MobileApp.handleSelectFlight`, selectedVal);
		this.setState({ updating: true });
		const { instPackage } = this.state;
		const dtDepart = Moment(selectedVal, 'DD/MM/YYYY');
		const dtReturn = Moment(dtDepart).add(instPackage.totalDays, 'days');
		instPackage.startDate = selectedVal;
		instPackage.endDate = dtReturn.format('DD/MM/YYYY');
		this.setState({ instPackage: instPackage, updating: false });
	}
	// ----------  Package Instance Car  ----------
	handleSelectCar (selectedVal) {
		console.log(`>>>>MobileApp.handleSelectCar`, selectedVal);
		this.setState({ updating: true });
		const { instPackage } = this.state;
		instPackage.carOption = selectedVal;
		this.setState({ instPackage: instPackage, updating: false });
	}
	/* ==============================
	   = React Lifecycle            =
	   ============================== */
	componentWillMount () {
		// Do nothing
	}

	render () {
		const { updating, flagModal, instPackage } = this.state;
		const { rates, reference } = this.props;
		const { packageRates, carRates, flightRates, hotelRates } = rates;
		const { cities, packageSummary } = reference;
		console.log('>>>>MobileApp.render >> instPackage', instPackage);
		console.log('>>>>MobileApp.render >> reference', reference);
		console.log('>>>>MobileApp.render >> rates', rates);
		// Setup modal element
		const pBtnModalDiy = [
			{ title: 'Yes', handleClick: this.enablePackageDiy },
			{ title: 'No', handleClick: this.handleModalDiyClose },
		];
		const pModalDiy = {
			title: `Let's DIY your package`,
			description: 'Would you like to start DIY your trip? An extra fee will be applied.',
			buttons: pBtnModalDiy,
		};

		const tabs = {
			Attraction: (
				<div id="package-attraction">
					<PackageAttraction
						instPackage={instPackage}
						cities={cities}
						handleLikeAttraction={this.handleLikeAttraction}
					/>
					<BotModal
						isModalOpen={flagModal.modalDiy}
						title={pModalDiy.title}
						description={pModalDiy.description}
						buttons={pModalDiy.buttons}
						handleModalClose={this.handleModalDiyClose}
					/>
				</div>
			),
			Itinerary: (
				<div id="package-itinerary">
					<PackageItinerary
						showTransport
						instPackage={instPackage}
						rates={rates}
						packageSummary={packageSummary}
						cities={cities}
						handleSelectHotel={this.handleSelectHotel}
						handleSelectFlight={this.handleSelectFlight}
						handleSelectCar={this.handleSelectCar}
					/>
				</div>
			),
		};

		/* ----------  Animated Wrapper  ---------- */

		return (
			<div id="app">
				<Paper>
					<FixedTab tabs={tabs} >
						<BotHeader
							instPackage={instPackage}
							rates={rates}
							cities={cities}
						/>
					</FixedTab>
				</Paper>
			</div>
		);
	}
}

export default MobileApp;
