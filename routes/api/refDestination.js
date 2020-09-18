const _ = require('lodash');
const axios = require('axios');
const async = require('async');
const keystone = require('keystone');

const tbRefCountry = keystone.list('RefCountry');
const tbRefDestination = keystone.list('RefDestination');

// Delete all Ref_Country
exports.delRefCountry = next => {
	console.log('>>>>Function [delRefCountry] started');
	tbRefCountry.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefCountry] executed');
		next();
	});
};
// Get all Ref_Destination
exports.getRefDestination = next => {
	console.log('>>>>Function [getRefDestination] started');
	tbRefDestination.model.deleteMany({}, () => {
		console.log('>>>>Function [getRefDestination] executed');
		next();
	});
};
// Delete all Ref_Destination
exports.delRefDestination = next => {
	console.log('>>>>Function [delRefDestination] started');
	tbRefDestination.model.deleteMany({}, () => {
		console.log('>>>>Function [delRefDestination] executed');
		next();
	});
};
// Load Ref Country and Destinations
exports.loadRefDestination = (req, res, next) => {
	console.log('>>>>Function [loadRefDestination] started');
	axios
		.get('https://viatorapi.viator.com/service/taxonomy/destinations', {
			headers: {
				'exp-api-key': '1ed594e8-944b-404f-bd21-92d9090c64d4',
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
							timeZone: item.timeZone,
							type: item.destinationType,
							destinationId: item.destinationId,
							latitude: String(item.latitude),
							longitude: String(item.longitude),
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
						next();
					}
				);
			}
		})
		.catch(error => {
			console.error({ result: 500, error: error });
			next('>>>>Function [loadRefDestination] unknown error');
		});
};
