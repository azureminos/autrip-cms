const keystone = require('keystone');

/** * Get List of FlightRate */
exports.getAllFlightRate = handler => {
	const FlightRate = keystone.list('FlightRate').model;
	return FlightRate.find().exec(handler);
};

/** * Get FlightRate by Params */
exports.getFlightRateByParams = (params, handler) => {
	const FlightRate = keystone.list('FlightRate').model;
	return FlightRate.find(params).exec(handler);
};

/** * Get FlightRate by ID */
exports.getFlightRateById = (id, handler) => {
	const FlightRate = keystone.list('FlightRate').model;
	return FlightRate.findById(id).exec(handler);
};

exports.publishFlightRate = (docs, handler) => {
	console.log('>>>>Model.publishFlightRate', docs);
	const FlightRate = keystone.list('FlightRate').model;
	FlightRate.create(docs, handler);
};
