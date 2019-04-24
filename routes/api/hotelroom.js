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
	console.log('>>>>Calling getHotelRoomByHotel', req.body);
	var query = req.body;
	if (query.hotel) {
		if (query.hotel.id) {
			Hotel.model
				.findById(query.hotel.id).populate('rooms')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.rooms);
				});
		} else if (query.hotel.name) {
			Hotel.model
				.findOne({ name: query.hotel.name }).populate('rooms')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.rooms);
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
