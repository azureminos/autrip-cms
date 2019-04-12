// API to get Hotel
var keystone = require('keystone');
var Hotel = keystone.list('Hotel');
var City = keystone.list('City');

/** * Get List of Hotel */
exports.getAllHotel = function (req, res) {
    Hotel.model.find().populate('city, nearByAttractions').exec(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
};

/** * Get Hotel by ID */
exports.getHotelById = function (req, res) {
    Hotel.model.findById(req.params.id).populate('city, nearByAttractions').exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
};

/** * Get Hotel by City */
exports.getHotelByCity = function (req, res) {
    var cityId = req.params.id;
    City.model
        .findById(cityId).populate('hotel')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item.hotel);
        });
};
