// API to get Attraction
var keystone = require('keystone');
var Attraction = keystone.list('Attraction');
var City = keystone.list('City');

/** * Get List of Attraction */
exports.getAllAttraction = function (req, res) {
    Attraction.model.find().populate('city, nearByAttractions').exec(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
}

/** * Get Attraction by ID */
exports.getAttractionById = function (req, res) {
    Attraction.model.findById(req.params.id).populate('city, nearByAttractions').exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
}

/** * Get Attraction by City */
exports.getAttractionByCity = function (req, res) {
    var cityId = req.params.id;
    City.model
        .findById(cityId).populate('attration')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item.attration);
        });
};
