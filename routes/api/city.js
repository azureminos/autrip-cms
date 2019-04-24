// API to get City
var _ = require('lodash');
var keystone = require('keystone');

var City = keystone.list('City');
var Country = keystone.list('Country');

var parseCity = function (input) {
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

/** * Get List of City */
exports.getAllCity = function (req, res) {
	City.model
		.find().populate('country')
		.exec(function (err, items) {
			if (err) return res.apiError('database error', err);
			return res.apiResponse(parseCity(items));
		});
}

/** * Get Country by ID */
exports.getCityById = function (req, res) {
	City.model
		.findById(req.params.id).populate('country')
		.exec(function (err, item) {
			if (err) return res.apiError('database error', err);
			if (!item) return res.apiError('not found');
			return res.apiResponse(parseCity(item));
		});
}

/** * Get City by Country */
exports.getCityByCountry = function (req, res) {
	console.log('>>>>Calling getCityByCountry', req.body);
	var query = req.body;
	if (query.country) {
		if (query.country.id) {
			Country.model
				.findById(query.country.id).populate('cities')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					res.apiResponse(parseCity(item.cities));
				});
		} else if (query.country.name) {
			Country.model
				.findOne({ name: query.country.name }).populate('cities')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					res.apiResponse(parseCity(item.cities));
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
