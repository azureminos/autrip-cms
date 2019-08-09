const keystone = require('keystone');

/** * Get List of PackageHotel */
exports.getAllPackageHotel = () => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.find();
};

/** * Get PackageHotel by Params */
exports.getPackageHotelByParams = params => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.find(params);
};

/** * Get PackageHotel by ID */
exports.getPackageHotelById = id => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.findById(id);
};


