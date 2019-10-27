import _ from 'lodash';
import React from 'react';
import Swiper from 'react-id-swiper';
import AttractionCard from './attraction-card';

class AttractionSlider extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		const params = {
			centeredSlides: true,
			slidesPerView: 2,
			spaceBetween: 8,
		};

		// console.log('>>>>AttractionSlider, render()', this.props);
		const {
			dayNo,
			timePlannable,
			attractions,
			handleLikeAttraction,
		} = this.props;
		const doLikeAttraction = item => {
			handleLikeAttraction(dayNo, timePlannable, item, attractions);
		};

		if (attractions && attractions.length > 0) {
			const cards = _.map(attractions, (a, idx) => {
				return (
					<div className="attraction-slide" key={idx}>
						<AttractionCard item={a} doLikeAttraction={doLikeAttraction} />
					</div>
				);
			});
			return <Swiper {...params}>{cards}</Swiper>;
		}

		return '';
	}
}

export default AttractionSlider;
