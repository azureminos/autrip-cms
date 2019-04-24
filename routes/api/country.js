// API to get Country
var _ = require('lodash');
var keystone = require('keystone');

var Country = keystone.list('Country');

var parseCountry = function (input) {
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

/** * Get List of Country */
exports.getAllCountry = function (req, res) {
	Country.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(parseCountry(items));
	});
};

/** * Get Country by ID */
exports.getCountryById = function (req, res) {
	Country.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(parseCountry(item));
	});
};
