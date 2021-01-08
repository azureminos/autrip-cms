// API to get TravelPackage
var keystone = require('keystone');
var Parser = require('../../lib/object-parser');
var TravelPackage = keystone.list('TravelPackage');

/** * Get List of TravelPackage */
exports.getAllTravelPackage = function (req, res) {
	TravelPackage.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(Parser.parseTravelPackage(items));
	});
};

/** * Get TravelPackage Template */
exports.getTravelPackageTemplate = function (req, res) {
	console.log('>>>>Calling getTravelPackageTemplate');
	TravelPackage.model
		.find({ isSnapshot: false, status: 'Draft' })
		.exec(function (err, items) {
			if (err) return res.apiError('database error', err);
			return res.apiResponse(Parser.parseTravelPackage(items));
		});
};

/** * Get TravelPackage Snapshot */
exports.getTravelPackageSnapshot = function (req, res) {
	console.log('>>>>Calling getTravelPackageSnapshot');
	TravelPackage.model
		.find({ isSnapshot: true, status: 'Published' })
		.exec(function (err, items) {
			if (err) return res.apiError('database error', err);
			return res.apiResponse(Parser.parseTravelPackage(items));
		});
};

/** * Get TravelPackage by ID */
exports.getTravelPackageById = function (req, res) {
	TravelPackage.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(Parser.parseTravelPackage(item));
	});
};

/** * Get TravelPackage by Params */
exports.getTravelPackageByParams = function (req, res) {
	console.log('>>>>Calling getTravelPackageByParams', req.body);
	var query = req.body;
	TravelPackage.model.find(query).exec(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(Parser.parseTravelPackage(items));
	});
};
