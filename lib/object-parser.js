const _ = require('lodash');

exports.parseAttraction = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(item, 'name', 'description', 'alias', 'tag', 'additionalField', 'timeVisit', 'timeTraffic', 'rate', 'cost', 'nearByAttractions');
			r.id = item._id;
			r.imageUrl = item.image ? item.image.secure_url : '';
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(input, 'name', 'description', 'alias', 'tag', 'additionalField', 'timeVisit', 'timeTraffic', 'rate', 'cost', 'nearByAttractions');
		r.id = input._id;
		r.imageUrl = input.image ? input.image.secure_url : '';
		return r;
	}
};

exports.parseTravelPackage = function (input) {
	const parseObj = (item) => {
		const r = _.pick(item, 'slug', 'name', 'description', 'finePrint', 'notes', 'departureDate',
			'effectiveTo', 'effectiveFrom', 'isExtention', 'isCustomisable', 'isPromoted', 'state',
			'maxParticipant', 'totalDays', 'additionalField');
		r.id = item._id;
		r.imageUrl = item.image.secure_url;
		return r;
	};

	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			rs.push(parseObj(item));
		});
		return rs;
	} else {
		return parseObj(input);
	}
};

exports.parsePackageItem = function (input) {
	const parseObj = (item) => {
		const r = _.pick(item, 'additionalField', 'dayNo', 'daySeq', 'description',
			'name', 'notes', 'timePlannable');
		r.id = item._id;
		if (item.attraction && !(item.attraction instanceof String)) {
			r.cityId = item.attraction.city;
			r.attraction = {
				id: item.attraction._id,
				name: item.attraction.name,
				timeTraffic: item.attraction.timeTraffic,
				timeVisit: item.attraction.timeVisit,
				imageUrl: item.attraction.image.secure_url,
			};
		}
		return r;
	};

	if (Array.isArray(input)) {
		const rs = [];
		_.each(input, function (item) {
			rs.push(parseObj(item));
		});
		return rs;
	} else {
		return parseObj(input);
	}
};

exports.parsePackageHotel = function (input) {
	const parseObj = (item) => {
		const r = _.pick(item, 'additionalField', 'dayNo', 'description', 'isOvernight', 'name', 'notes');
		r.id = item._id;
		if (item.hotel && !(item.hotel instanceof String)) {
			r.cityId = item.hotel.city;
			r.hotel = {
				id: item.hotel._id,
				name: item.hotel.name,
				type: item.hotel.type,
				stars: item.hotel.stars,
				imageUrl: item.hotel.image.secure_url,
			};
		}
		return r;
	};

	if (Array.isArray(input)) {
		const rs = [];
		_.each(input, function (item) {
			rs.push(parseObj(item));
		});
		return rs;
	} else {
		return parseObj(input);
	}
};

exports.parseCarRate = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(item, 'type', 'priority', 'cost', 'rate', 'rangeFrom', 'rangeTo', 'minParticipant', 'maxParticipant');
			r.id = item._id;
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(input, 'type', 'priority', 'cost', 'rate', 'rangeFrom', 'rangeTo', 'minParticipant', 'maxParticipant');
		r.id = input._id;
		return r;
	}
};

exports.parseCity = function (input, child) {
	const parseObj = (item) => {
		const output = _.pick(item, 'name', 'description');
		output.id = item._id;

		if (child === 'hotel' && item.hotels && item.hotels.length > 0) {
			output.hotels = _.map(item.hotels, (h) => {
				const r = _.pick(h, 'name', 'description', 'stars', 'type', 'timeTraffic', 'nearByAttractions');
				r.id = h._id;
				r.imageUrl = h.image.secure_url;
				return r;
			});
		} else if (child === 'attraction' && item.attractions && item.attractions.length > 0) {
			output.attractions = _.map(item.attractions, (a) => {
				const r = _.pick(a, 'name', 'description', 'cost', 'rate', 'timeTraffic', 'timeVisit', 'nearByAttractions');
				r.id = a._id;
				r.imageUrl = a.image.secure_url;
				return r;
			});
		} else if (child === 'all') {
			if (item.hotels && item.hotels.length > 0) {
				output.hotels = _.map(item.hotels, (h) => {
					const r = _.pick(h, 'name', 'description', 'stars', 'type', 'timeTraffic', 'nearByAttractions');
					r.id = h._id;
					r.imageUrl = h.image.secure_url;
					return r;
				});
			}
			if (item.attractions && item.attractions.length > 0) {
				output.attractions = _.map(item.attractions, (a) => {
					const r = _.pick(a, 'name', 'description', 'cost', 'rate', 'timeTraffic', 'timeVisit', 'nearByAttractions');
					r.id = a._id;
					r.imageUrl = a.image.secure_url;
					return r;
				});
			}
		}

		return output;
	};

	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = parseObj(item, child);
			rs.push(r);
		});
		return rs;
	} else {
		var r = parseObj(input, child);
		return r;
	}
};

exports.parseCountry = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(item, 'name', 'region', 'description', 'tag', 'alias', 'additionalField');
			r.id = item._id;
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(input, 'name', 'region', 'description', 'tag', 'alias', 'additionalField');
		r.id = input._id;
		return r;
	}
};

exports.parseCountryNvp = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = {};
      r.id = item._id;
      r.name = item.name;
			rs.push(r);
    });
    //console.log('>>>>Metadata.parseCountry', rs);
		return rs;
	} else {
    var r = {};
    r.id = input._id;
    r.name = input.name;
    //console.log('>>>>Metadata.parseCountry', r);
		return r;
	}
};
