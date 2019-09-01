import React, { createElement } from 'react';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';
import ChipList from './chip-list';

const getTagSetting = items => {
	const tags = items.map(a => {
		return { id: a.id, name: a.name, imageUrl: a.imageUrl };
	});

	return {
		tags: tags,
	};
};

export default class HotelItem extends React.Component {
	render () {
		// console.log('>>>>HotelItem, Start render with props', this.props);
		// Get data from props
		const { hotels } = this.props;
		const likedHotel = _.filter(hotels, hh => {
			return hh.isLiked;
		});
		return (
			<div className="hotel-day-item">
				<div>Hotels</div>
				<div className="dnd-container">
					<ChipList {...getTagSetting(likedHotel)} />
				</div>
			</div>
		);
	}
}
