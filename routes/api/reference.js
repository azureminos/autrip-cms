const async = require('async');

const refDestination = require('./refDestination');
const refCategory = require('./refCategory');
const refProduct = require('./refProduct');
const refAttraction = require('./refAttraction');

/* ==== API to load reference data ==== */
exports.loadReference = function (req, res) {
	res.apiResponse({ result: 200, error: '' });
	async.series(
		[
			function (callback) {
				refAttraction.delRefAttraction(callback);
			},
			function (callback) {
				refProduct.delRefProduct(callback);
			},
			function (callback) {
				refCategory.delRefSubCategory(callback);
			},
			function (callback) {
				refCategory.delRefCategory(callback);
			},
			function (callback) {
				refDestination.delRefDestination(callback);
			},
			function (callback) {
				refDestination.delRefCountry(callback);
			},
			function (callback) {
				refDestination.loadRefDestination(req, res, callback);
			},
			function (callback) {
				refCategory.loadRefCategory(req, res, callback);
			},
			function (callback) {
				refProduct.loadRefProduct(req, res, callback);
			},
			function (callback) {
				refAttraction.loadRefAttraction(req, res, callback);
			},
		],
		function (err) {
			console.log('All Steps Completed');
		}
	);
};
