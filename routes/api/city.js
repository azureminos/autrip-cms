// API to get City
var keystone = require('keystone'),
    _ = require('lodash'),
    City = keystone.list('City');
    Country = keystone.list('Country');

/** * Get List of City */
exports.getCity = function (req, res) {
    City.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        var promises = [];
        _.forEach(items, function (city) {
            console.log('>>>>Process City', city);
            promises.push(
                Country.model.findById(city.country, 'name', function (err, item) {
                    if (item) {
                        console.log('>>>>Process Country', item);
                        city.country = item;
                    }
                })
            );
        });
        res.apiResponse({
            City: items
        });
    });
}

/** * Get City by ID */
exports.getCityById = function (req, res) {
    City.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        res.apiResponse({
            City: item
        });
    });
}