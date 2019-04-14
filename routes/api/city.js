// API to get City
var keystone = require('keystone');
var _ = require('lodash');
var async = require('async');

var City = keystone.list('City');
var Country = keystone.list('Country');

/** * Get List of City */
exports.getAllCity = function (req, res) {
    City.model
        .find().populate('attractions hotels')
        .exec(function (err, items) {
            if (err) return res.apiError('database error', err);
            return res.apiResponse(items);
        });
}

/** * Get Country by ID */
exports.getCityById = function (req, res) {
    City.model
        .findById(req.params.id).populate('attractions hotels')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item);
        });
}

/** * Get City by Country */
exports.getCityByCountry = function (req, res) {
    console.log('>>>>Calling getCityByCountry', req.body);
    var query = req.body;
    if (query.country) {
        if (query.country.id) {
            Country.model
                .findById(query.country.id).populate('cities')
                .exec(function (err, item) {
                    if (err) return res.apiError('database error', err);
                    if (!item) return res.apiError('not found');
                    res.apiResponse(item.cities);
                });
        } else if (query.country.name) {
            Country.model
                .findOne({ name: query.country.name }).populate('cities')
                .exec(function (err, item) {
                    if (err) return res.apiError('database error', err);
                    if (!item) return res.apiError('not found');
                    res.apiResponse(item.cities);
                });
        }
    } else {
        return res.apiError('invalid query request', query);
    }
};
