// API to get PackageRate
var keystone = require('keystone');
var PackageRate = keystone.list('PackageRate');
var TravelPackage = keystone.list('TravelPackage');

/** * Get List of PackageRate */
exports.getAllPackageRate = function (req, res) {
    PackageRate.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
};

/** * Get PackageRate by ID */
exports.getPackageRateById = function (req, res) {
    PackageRate.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
};

/** * Get FlightRate by Params */
exports.getPackageRateByPackage = function (req, res) {
    var packageId = req.params.id;
    TravelPackage.model
        .findById(packageId).populate('packageRate')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item.packageRate);
        });
};
