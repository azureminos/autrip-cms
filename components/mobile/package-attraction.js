import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import AttractionCard from './components/attraction-card';
import CardSlider from './components/card-slider';
import ChipList from './components/chip-list';
import DescPanel from './components/description-panel';
import Helper from '../../lib/helper';

const styles = {
	itinerary: {
		border: '1px solid',
		borderColor: 'lightgrey',
		padding: '4px',
		margin: '4px',
	},
	dayCity: {
		display: 'table',
		clear: 'both',
		width: '100%',
	},
	titleDayCity: {
		float: 'left',
	},
	iconDayCity: {
		float: 'right',
		margin: '8px',
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
			isCustomised,
			handleAddItinerary,
			handleDeleteItinerary,
		} = this.props;

		const daySections = _.map(itAttractions, (it, idx) => {
			// Event Handlers
			const doHandleAddItinerary = () => {
				// console.log('>>>>PackageAttraction.doHandleAddItinerary', it);
				handleAddItinerary(it);
			};
			const doHandleDeleteItinerary = () => {
				// console.log('>>>>PackageAttraction.doHandleDeleteItinerary', it);
				handleDeleteItinerary(it);
			};
			const doHandleLikeAttraction = attraction => {
				console.log('>>>>PackageAttraction.doHandleLikeAttraction', {
					itinerary: it,
					attraction,
				});
				handleLikeAttraction(it, attraction);
			};
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
						handleClick={doHandleLikeAttraction}
					/>
				);
			});
			const isDayChangable
				= isCustomised && idx != 0 && idx != itAttractions.length - 1;

			return (
				<div key={it.dayNo} className={classes.itinerary}>
					<Typography variant="h5" gutterBottom className={classes.dayCity}>
						<div
							className={classes.titleDayCity}
						>{`Day ${it.dayNo}: ${it.cityVisit}`}</div>
						{isDayChangable ? (
							<Fab
								size="small"
								color="secondary"
								aria-label="delete"
								onClick={doHandleDeleteItinerary}
								className={classes.iconDayCity}
							>
								<DeleteIcon />
							</Fab>
						) : (
							''
						)}
						{isDayChangable ? (
							<Fab
								size="small"
								color="primary"
								aria-label="add"
								onClick={doHandleAddItinerary}
								className={classes.iconDayCity}
							>
								<AddIcon />
							</Fab>
						) : (
							''
						)}
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
