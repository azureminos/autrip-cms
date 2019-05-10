// API to get TravelPackage
var keystone = require('keystone');
var TravelPackage = keystone.list('TravelPackage');

var parseTravelPackage = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = _.pick(item, 'slug', 'name', 'description', 'finePrint', 'notes', 'departureDate',
				'effectiveTo', 'effectiveFrom', 'isExtention', 'isCustomisable', 'isPromoted', 'state',
				'maxParticipant', 'totalDays', 'additionalField');
			r.id = item._id;
			r.imageUrl = item.image.secure_url;
			rs.push(r);
		});
		return rs;
	} else {
		var r = _.pick(item, 'slug', 'name', 'description', 'finePrint', 'notes', 'departureDate',
			'effectiveTo', 'effectiveFrom', 'isExtention', 'isCustomisable', 'isPromoted', 'state',
			'maxParticipant', 'totalDays', 'additionalField');
		r.id = input._id;
		r.imageUrl = item.image.secure_url;
		return r;
	}
};

/** * Get List of TravelPackage */
exports.getAllTravelPackage = function (req, res) {
	TravelPackage.model.find(function (err, items) {
		if (err) return res.apiError('database error', err);
		return res.apiResponse(parseTravelPackage(items));
	});
};

/** * Get TravelPackage by ID */
exports.getTravelPackageById = function (req, res) {
	TravelPackage.model.findById(req.params.id)
		.exec(function (err, item) {
			if (err) return res.apiError('database error', err);
			if (!item) return res.apiError('not found');
			return res.apiResponse(parseTravelPackage(item));
	});
};

/** * Get TravelPackage by Params */
exports.getTravelPackageByParams = function (req, res) {
	console.log('>>>>Calling getTravelPackageByParams', req.body);
	var query = req.body;
	TravelPackage.model.find(query)
		.exec(function (err, items) {
			if (err) return res.apiError('database error', err);
			return res.apiResponse(parseTravelPackage(items));
	});
};
