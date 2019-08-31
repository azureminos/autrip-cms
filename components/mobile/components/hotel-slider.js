import _ from 'lodash';
import React from 'react';
import Swiper from 'react-id-swiper';
import HotelCard from './hotel-card';

class HotelSlider extends React.Component {
	constructor (props) {
		super(props);
		const likedHotel = _.find(props.hotels, h => {
			return h.isLiked;
		});
		this.state = {
			idxSelected: likedHotel ? likedHotel.id : -1,
		};
	}

	render () {
		const params = {
			slidesPerView: 2,
			spaceBetween: 8,
		};

		// console.log('>>>>HotelSlider, render()', this.props);
		const { idxSelected } = this.state;
		const { dayNo, hotels, hotelRates, handleSelectHotel } = this.props;
		const doSelectHotel = item => {
			handleSelectHotel(dayNo, item);
			this.setState({ idxSelected: item.id });
		};

		if (hotels && hotels.length > 0) {
			const hotelSlider = _.map(hotels, (h, idx) => {
				h.isSelected = h.id === idxSelected;
				return (
					<div className="hotel-slide" key={idx}>
						<HotelCard key={h.id} item={h} doSelectHotel={doSelectHotel} />
					</div>
				);
			});
			return (
				<div>
					<div>Hotels</div>
					<Swiper {...params}>{hotelSlider}</Swiper>
				</div>
			);
		}

		return '';
	}
}

export default HotelSlider;
