// API to get HotelRoom
var keystone = require('keystone');
var HotelRoom = keystone.list('HotelRoom');
var Hotel = keystone.list('Hotel');

/** * Get List of HotelRoom */
exports.getAllHotelRoom = function (req, res) {
    HotelRoom.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        return res.apiResponse(items);
    });
};

/** * Get HotelRoom by ID */
exports.getHotelRoomById = function (req, res) {
    HotelRoom.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        return res.apiResponse(item);
    });
};

/** * Get HotelRoom by Hotel */
exports.getHotelRoomByHotel = function (req, res) {
    var hotelId = req.params.id;
    Hotel.model
        .findById(hotelId).populate('hotelroom')
        .exec(function (err, item) {
            if (err) return res.apiError('database error', err);
            if (!item) return res.apiError('not found');
            return res.apiResponse(item.hotelroom);
        });
};
