// API to get Attraction
var keystone = require('keystone'),
    Attraction = keystone.list('Attraction');

/** * Get List of Attraction */
exports.getAttraction = function (req, res) {
    Attraction.model.find(function (err, items) {
        if (err) return res.apiError('database error', err);
        res.apiResponse({
            Attraction: items
        });
    });
}

/** * Get Attraction by ID */
exports.getAttractionById = function (req, res) {
    Attraction.model.findById(req.params.id).exec(function (err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');
        res.apiResponse({
            Attraction: item
        });
    });
}