// API to get TravelPackage
var keystone = require('keystone');
var TravelPackage = keystone.list('TravelPackage');
var Country = keystone.list('Country');

/** * Get List of TravelPackage */
exports.getTravelPackage = function (req, res) {
    TravelPackage.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
};

/** * Get TravelPackage by ID */
exports.getTravelPackageById = function (req, res) {
    TravelPackage.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
};

/** * Get FlightRate by Params */
exports.getTravelPackageByPackage = function (req, res) {
    var countryId = req.params.id;
    Country.model
        .findById(countryId).populate('package')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');

            return res.apiResponse(item.package);
        });
};
