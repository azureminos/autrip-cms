const keystone = require('keystone');

/** * Get List of City */
exports.getAllCity = handler => {
	const City = keystone.list('City').model;
	return City.find().exec(handler);
};

/** * Get City by Params */
exports.getCityByParams = (params, handler) => {
	const City = keystone.list('City').model;
	return City.find(params).exec(handler);
};

/** * Get Full City by Params */
exports.getFullCityByParams = (params, handler) => {
	const City = keystone.list('City').model;
	return City.find(params)
		.populate('attractions hotels carRates')
		.exec(handler);
};

/** * Get City by ID */
exports.getCityById = (id, handler) => {
	const City = keystone.list('City').model;
	return City.findById(id).exec(handler);
};

/** * Get Full City by ID */
exports.getFullCityById = (id, handler) => {
	const City = keystone.list('City').model;
	return City.findById(id)
		.populate('attractions hotels carRates')
		.exec(handler);
};
