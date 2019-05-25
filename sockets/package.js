const _ = require('lodash');
const async = require('async');
const keystone = require('keystone');
const helper = require('../lib/object-parser');

exports.getPackageDetails = ({ request: { id }, sendStatus, socket }) => {
	//console.log('>>>>server socket received event[push:package:get]', id);
	const TravelPackage = keystone.list('TravelPackage');
	const PackageItem = keystone.list('PackageItem');
	const PackageHotel = keystone.list('PackageHotel');
	const City = keystone.list('City');
	// async calls
	async.parallel({
		packageSummary: (callback) => {
			TravelPackage.model
				.findById(id)
				.exec(function (err, item) {
					// console.log('>>>>server async calls for event[push:package:get]', item);
					return callback(null, helper.parseTravelPackage(item));
				});
		},
		packageItems: (callback) => {
			PackageItem.model
				.find({ package: id }).populate('attraction')
				.exec(function (err, items) {
					return callback(null, helper.parsePackageItem(items));
				});
		},
		packageHotels: (callback) => {
			PackageHotel.model
				.find({ package: id }).populate('hotel')
				.exec(function (err, items) {
					return callback(null, helper.parsePackageHotel(items));
				});
		},
		packageRates: (callback) => {
			TravelPackage.model
				.findById(id).populate('packageRates')
				.exec(function (err, item) {
					return callback(null, item.packageRates);
				});
		},
		carRates: (callback) => {
			TravelPackage.model
				.findById(id).populate('carRates')
				.exec(function (err, item) {
					return callback(null, item.carRates);
				});
		},
		flightRates: (callback) => {
			TravelPackage.model
				.findById(id).populate('flightRates')
				.exec(function (err, item) {
					return callback(null, item.flightRates);
				});
		},
		cities: (callback) => {
			PackageItem.model
				.find({ package: id }).populate('attraction')
				.exec(function (err, items) {
					const cities = _.map(items, (item) => {
						return item.attraction ? item.attraction.city : null;
					});
					// console.log('>>>>getPackageDetails.cityAttractions : cities', cities);
					return City.model
						.find({ _id: { $in: cities } }).populate('attractions hotels')
						.exec(function (err, items) {
							// console.log('>>>>getPackageDetails.cityAttractions : result', items);
							return callback(null, helper.parseCity(items, 'all'));
						});
				});
		},
	}, function (err, results) {
		// console.log('>>>>server final callback for event[push:package:get]', results);
		socket.emit('package:get', results);
	});
};

exports.updatePackageState = ({ request: { id, status, isRefreshAll }, sendStatus, socket }) => {
	//console.log('>>>>server socket received event[push:package:status]', id);
	const TravelPackage = keystone.list('TravelPackage');

	TravelPackage.model
		.update({ _id: id }, { state: status })
		.exec(function (err, res) {
			//console.log(`>>>>TravelPackage.update[${id}: ${status}]`, res);
			if (isRefreshAll) {
				TravelPackage.model.find(function (err, items) {
					socket.emit('package:refreshAll', { packages: helper.parseTravelPackage(items) });
				});
			} else {
				async.parallel({
					packageSummary: (callback) => {
						TravelPackage.model
							.findById(id)
							.exec(function (err, item) {
								// console.log('>>>>server async calls for event[push:package:get]', item);
								return callback(null, helper.parseTravelPackage(item));
							});
					},
					packageItems: (callback) => {
						TravelPackage.model
							.findById(id).populate('packageItems')
							.exec(function (err, item) {
								return callback(null, item.packageItems);
							});
					},
					packageHotels: (callback) => {
						TravelPackage.model
							.findById(id).populate('packageHotels')
							.exec(function (err, item) {
								return callback(null, item.packageHotels);
							});
					},
					packageRates: (callback) => {
						TravelPackage.model
							.findById(id).populate('packageRates')
							.exec(function (err, item) {
								return callback(null, item.packageRates);
							});
					},
					carRates: (callback) => {
						TravelPackage.model
							.findById(id).populate('carRates')
							.exec(function (err, item) {
								return callback(null, item.carRates);
							});
					},
					flightRates: (callback) => {
						TravelPackage.model
							.findById(id).populate('flightRates')
							.exec(function (err, item) {
								return callback(null, item.flightRates);
							});
					},
				}, function (err, results) {
					//console.log('>>>>server final callback for event[push:package:get]', results);
					socket.emit('package:get', results);
				});
			}
		});
};

exports.getFilteredPackages = ({ request, sendStatus, socket }) => {
	//console.log('>>>>server socket received event[push:package:filter]', request);
	const TravelPackage = keystone.list('TravelPackage');

	TravelPackage.model
		.find(request)
		.exec(function (err, items) {
			socket.emit('package:refreshAll', { packages: helper.parseTravelPackage(items) });
		});
};
