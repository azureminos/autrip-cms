const _ = require('lodash');

exports.findCityById = (id, cities) => {
	var name = '';
	_.each(cities, (c) => { if (c.id === id) name = c.name; });
	return name;
};

exports.findAttractionById = (id, cities) => {
	var attraction = null;
	_.each(cities, (c) => {
		const matcher = _.find(c.attractions, function (a) { return a.id === id; });
		if (matcher) attraction = matcher;
	});
	if (attraction) {
		return attraction;
	}
	return;
};

exports.findHotelById = (id, cities) => {
	var hotel = null;
	_.each(cities, (c) => {
		const matcher = _.find(c.hotel, function (h) { return h.id === id; });
		if (matcher) hotel = matcher;
	});
	if (hotel) {
		return hotel;
	}
	return;
};

exports.findCityByAttraction = (id, cities) => {
	var name = '';
	_.each(cities, (c) => { if (_.find(c.attractions, function (a) { return a.id === id; })) name = c.name; });
	if (name) {
		return name;
	}
	return;
};

exports.findCityByHotel = (id, cities) => {
	var name = '';
	_.each(cities, (c) => { if (_.find(c.hotels, function (h) { return h.id === id; })) name = c.name; });
	if (name) {
		return name;
	}
	return;
};

exports.enhanceItem = (item, cities) => {
	if (item.attraction) {
		item.attraction = this.findAttractionById(item.attraction, cities);
	}
	return item;
};

exports.dummyInstance = ({ packageSummary, packageItems, packageHotels }) => {
	var getUniqueId = () => {
		return Math.random().toString(36).substr(2, 9);
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
	_.each(packageItems, (item) => {
		var it = {
			id: getUniqueId(),
			dayNo: item.dayNo,
			daySeq: item.daySeq,
			timePlannable: item.timePlannable || (item.attraction ? 10 : 0),
			attraction: item.attraction ? item.attraction.id : null,
		};
		rs.items.push(it);
	});
	// Dummy package instance hotels
	_.each(packageHotels, (item) => {
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

