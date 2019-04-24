// API to get PackageHotel
var keystone = require('keystone');
var PackageHotel = keystone.list('PackageHotel');
var TravelPackage = keystone.list('TravelPackage');

/** * Get List of PackageHotel */
exports.getAllPackageHotel = function (req, res) {
	PackageHotel.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(items);
	});
};

/** * Get PackageHotel by ID */
exports.getPackageHotelById = function (req, res) {
	PackageHotel.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		return res.apiResponse(item);
	});
};

/** * Get FlightRate by Params */
exports.getPackageHotelByPackage = function (req, res) {
	console.log('>>>>Calling getPackageHotelByPackage', req.body);
	var query = req.body;
	if (query.package) {
		if (query.package.id) {
			TravelPackage.model
				.findById(query.package.id).populate('packageHotels')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.packageHotels);
				});
		} else if (query.package.name) {
			TravelPackage.model
				.findOne({ name: query.package.name }).populate('packageHotels')
				.exec(function (err, item) {
					if (err) return res.apiError('database error', err);
					if (!item) return res.apiError('not found');
					return res.apiResponse(item.packageHotels);
				});
		}
	} else {
		return res.apiError('invalid query request', query);
	}
};
