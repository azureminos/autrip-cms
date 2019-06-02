import React from 'react';
import Swiper from 'react-id-swiper';
import HotelCard from './hotel-card';

class HotelSlider extends React.Component {
	constructor (props) {
		console.log('>>>>HotelSlider.constructor', props);
		super(props);
		const { dayHotel } = props;
		this.state = {
			idxSelected: (dayHotel && dayHotel.isOverNight) ? dayHotel.hotel : -1,
		};
	}

	render () {
		const params = {
			slidesPerView: 2,
			spaceBetween: 8,
		};

		console.log('>>>>HotelSlider, render()', this.props);
		const { idxSelected } = this.state;
		const { dayNo, dayHotel, hotels, hotelRates, handleSelectHotel } = this.props;
		const doSelectHotel = (item) => {
			handleSelectHotel(dayNo, item);
			this.setState({ idxSelected: item.id });
		};

		if (dayHotel.isOverNight) {
			const hotelSlider = hotels.map((h, idx) => {
				console.log('>>>>HotelSlider, to check Selected', { hotel: h, target: idxSelected });
				h.isSelected = (h.id === idxSelected);
				console.log('>>>>HotelSlider, checked Selected', h);
				return (
					<div className="hotel-slide" key={idx}>
						<HotelCard
							key={h.id}
							item={h}
							doSelectHotel={doSelectHotel}
						/>
					</div>
				);
			});
			return (
				<div>
					<div>Hotels</div>
					<Swiper {...params}>
						{hotelSlider}
					</Swiper>
				</div>
			);
		}

		return (
			<div>
				After breakfast, transfer to airport to board your flight to Australia. The trip may be over, but the experiences and memories will certainly last a lifetime.
			</div>
		);
	}
}

export default HotelSlider;
