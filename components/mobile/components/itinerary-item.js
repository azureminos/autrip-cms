import React from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';
import ChipList from './chip-list';

// Filter out selected attractions
/*const getUnselected = (items, selected) => {
	return _.filter(items, (item) => {
		return !_.find(selected, { attractionId: item.attraction });
	});
};*/

const getTagSetting = (attractions, allAttractions) => {
	const tags = attractions.map((a) => {
		const item = _.find(allAttractions, (aa) => {
			return aa.id === a.attraction.id;
		});
		return { id: a.attraction.id, name: item.name, imageUrl: item.imageUrl };
	});

	return {
		tags: tags,
	};
};

export default class ItineraryItem extends React.Component {
	render () {
		console.log('>>>>ItineraryItem, Start render with props', this.props);
		// Get data from props
		const { itinerary, attractions } = this.props;

		if (itinerary.isPlannable) {
			return (
				<div className="itinerary-day-item">
					<div>Attractions</div>
					<div className="dnd-container">
						<ChipList {...getTagSetting(itinerary.attractions, attractions)} />
					</div>
				</div>
			);
		}

		return (
			<div className="itinerary-day-item"></div>
		);

	}
}
