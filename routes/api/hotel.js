// API to get Hotel
var keystone = require('keystone'),
    Hotel = keystone.list('Hotel');

/** * Get List of Hotel */
exports.getHotel = function (req, res) {
    Hotel.model.find().populate('city, nearByAttractions').exec(function (err, items) {
        if (err) return res.apiError('database error', err);
        res.apiResponse(items);
    });
}

/** * Get Hotel by ID */
exports.getHotelById = function (req, res) {
    Hotel.model.findById(req.params.id).populate('city, nearByAttractions').exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
}