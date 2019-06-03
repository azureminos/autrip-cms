// ==== MODULES ==========================================
import _ from 'lodash';
import React from 'react';
import { Paper, Typography } from '@material-ui/core';

// ==== COMPONENTS =======================================
import Helper from '../../lib/helper';
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

		this.handleLikeAttraction = this.handleLikeAttraction.bind(this);
		this.handleSelectHotel = this.handleSelectHotel.bind(this);

		this.state = {
			updating: false,
			message: '',
			instPackage: props.instPackage,
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
	handleLikeAttraction (attraction) {
		const enhanceItem = (item, cities) => {
			item.attraction = Helper.findAttractionById(item.attraction, cities);
			return item;
		};
		const isPlannable = (dayItem) => {
			return dayItem && dayItem.length > 0 && dayItem[0].timePlannable > 0;
		};
		const isOverloaded = (dayItem) => {
			const timePlannable = dayItem[0].timePlannable;
			let timePlanned = 0;
			for (var i = 0; i < dayItem.length; i++) {
				const attraction = dayItem[i].attraction;
				timePlanned = timePlanned + attraction.timeTraffic + attraction.timeVisit;
				if (i > 0 && _.findIndex(dayItem[i].attraction.nearByAttractions, (item) => { return item === dayItem[i - 1].attraction.id; }) > -1) {
					timePlanned = timePlanned - 1;
				}
			}
			return timePlannable > timePlanned;
		};
		const isSameCity = (item, cities) => {
			item.attraction = Helper.findAttractionById(item.attraction, cities);
			return item;
		};
		const getLastNearby = (item, cities) => {
			item.attraction = Helper.findAttractionById(item.attraction, cities);
			return item;
		};
		console.log('>>>>MobileApp.setLikedAttractions', attraction);
		const action = attraction.isLiked ? 'DELETE' : 'ADD';
		const { instPackage, message } = this.state;
		const { reference } = this.props;
		const { cities } = reference;
		const city = Helper.findCityByAttraction(attraction.id, cities);
		const cityItems = _.find(cities, (o) => { return o.name === city; });
		const instItems = _.map(instPackage.items, (item) => {
			return item.attraction ? enhanceItem(item, cities) : item;
		});
		const dayItems = _.groupBy(instItems, (item) => {
			return item.dayNo;
		});
		const posLastNearby = getLastNearby(dayItem);
		// Logic starts here
		let isAddible = false;
		if (action === 'ADD') {
			if (posLastNearby) {
				isAddible = true;
				// Do something
			} else {
				// Group by Day
				for (var i = 0; i < Object.keys(dayItems).length; i++) {
					const dayItem = dayItems[Object.keys(dayItems)[i]];
					if (isPlannable(dayItem) && isSameCity(dayItem) && !isOverloaded(dayItem)) {
						isAddible = true;
						// Do something
					}
				}
			}

			if (!isAddible) {
				// Do nothing but show warning message
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
	/* ==============================
	   = React Lifecycle            =
	   ============================== */
	componentWillMount () {
		// Do nothing
	}

	render () {
		const { updating, instPackage } = this.state;
		const { rates, reference } = this.props;
		const { packageRates, carRates, flightRates, hotelRates } = rates;
		const { cities } = reference;
		console.log('>>>>MobileApp.render', instPackage);
		const tabs = {
			Attraction: (
				<div id="package-attraction">
					<PackageAttraction
						instPackage={instPackage}
						cities={cities}
						handleLikeAttraction={this.handleLikeAttraction}
					/>
				</div>
			),
			Itinerary: (
				<div id="package-itinerary">
					<PackageItinerary
						showTransport
						instPackage={instPackage}
						rates={rates}
						cities={cities}
						handleSelectHotel={this.handleSelectHotel}
					/>
				</div>
			),
		};

		/* ----------  Animated Wrapper  ---------- */

		return (
			<div id="app">
				<Paper>
					<FixedTab
						tabs={tabs}
					/>
				</Paper>
			</div>
		);
	}
}

export default MobileApp;
