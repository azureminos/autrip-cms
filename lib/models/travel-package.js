const async = require('async');
const keystone = require('keystone');
const CONSTANTS = require('../constants');
const { status } = CONSTANTS.get().TravelPackage;
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
	return this.setTravelPackageByParams(
		{ _id: id },
		{ status: status.ARCHIVED },
		handler
	);
};

exports.archiveTravelPackageByTemplateId = (id, handler) => {
	return this.setTravelPackageByParams(
		{ template: id, status: status.PUBLISHED },
		{ status: status.ARCHIVED },
		handler
	);
};

exports.publishTravelPackageByTemplateId = (id, handler) => {
	const that = this;
	return async.waterfall(
		[
			function (callback) {
				const handler1 = (err, resp) => {
					callback(null, resp);
				};
				// console.log('>>>>Before Model.archiveTravelPackageByTemplateId', id);
				that.archiveTravelPackageByTemplateId(id, handler1);
			},
			function (input, callback) {
				const handler2 = (err, resp) => {
					callback(null, resp);
				};
				// console.log('>>>>Before Model.getTravelPackageById', id);
				that.getTravelPackageById(id, handler2);
			},
		],
		handler
	);
};

exports.publishTravelPackage = (doc, handler) => {
	// console.log('>>>>Model.publishTravelPackage', doc);
	const TravelPackage = keystone.list('TravelPackage').model;
	const tPackage = new TravelPackage(doc);
	tPackage.save(handler);
};
