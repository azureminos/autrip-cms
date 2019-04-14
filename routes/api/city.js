// API to get City
var keystone = require('keystone');
var _ = require('lodash');
var async = require('async');

var City = keystone.list('City');
var Country = keystone.list('Country');

/** * Get List of City */
exports.getAllCity = function (req, res) {
    var result = [];
    City.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        result = [];
        //console.log('>>>>Draft', result);

        var callback = function () {};

        async.each(items, function (city, callback) {
            //console.log(`>>>>Query Country[${city.country}] of city[${city.name}]`);
            Country.model.findById(city.country, function (err, item) {
                //console.log(`>>>>Process Country of city[${city.name}]`, item);
                result.push({
                    id: city._id,
                    name: city.name,
                    description: city.description,
                    country: item.name,
                    additionalField: city.additionalField,
                });
                //console.log(`>>>>After Process city[${city.name}]`, result);
                callback();
            });
        }, function (err) {
            if (err) {
                return res.apiError('database error', err);
            } else {
                //console.log('>>>>Final Result', result);
                return res.apiResponse(result);
            }
        });
    });
};

/** * Get City by ID */
exports.getCityById = function (req, res) {
    City.model.findById(req.params.id).populate('attractions').exec(function (err, city) {
        if (err) return res.apiError('database error', err);
        if (!city) return res.apiError('not found');
        return res.apiResponse(city);
        /*City.model.findById(city.country, function (err, item) {
            if (err) return res.apiError('database error', err);
            return res.apiResponse(item);
            return res.apiResponse({
                id: city._id,
                name: city.name,
                description: city.description,
                country: item.name,
                additionalField: city.additionalField,
            });
        });*/
    });
};

/** * Get City by Country */
exports.getCityByCountry = function (req, res) {
    var countryId = req.params.id;
    Country.model
        .findById(countryId).populate('city')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            res.apiResponse(item.city);
        });
};
