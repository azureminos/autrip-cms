const keystone = require('keystone');

/** * Get List of PackageHotel */
exports.getAllPackageHotel = handler => {
	const PackageHotel = keystone.list('PackageHotel').model;
	return PackageHotel.find()
		.populate('hotel')
		.exec(handler);
};

/** * Get PackageHotel by Params */
exports.getPackageHotelByParams = (params, handler) => {
	const PackageHotel = keystone.list('PackageHotel').model;
	return PackageHotel.find(params)
		.populate('hotel')
		.exec(handler);
};

/** * Get PackageHotel by ID */
exports.getPackageHotelById = (id, handler) => {
	const PackageHotel = keystone.list('PackageHotel').model;
	return PackageHotel.findById(id)
		.populate('hotel')
		.exec(handler);
};

exports.publishPackageHotel = (docs, handler) => {
	console.log('>>>>Model.publishPackageHotel', docs);
	const PackageHotel = keystone.list('PackageHotel').model;
	PackageHotel.create(docs, handler);
};
