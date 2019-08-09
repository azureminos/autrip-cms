const keystone = require('keystone');

/** * Get List of PackageRate */
exports.getAllPackageRate = (handler) => {
	const PackageRate = keystone.list('PackageRate').model;
	return PackageRate.find(handler);
};

/** * Get PackageRate by Params */
exports.getPackageRateByParams = (params, handler) => {
	const PackageRate = keystone.list('PackageRate').model;
	return PackageRate.find(params, handler);
};

/** * Get PackageRate by ID */
exports.getPackageRateById = (id, handler) => {
	const PackageRate = keystone.list('PackageRate').model;
	return PackageRate.findById(id, handler);
};


