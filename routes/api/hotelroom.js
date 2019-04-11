// API to get HotelRoom
var keystone = require('keystone'),
    HotelRoom = keystone.list('HotelRoom');

/** * Get List of HotelRoom */
exports.getHotelRoom = function (req, res) {
    HotelRoom.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        res.apiResponse(items);
    });
}

/** * Get HotelRoom by ID */
exports.getHotelRoomById = function (req, res) {
    HotelRoom.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        res.apiResponse(item);
    });
}