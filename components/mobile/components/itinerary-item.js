import _ from 'lodash';
import React from 'react';
import ChipList from './chip-list';

// Filter out selected attractions
/* const getUnselected = (items, selected) => {
	return _.filter(items, (item) => {
		return !_.find(selected, { attractionId: item.attraction });
	});
};*/

const getTagSetting = attractions => {
	const tags = _.map(
		_.filter(attractions, aa => {
			return aa.isLiked;
		}),
		a => {
			return { id: a.id, name: a.name, imageUrl: a.imageUrl };
		}
	);

	return {
		tags: tags,
	};
};

export default class ItineraryItem extends React.Component {
	render () {
		// console.log('>>>>ItineraryItem, Start render with props', this.props);
		// Get data from props
		const { attractions } = this.props;

		if (attractions && attractions.length > 0) {
			return (
				<div className="itinerary-day-item">
					<div>Attractions</div>
					<div className="dnd-container">
						<ChipList {...getTagSetting(attractions)} />
					</div>
				</div>
			);
		}

		return <div className="itinerary-day-item"></div>;
	}
}
