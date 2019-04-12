// API to get CarRate
var keystone = require('keystone');
var CarRate = keystone.list('CarRate');
var TravelPackage = keystone.list('TravelPackage');

/** * Get List of CarRate */
exports.getAllCarRate = function (req, res) {
    CarRate.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
};

/** * Get CarRate by ID */
exports.getCarRateById = function (req, res) {
    CarRate.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
};

/** * Get FlightRate by Params */
exports.getCarRateByPackage = function (req, res) {
    var packageId = req.params.id;
    TravelPackage.model
        .findById(packageId).populate('carRate')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item.carRate);
        });
};
