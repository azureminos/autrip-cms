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
				refAttraction.delRefAttraction(null, null, callback);
			},
			function (callback) {
				refProduct.delRefProduct(null, null, callback);
			},
			function (callback) {
				refCategory.delRefSubCategory(null, null, callback);
			},
			function (callback) {
				refCategory.delRefCategory(null, null, callback);
			},
			function (callback) {
				refDestination.delRefDestination(null, null, callback);
			},
			function (callback) {
				refDestination.delRefCountry(null, null, callback);
			},
			function (callback) {
				refDestination.loadRefDestination(null, null, callback);
			},
			function (callback) {
				refCategory.loadRefCategory(null, null, callback);
			},
			function (callback) {
				refProduct.loadRefProduct(null, null, callback);
			},
			function (callback) {
				refAttraction.loadRefAttraction(null, null, callback);
			},
		],
		function (err) {
			console.log('All Steps Completed');
		}
	);
};
