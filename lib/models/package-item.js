const keystone = require('keystone');

/** * Get List of PackageItem */
exports.getAllPackageItem = handler => {
	const PackageItem = keystone.list('PackageItem').model;
	return PackageItem.find()
		.populate('attraction')
		.exec(handler);
};

/** * Get PackageItem by Params */
exports.getPackageItemByParams = (params, handler) => {
	const PackageItem = keystone.list('PackageItem').model;
	return PackageItem.find(params)
		.populate('attraction')
		.exec(handler);
};

/** * Get PackageItem by ID */
exports.getPackageItemById = (id, handler) => {
	const PackageItem = keystone.list('PackageItem').model;
	return PackageItem.findById(id)
		.populate('attraction')
		.exec(handler);
};
