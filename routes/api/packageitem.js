// API to get PackageItem
var keystone = require('keystone');
var PackageItem = keystone.list('PackageItem');
var TravelPackage = keystone.list('TravelPackage');

/** * Get List of PackageItem */
exports.getPackageItem = function (req, res) {
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
    var packageId = req.params.id;
    TravelPackage.model
        .findById(packageId).populate('packageItem')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item.packageItem);
        });
};
