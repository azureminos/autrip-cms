// API to get CarRate
var _ = require('lodash');
var keystone = require('keystone');

var CarRate = keystone.list('CarRate');
var TravelPackage = keystone.list('TravelPackage');

var parseCarRate = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(
				item,
				'package',
				'city',
				'type',
				'priority',
				'cost',
				'rate',
				'rangeFrom',
				'rangeTo',
				'minParticipant',
				'maxParticipant'
			);
			r.id = item._id;
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(
			input,
			'package',
			'city',
			'type',
			'priority',
			'cost',
			'rate',
			'rangeFrom',
			'rangeTo',
			'minParticipant',
			'maxParticipant'
		);
		r.id = input._id;
		return r;
	}
};

/** * Get List of CarRate */
exports.getAllCarRate = function (req, res) {
	CarRate.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(parseCarRate(items));
	});
};

/** * Get CarRate by ID */
exports.getCarRateById = function (req, res) {
	CarRate.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(parseCarRate(item));
	});
};

/** * Get FlightRate by Params */
exports.getCarRateByPackage = function (req, res) {
	console.log('>>>>Calling getCarRateByPackage', req.body);
	var query = req.body;
	if (query.package) {
		if (query.package.id) {
			TravelPackage.model
				.findById(query.package.id)
				.populate('carRates')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(parseCarRate(item.carRates));
				});
		} else if (query.package.name) {
			TravelPackage.model
				.findOne({ name: query.package.name })
				.populate('carRates')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(parseCarRate(item.carRates));
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
