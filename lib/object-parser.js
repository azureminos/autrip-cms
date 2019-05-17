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
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(item, 'slug', 'name', 'description', 'finePrint', 'notes', 'departureDate',
				'effectiveTo', 'effectiveFrom', 'isExtention', 'isCustomisable', 'isPromoted', 'state',
				'maxParticipant', 'totalDays', 'additionalField');
			r.id = item._id;
			r.imageUrl = item.image.secure_url;
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(item, 'slug', 'name', 'description', 'finePrint', 'notes', 'departureDate',
			'effectiveTo', 'effectiveFrom', 'isExtention', 'isCustomisable', 'isPromoted', 'state',
			'maxParticipant', 'totalDays', 'additionalField');
		r.id = input._id;
		r.imageUrl = item.image.secure_url;
		return r;
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

exports.parseCity = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(item, 'name', 'description', 'alias', 'tag', 'additionalField');
			r.id = item._id;
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(input, 'name', 'description', 'alias', 'tag', 'additionalField');
		r.id = input._id;
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
    r.id = item._id;
    r.name = item.name;
    //console.log('>>>>Metadata.parseCountry', r);
		return r;
	}
};
