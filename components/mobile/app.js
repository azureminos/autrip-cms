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
		console.log('>>>>MobileApp.setLikedAttractions', attraction);
		const action = attraction.isLiked ? 'DELETE' : 'ADD';
		const { instPackage, message } = this.state;
		const { reference } = this.props;
		const { cities } = reference;
		const city = Helper.findCityByAttraction(attraction.id, cities);
		// Logic starts here
		if (action === 'ADD') {

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
