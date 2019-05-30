// ==== MODULES ==========================================
import _ from 'lodash';
import React from 'react';
import { Paper, Typography } from '@material-ui/core';

// ==== COMPONENTS =======================================
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

		this.setLikedAttractions = this.setLikedAttractions.bind(this);

		this.state = {
			updating: false,
			likedAttractions: [],
		};
	}

	/* ==============================
	   = Helper Methods             =
	   ============================== */


	/* ==============================
	   = State & Event Handlers     =
	   ============================== */
	// ----------  Package  ----------
	/* ----------  Package Instance ------- */
	/* ----------  Package Instance Items------- */
	setLikedAttractions (e) {
		console.log('>>>>MobileApp.setLikedAttractions', e);
	}
	/* ----------  Attractions  ---------- */
	/* ----------  Hotels  ---------- */


	/* ==============================
	   = React Lifecycle            =
	   ============================== */
	componentWillMount () {
		// Do nothing
	}

	render () {
		const { updating } = this.state;
		const {selectedPackage} = this.props;
		const { packageSummary, packageItems, packageHotels, packageRates, carRates, flightRates,
			hotelRates, cities } = selectedPackage;
		console.log('>>>>MobileApp.render', selectedPackage);
		const tabs = {
			Attraction: (
				<div id="package-attraction">
					<PackageAttraction
						packageItems={packageItems}
						cities={cities}
						likeAttractions={this.setLikedAttractions}
					/>
				</div>
			),
			Itinerary: (
				<div id="package-itinerary">
					<PackageItinerary
						showTransport
						packageSummary={packageSummary}
						packageItems={packageItems}
						packageHotels={packageHotels}
						hotelRates={hotelRates}
						cities={cities}
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
