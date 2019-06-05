import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import AttractionCard from './components/attraction-card';
import CardSlider from './components/card-slider';
import ChipList from './components/chip-list';
import DescPanel from './components/description-panel';

import Helper from '../../lib/helper';

const styles = {
	city: {
		border: '1px solid',
		borderColor: 'lightgrey',
		padding: '4px',
		margin: '4px',
	},
};

class PackageAttraction extends React.Component {
	render () {
		console.log('>>>>PackageAttraction props', this.props);
		const { classes, instPackage, cities, handleLikeAttraction, isReadonly } = this.props;
		const packageItems = instPackage.items;
		const cityDays = _.groupBy(_.filter(packageItems, (i) => { return i.attraction; }), (item) => {
			return Helper.findCityByAttraction(item.attraction.id, cities);
		});
		const citySections = cities.map((city) => {
			const tmpCity = city.name;
			const cityDesc = tmpCity ? city.description : '';
			const cityDescShort = cityDesc.length > 80 ? (cityDesc.substring(0, 80) + '...') : cityDesc;
			const attractions = _.map(city.attractions, (a) => {
				a.isLiked = _.findIndex(packageItems, (pi) => { return pi.attraction && pi.attraction.id === a.id; }) !== -1;
				return a;
			});
			// Prepare settings of ChipList
			const likedItems = _.filter(attractions, { isLiked: true });
			// console.log('>>>>Show tags for city[' + city.name + ']', likedItems);
			const tagSetting = {
				tags: likedItems.map((item) => { return { id: item.id, name: item.name, imageUrl: item.imageUrl }; }),
			};

			// Prepare attraction card list
			const attractionCards = attractions.map((a) => {
				return (
					<AttractionCard
						key={a.id}
						item={a}
						handleClick={handleLikeAttraction}
					/>
				);
			});

			const days = Object.keys(_.groupBy(cityDays[tmpCity], (c) => { return c.dayNo; })).length;
			return (
				<div key={city.id} className={classes.city}>
					<Typography variant="h5" gutterBottom>
						{city.name + ' - ' + days + ' Day' + (days === 1 ? '' : 's')}
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
