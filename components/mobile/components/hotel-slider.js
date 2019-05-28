import React from 'react';
import Swiper from 'react-id-swiper';
import HotelCard from './hotel-card';

class HotelSlider extends React.Component {
	constructor (props) {
		super(props);
		const { dayNo, packageHotels, hotelRates, hotels } = props;
		const dayHotel = _.find(packageHotels, { dayNo: dayNo });
		this.state = {
			idxSelected: (dayHotel && dayHotel.isOvernight) ? dayHotel.hotel.id : -1,
		};
		this.handleSelectHotel = this.handleSelectHotel.bind(this);
	}

	handleSelectHotel (hotel) {
		console.log('>>>>HotelSlider, handleChange()', { hotel: hotel, state: this.state, props: this.props });
		const { dayNo, instPackage } = this.props;
		if (this.state.idxSelected !== hotel.id) {
			instPackage.hotels[dayNo - 1] = hotel.id;
			this.setState({ idxSelected: hotel.id });
		} else {
			instPackage.hotels[dayNo - 1] = -1;
			this.setState({ idxSelected: -1 });
		}
	};

	render () {
		const params = {
			slidesPerView: 2,
			spaceBetween: 8,
		};

		console.log('>>>>HotelSlider, render()', this.props);
		const { idxSelected } = this.state;
		const { dayNo, packageHotels, hotelRates, hotels } = this.props;
		const hotelSlider = hotels.map((h, idx) => {
			console.log('>>>>HotelSlider, to check Selected', { hotel: h, target: idxSelected });
			h.isSelected = (h.id === idxSelected);
			console.log('>>>>HotelSlider, checked Selected', h);
			return (
				<div className="hotel-slide" key={idx}>
					<HotelCard
						key={h.id}
						item={h}
						handleSelectHotel={this.handleSelectHotel}
					/>
				</div>
			);
		});

		return (
			<Swiper {...params}>
				{hotelSlider}
			</Swiper>
		);
	}
}

export default HotelSlider;
