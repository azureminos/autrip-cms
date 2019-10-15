const _ = require('lodash');
const CONSTANTS = require('./constants');

const instStatus = CONSTANTS.get().Instance.status;

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
		status: instStatus.INITIATED,
		startDate: null,
		endDate: null,
		isCustomisable: !!packageSummary.isCustomisable,
		isCustomised: false,
		totalDays: packageSummary.totalDays,
		totalPeople: 0,
		totalRooms: 0,
		maxParticipant: packageSummary.maxParticipant,
		carOption: packageSummary.carOption,
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
			isMustVisit: item.isMustVisit || false,
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
		status: instStatus.INITIATED,
		people: 0,
		rooms: 0,
	};
	rs.members.push(us);
	// Return final dummy
	return rs;
};

exports.getValidCarOptions = carRates => {
	let tmp = {};
	const result = [];
	if (carRates && carRates.length > 0) {
		_.each(carRates, cr => {
			if (cr.carRates && cr.carRates.length > 0) {
				_.each(cr.carRates, r => {
					tmp[r.type] = { count: (tmp[r.type] ? tmp[r.type].count : 0) + 1 };
					if (tmp[r.type].count === carRates.length) result.push(r.type);
				});
			}
		});
	}

	return result;
};
