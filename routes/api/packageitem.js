// API to get PackageItem
var keystone = require('keystone');
var PackageItem = keystone.list('PackageItem');
var TravelPackage = keystone.list('TravelPackage');

/** * Get List of PackageItem */
exports.getAllPackageItem = function (req, res) {
	PackageItem.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(items);
	});
};

/** * Get PackageItem by ID */
exports.getPackageItemById = function (req, res) {
	PackageItem.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(item);
	});
};

/** * Get FlightRate by Params */
exports.getPackageItemByPackage = function (req, res) {
	console.log('>>>>Calling getPackageItemByPackage', req.body);
	var query = req.body;
	if (query.package) {
		if (query.package.id) {
			TravelPackage.model
				.findById(query.package.id).populate('packageItems')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.packageItems);
				});
		} else if (query.package.name) {
			TravelPackage.model
				.findOne({ name: query.package.name }).populate('packageItems')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.packageItems);
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
