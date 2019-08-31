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
		/*
		 * Itinerary Card object
		 *  - dayNo: dayNo
		 *  - cityBase: where stay over night (or attraction city, or previous cityBase)
		 *  - cityVisit: where attraction city (or same as cityBase)
		 *  - cityDesc: description of cityBase
		 *  - attractions: list of attractions in cityVisit (isLiked -> true/false)
		 *  - hotel:
		 */
		console.log('>>>>PackageAttraction props', this.props);
		const {
			classes,
			itAttractions,
			handleLikeAttraction,
			isReadonly,
		} = this.props;

		const daySections = _.map(itAttractions, it => {
			// Prepare settings of ChipList
			const likedItems = _.filter(it.attractions, { isLiked: true });
			const tagSetting = {
				tags: _.map(likedItems, item => {
					return { id: item.id, name: item.name, imageUrl: item.imageUrl };
				}),
			};

			// Prepare attraction card list
			const attractionCards = _.map(it.attractions, a => {
				return (
					<AttractionCard
						key={a.id}
						item={a}
						handleClick={handleLikeAttraction}
					/>
				);
			});

			return (
				<div key={it.dayNo} className={classes.city}>
					<Typography variant="h5" gutterBottom>
						{`Day ${it.dayNo}: ${it.cityVisit}`}
					</Typography>
					<DescPanel descShort={it.cityDescShort} descFull={it.cityDesc} />
					<ChipList {...tagSetting} />
					<CardSlider cards={attractionCards} />
				</div>
			);
		});

		return <section>{daySections}</section>;
	}
}

export default withStyles(styles)(PackageAttraction);
