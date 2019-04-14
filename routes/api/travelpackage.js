// API to get TravelPackage
var keystone = require('keystone');
var TravelPackage = keystone.list('TravelPackage');
var Country = keystone.list('Country');

/** * Get List of TravelPackage */
exports.getAllTravelPackage = function (req, res) {
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

/** * Get TravelPackage by Params */
exports.getTravelPackageByCountry = function (req, res) {
    console.log('>>>>Calling getTravelPackageByCountry', req.body);
    var query = req.body;
    if (query.country) {
        if (query.country.id) {
            Country.model
                .findById(query.country.id).populate('packages')
                .exec(function (err, item) {
                    if (err) return res.apiError('database error', err);
                    if (!item) return res.apiError('not found');
                    return res.apiResponse(item.packages);
                });
        } else if (query.country.name) {
            Country.model
                .findOne({ name: query.country.name }).populate('packages')
                .exec(function (err, item) {
                    if (err) return res.apiError('database error', err);
                    if (!item) return res.apiError('not found');
                    return res.apiResponse(item.packages);
                });
        }
    } else {
        return res.apiError('invalid query request', query);
    }
};
