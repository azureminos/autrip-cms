// API to get Country
var keystone = require('keystone');
var Country = keystone.list('Country');

/** * Get List of Country */
exports.getAllCountry = function (req, res) {
    Country.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
}

/** * Get Country by ID */
exports.getCountryById = function (req, res) {
    Country.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
}
