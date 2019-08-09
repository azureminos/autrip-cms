const async = require('async');
const keystone = require('keystone');
const CONSTANTS = require('../constants');

/** * Get List of TravelPackage */
exports.getAllTravelPackage = handler => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.find().exec(handler);
};

/** * Get TravelPackage by Params */
exports.getTravelPackageByParams = (params, handler) => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.find(params).exec(handler);
};

/** * Get TravelPackage by ID */
exports.getTravelPackageById = (id, handler) => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.findById(id).exec(handler);
};

/** * Update TravelPackage by params */
exports.setTravelPackageByParams = (filter, doc, handler) => {
	const TravelPackage = keystone.list('TravelPackage').model;
	return TravelPackage.update(filter, doc).exec(handler);
};

exports.archiveTravelPackageById = (id, handler) => {
	const { status } = CONSTANTS.get().TravelPackage;
	return this.setTravelPackageByParams(
		{ _id: id },
		{ status: status.ARCHIVED },
		handler
	);
};

exports.archiveTravelPackageByTemplateId = (id, handler) => {
	const { status } = CONSTANTS.get().TravelPackage;
	return this.setTravelPackageByParams(
		{ template: id, status: status.PUBLISHED },
		{ status: status.ARCHIVED },
		handler
	);
};

exports.publishTravelPackageById = (id, handler) => {
	const { status } = CONSTANTS.get().TravelPackage;
	return this.setTravelPackageByParams(
		{ _id: id },
		{ status: status.PUBLISHED },
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
