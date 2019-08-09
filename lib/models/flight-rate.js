const keystone = require('keystone');

/** * Get List of FlightRate */
exports.getAllFlightRate = (handler) => {
	const FlightRate = keystone.list('FlightRate').model;
	return FlightRate.find(handler);
};

/** * Get FlightRate by Params */
exports.getFlightRateByParams = (params, handler) => {
	const FlightRate = keystone.list('FlightRate').model;
	return FlightRate.find(params, handler);
};

/** * Get FlightRate by ID */
exports.getFlightRateById = (id, handler) => {
	const FlightRate = keystone.list('FlightRate').model;
	return FlightRate.findById(id, handler);
};


