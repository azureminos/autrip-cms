import _ from 'lodash';
import React from 'react';
import ChipList from './chip-list';

const getTagSetting = attractions => {
	const tags = _.map(attractions, a => {
		return { id: a.id, name: a.name, imageUrl: a.imageUrl };
	});

	return {
		tags: tags,
	};
};

export default class AttractionList extends React.Component {
	render () {
		// console.log('>>>>AttractionList, Start render with props', this.props);
		// Get data from props
		const { attractions } = this.props;
		const likedAttractions = _.filter(attractions, aa => {
			return aa.isLiked;
		});

		return likedAttractions && likedAttractions.length > 0 ? (
			<div className="itinerary-day-item">
				<div>Attractions</div>
				<div className="dnd-container">
					<ChipList {...getTagSetting(likedAttractions)} />
				</div>
			</div>
		) : (
			''
		);
	}
}
