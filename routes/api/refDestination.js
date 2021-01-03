const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefCountry = keystone.list('RefCountry');
const tbRefDestination = keystone.list('RefDestination');

const { VIATOR_BASE_URL, VIATOR_AUTH_KEY } = process.env;

// Delete all Ref_Country
exports.delRefCountry = (req, res, next) => {
	console.log('>>>>Function [delRefCountry] started');
	tbRefCountry.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefCountry] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Get all Ref_Destination
exports.getRefDestination = (req, res, next) => {
	console.log('>>>>Function [getRefDestination] started', req);
	tbRefDestination.model.find(req, (err, docs) => {
		if (err) {
			console.log('>>>>Function [getRefDestination] error', err);
			if (res) {
				return res.apiResponse({ result: 500, error: err, data: [] });
			} else if (next) {
				next([]);
			}
		} else {
			console.log(
				`>>>>Function [getRefDestination] retrieved [${docs.length}] destinations'`
			);
			if (res) {
				return res.apiResponse({ result: 200, error: '', data: docs });
			} else if (next) {
				next(docs);
			}
		}
	});
};
// Delete all Ref_Destination
exports.delRefDestination = (req, res, next) => {
	console.log('>>>>Function [delRefDestination] started');
	tbRefDestination.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefDestination] executed');
		if (res) {
			return res.apiResponse({ result: 200, error: '' });
		} else if (next) {
			next();
		}
	});
};
// Load Ref Country and Destinations
exports.loadRefDestination = (req, res, next) => {
	console.log('>>>>Function [loadRefDestination] started');
	axios
		.get(`${VIATOR_BASE_URL}/service/taxonomy/destinations`, {
			headers: {
				'exp-api-key': VIATOR_AUTH_KEY,
			},
		})
		.then(resp => {
			const count
				= resp.data && resp.data.data && resp.data.data.length
					? resp.data.data.length
					: 0;
			console.log(`>>>>Function [loadRefDestination] received data [${count}]`);
			if (count > 0) {
				const ds = [];
				const ct = [];
				_.forEach(resp.data.data, item => {
					// Load all countries
					if (item.destinationType === 'COUNTRY') {
						ct.push({ name: item.destinationName });
					}
					// Only load destination with currency code as AUD
					if (item.defaultCurrencyCode === 'AUD') {
						ds.push({
							name: item.destinationName,
							selectable: item.selectable,
							defaultCurrencyCode: item.defaultCurrencyCode,
							parentId: item.parentId,
							lookupId: item.lookupId,
							timeZone: item.timeZone,
							type: item.destinationType,
							destinationId: item.destinationId,
							location: `${String(item.latitude)}, ${String(item.longitude)}`,
							addrCarpark: '',
						});
					}
				});

				async.series(
					[
						function (callback) {
							console.log(`>>>>[${ct.length}] item loaded into RefCountry`);
							tbRefCountry.model.insertMany(ct, callback);
						},
						function (callback) {
							console.log(`>>>>[${ds.length}] item loaded into RefDestination`);
							tbRefDestination.model.insertMany(ds, callback);
						},
					],
					function (err) {
						console.log('>>>>Function [loadRefDestination] items loaded');
						if (res) {
							return res.apiResponse({ result: 200, error: '' });
						} else if (next) {
							next();
						}
					}
				);
			}
		})
		.catch(error => {
			console.error({ result: 500, error: error });
			if (res) {
				return res.apiResponse({ result: 500, error: error });
			} else if (next) {
				next('>>>>Function [loadRefDestination] unknown error');
			}
		});
};
