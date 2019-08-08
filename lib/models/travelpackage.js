var keystone = require('keystone');
var TravelPackage = keystone.list('TravelPackage').model;

/** * Get List of TravelPackage */
exports.getAllTravelPackage = () => {
	return TravelPackage.find();
};

/** * Get TravelPackage by Params */
exports.getTravelPackageByParams = params => {
	return TravelPackage.find(params);
};

/** * Get TravelPackage by ID */
exports.getTravelPackageById = id => {
	return TravelPackage.findById(id);
};

/** * Update TravelPackage by params */
/* exports.setTravelPackageByParams = id => {
	return TravelPackage.updateMany(
		{ template: id, state: status.PUBLISHED },
		{ state: status.ARCHIVED }
	);
	TravelPackage.model.findById(id);
};
*/
