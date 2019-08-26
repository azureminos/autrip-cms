const _ = require('lodash');

exports.findCityNameById = (id, cities) => {
	var name = '';
	_.each(cities, c => {
		if (c.id === id) name = c.name;
	});
	return name;
};

exports.findCityByName = (name, cities) => {
	var city = null;
	_.each(cities, c => {
		if (c.name === name) city = c;
	});
	return city;
};

exports.findAttractionById = (id, cities) => {
	var attraction = null;
	_.each(cities, c => {
		const matcher = _.find(c.attractions, function (a) {
			return a.id === id;
		});
		if (matcher) {
			attraction = matcher;
			attraction.city = c.name;
		}
	});
	if (attraction) {
		return attraction;
	}
	return;
};

exports.findHotelById = (id, cities) => {
	var hotel = null;
	_.each(cities, c => {
		const matcher = _.find(c.hotels, function (h) {
			return h.id === id;
		});
		if (matcher) {
			hotel = matcher;
			hotel.city = c.name;
		}
	});
	if (hotel) {
		return hotel;
	}
	return;
};

exports.findCityByAttraction = (id, cities) => {
	var name = '';
	_.each(cities, c => {
		if (
			_.find(c.attractions, function (a) {
				return a.id === id;
			})
		) {
			name = c.name;
		}
	});
	if (name) {
		return name;
	}
	return;
};

exports.findCityByHotel = (id, cities) => {
	var name = '';
	_.each(cities, c => {
		if (
			_.find(c.hotels, function (h) {
				return h.id === id;
			})
		) {
			name = c.name;
		}
	});
	if (name) {
		return name;
	}
	return;
};

exports.enhanceItem = (item, cities) => {
	if (item.attraction) {
		const match = this.findAttractionById(item.attraction, cities);
		item.attraction = match;
	}
	return item;
};

exports.enhanceHotel = (hotel, cities) => {
	if (hotel.hotel) {
		const match = this.findHotelById(hotel.hotel, cities);
		hotel.hotel = match;
	}
	return hotel;
};

exports.dummyInstance = ({ packageSummary, packageItems, packageHotels }) => {
	var getUniqueId = () => {
		return Math.random()
			.toString(36)
			.substr(2, 9);
	};
	// Dummy package instance
	var rs = {
		id: getUniqueId(),
		packageId: packageSummary.id,
		startDate: null,
		endDate: null,
		isCustomised: false,
		totalDays: packageSummary.totalDays,
		totalKids: 0,
		totalAdults: 0,
		maxParticipant: packageSummary.maxParticipant,
		cost: 0,
		rate: 0,
		items: [],
		hotels: [],
		members: [],
	};
	// Dummy package instance items
	_.each(packageItems, item => {
		var it = {
			id: getUniqueId(),
			dayNo: item.dayNo,
			daySeq: item.daySeq,
			description: item.description,
			timePlannable: item.timePlannable || (item.attraction ? 10 : 0),
			attraction: item.attraction ? item.attraction.id : null,
		};
		rs.items.push(it);
	});
	// Dummy package instance hotels
	_.each(packageHotels, item => {
		var ho = {
			id: getUniqueId(),
			dayNo: item.dayNo,
			isOverNight: item.isOverNight || !!item.hotel,
			hotel: item.hotel ? item.hotel.id : null,
		};
		rs.hotels.push(ho);
	});
	// Dummy package instance members
	var us = {
		id: getUniqueId(),
		loginId: 'dummy',
		isOwner: true,
		memberKids: 0,
		memberAdults: 0,
	};
	rs.members.push(us);
	// Return final dummy
	return rs;
};

exports.getItineraryAttractionList = ({
	packageItems,
	packageHotels,
	cities,
}) => {
	console.log('>>>>Helper.getItineraryCard', {
		packageItems,
		packageHotels,
		cities,
	});
	const daysItems = _.groupBy(packageItems, it => {
		return it.dayNo;
	});
	const daysHotels = _.groupBy(packageHotels, it => {
		return it.dayNo;
	});

	let prevCity = '';
	const itAttractions = [];
	for (let i = 1; daysItems[i] && daysHotels[i]; i++) {
		const dayItems = daysItems[i] ? daysItems[i] : [];
		const dayHotel = daysHotels[i][0] ? daysHotels[i][0] : {};
		const cityBase = getCityBase({ dayItems, dayHotel, prevCity }) || prevCity;
		const cityVisit = getCityVisit(dayItems) || cityBase;
		const cityDetails = getCityDetails({
			city: cityBase,
			items: dayItems,
			hotel: dayHotel,
			cities,
		});
		prevCity = cityBase;

		itAttractions.push({
			dayNo: i,
			cityBase: cityBase,
			cityVisit: cityVisit,
			cityDesc: cityDetails.cityDesc,
			cityDescShort: cityDetails.cityDescShort,
			attractions: cityDetails.attractions,
			hotels: cityDetails.hotels,
		});
	}

	return itAttractions;
};

const getCityDetails = ({ city, items, hotel, cities }) => {
	let cityDesc = '';
	let cityDescShort = '';
	let attractions = [];
	let hotels = [];
	for (let i = 0; i < cities.length; i++) {
		if (cities[i].name === city) {
			cityDesc = cities[i].description;
			// Check Liked Attractions
			if (items && items[0] && items[0].timePlannable > 0) {
				attractions = _.map(cities[i].attractions, a => {
					const isLiked
						= _.findIndex(items, pi => {
							return pi.attraction && pi.attraction.id === a.id;
						}) !== -1;
					return { ...a, isLiked: isLiked };
				});
				attractions = _.sortBy(attractions, [
					o => {
						return !o.isLiked;
					},
				]);
			} else {
				cityDesc
					= items && items[0] && items[0].description
						? items[0].description
						: cityDesc;
			}
			// Check Liked Hotel
			if (hotel && hotel.isOverNight) {
				hotels = _.map(cities[i].hotels, h => {
					const isLiked = hotel.hotel && hotel.hotel.id === h.id;
					return { ...h, isLiked: isLiked };
				});
				hotels = _.sortBy(hotels, [
					o => {
						return !o.isLiked;
					},
				]);
			}
			// Set City Short Description
			cityDescShort
				= cityDesc.length > 80 ? cityDesc.substring(0, 80) + '...' : cityDesc;
			break;
		}
	}
	return { cityDesc, cityDescShort, attractions, hotels };
};

const getCityBase = ({ dayItems, dayHotel }) => {
	let cityBase = '';
	if (dayHotel.isOverNight && dayHotel.hotel) {
		cityBase = dayHotel.hotel.city || '';
	} else if (dayItems && dayItems.length > 0) {
		for (let n = 0; n < dayItems.length; n++) {
			const dayItem = dayItems[n];
			if (dayItem && dayItem.attraction) {
				cityBase = dayItem.attraction.city || '';
			}
		}
	}

	return cityBase;
};

const getCityVisit = dayItems => {
	let cityVisit = '';
	if (dayItems && dayItems.length > 0) {
		const cities = _.groupBy(dayItems, dayItem => {
			return dayItem.attraction ? dayItem.attraction.city : '';
		});
		_.each(_.keys(cities), city => {
			if (city) {
				cityVisit = `${cityVisit}, ${city}`;
			}
		});
		cityVisit = cityVisit.length > 2 ? cityVisit.substring(2) : cityVisit;
	}
	return cityVisit;
};
