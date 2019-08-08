const async = require('async');
const keystone = require('keystone');
const CONSTANTS = require('../constants');

/** * Get List of TravelPackage */
exports.getAllTravelPackage = () => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.find();
};

/** * Get TravelPackage by Params */
exports.getTravelPackageByParams = params => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.find(params);
};

/** * Get TravelPackage by ID */
exports.getTravelPackageById = id => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.findById(id);
};

/** * Update TravelPackage by params */
exports.setTravelPackageByParams = (filter, doc) => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.update(filter, doc);
};

exports.archiveTravelPackageById = (id, handler) => {
	const { status } = CONSTANTS.get().TravelPackage;
	return this.setTravelPackageByParams(
		{ _id: id },
		{ state: status.ARCHIVED },
		handler
	);
};

exports.archiveTravelPackageByTemplateId = (id, handler) => {
	const { status } = CONSTANTS.get().TravelPackage;
	return this.setTravelPackageByParams(
		{ template: id, state: status.PUBLISHED },
		{ state: status.ARCHIVED },
		handler
	);
};

exports.publishTravelPackageById = (id, handler) => {
	const { status } = CONSTANTS.get().TravelPackage;
	return this.setTravelPackageByParams(
		{ _id: id },
		{ state: status.PUBLISHED },
		handler
	);
};

exports.publishTravelPackageByTemplateId = (id, handler) => {
	const that = this;
	return async.waterfall(
		[
			function (callback) {
				that.archiveTravelPackageByTemplateId(id).exec(function (err, resp) {
					callback(null, resp);
				});
			},
			function (input, callback) {
				that.getTravelPackageById(id).exec(function (err, resp) {
					callback(null, resp);
				});
			},
		],
		handler
	);
};
