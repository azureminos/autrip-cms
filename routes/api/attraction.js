// API to get Attraction
var _ = require('lodash');
var keystone = require('keystone');
var helper = require('../../lib/object-parser');

var Attraction = keystone.list('Attraction');
var City = keystone.list('City');

/*var parseAttraction = function (input) {
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
};*/

/** * Get List of Attraction */
exports.getAllAttraction = function (req, res) {
	Attraction.model.find().exec(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(helper.parseAttraction(items));
	});
};

/** * Get Attraction by ID */
exports.getAttractionById = function (req, res) {
	Attraction.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(helper.parseAttraction(item));
	});
};

/** * Get Attraction by City */
exports.getAttractionByCity = function (req, res) {
	console.log('>>>>Calling getAttractionByCity', req.body);
	var query = req.body;
	if (query.city) {
		if (query.city.id) {
			City.model
				.findById(query.city.id).populate('attractions')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					res.apiResponse(helper.parseAttraction(item.attractions));
				});
		} else if (query.city.name) {
			City.model
				.findOne({ name: query.city.name }).populate('attractions')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					res.apiResponse(helper.parseAttraction(item.attractions));
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
