// API to get FlightRate
var keystone = require('keystone');
var TravelPackage = keystone.list('TravelPackage');
var FlightRate = keystone.list('FlightRate');

/** * Get List of FlightRate */
exports.getAllFlightRate = function (req, res) {
	FlightRate.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(items);
	});
};

/** * Get FlightRate by ID */
exports.getFlightRateById = function (req, res) {
	FlightRate.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(item);
	});
};

/** * Get FlightRate by Params */
exports.getFlightRateByPackage = function (req, res) {
	console.log('>>>>Calling getFlightRateByPackage', req.body);
	var query = req.body;
	if (query.package) {
		if (query.package.id) {
			TravelPackage.model
				.findById(query.package.id).populate('flightRates')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.flightRates);
				});
		} else if (query.package.name) {
			TravelPackage.model
				.findOne({ name: query.package.name }).populate('flightRates')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.flightRates);
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
