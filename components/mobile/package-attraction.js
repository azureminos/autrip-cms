import React, { createElement } from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import AttractionCard from './components/attraction-card.js';
import CardSlider from './components/card-slider.jsx';
import ChipList from './components/chip-list.js';
import DescPanel from './components/description-panel';

const styles = {
	city: {
		border: '1px solid',
		borderColor: 'lightgrey',
		padding: '4px',
		margin: '4px',
	},
};

class PackageAttraction extends React.Component {
	render() {
		console.log('>>>>PackageAttraction props', this.props);
		const { classes, instPackage, apiUri, cities, cityAttractions, likeAttractions } = this.props;
		const cityDays = _.groupBy(instPackage.items, (c) => { return c.city; });
		const citySections = _.keys(cityAttractions).map((city) => {
			const tmpCity = _.find(cities, (c) => { return c.name == city; });
			const cityDesc = !!tmpCity ? tmpCity.description : '';
			const cityDescShort = cityDesc.substring(0, (cityDesc.length > 80 ? 80 : cityDesc.length)) + '...';
			// Prepare settings of ChipList
			const likedItems = _.filter(cityAttractions[city], { isLiked: true });
			console.log('>>>>Show tags for city[' + city + ']', likedItems);

			const tagSetting = {
				tags: likedItems.map((item) => { return { id: item.id, name: item.name, imageUrl: item.imageUrl }; }),
				apiUri: apiUri,
			};

			// Prepare attraction card list
			const attractionCards = cityAttractions[city].map((a) => {
				return (
					<AttractionCard
						key={a.id}
						item={a}
						apiUri={apiUri}
						handleClick={likeAttractions}
					/>
				);
			});

			const days = Object.keys(_.groupBy(cityDays[city], (c) => { return c.dayNo; })).length;
			return (
				<div key={cityAttractions[city].id} className={classes.city}>
					<Typography variant='h5' gutterBottom>
						{city + ' - ' + days + ' Day' + (days == 1 ? '' : 's')}
					</Typography>
					<DescPanel descShort={cityDescShort} descFull={cityDesc} />
					<ChipList {...tagSetting} />
					<CardSlider cards={attractionCards} />
				</div>
			);
		});

		return (
			<section>
				{citySections}
			</section>
		);
	}
}

export default withStyles(styles)(PackageAttraction);
