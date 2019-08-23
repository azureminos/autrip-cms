const _ = require('lodash');
const async = require('async');
const keystone = require('keystone');
const Parser = require('../lib/object-parser');
const TravelPackage = require('../lib/models/travel-package');
const PackageItem = require('../lib/models/package-item');
const PackageHotel = require('../lib/models/package-hotel');
const PackageRate = require('../lib/models/package-rate');
const FlightRate = require('../lib/models/flight-rate');
const City = require('../lib/models/city');
const CONSTANTS = require('../lib/constants');
const { status } = CONSTANTS.get().TravelPackage;

exports.getPackageDetails = ({ request: { id }, sendStatus, socket }) => {
	// console.log('>>>>server socket received event[push:package:get]', id);
	// async calls
	async.parallel(
		{
			packageSummary: callback => {
				const handler = (err, resp) => {
					return callback(err, Parser.parseTravelPackage(resp));
				};
				TravelPackage.getTravelPackageById(id, handler);
			},
			packageItems: callback => {
				PackageItem.getPackageItemByPackage(id, callback);
			},
			packageHotels: callback => {
				PackageHotel.getPackageHotelByPackage(id, callback);
			},
			packageRates: callback => {
				const handler = (err, resp) => {
					const sortedRates = (resp || []).sort(function (a, b) {
						return b.priority - a.priority;
					});
					return callback(null, sortedRates);
				};
				PackageRate.getPackageRateByParams({ package: id }, handler);
			},
			flightRates: callback => {
				const handler = (err, resp) => {
					const sortedRates = (resp || []).sort(function (a, b) {
						return b.priority - a.priority;
					});
					return callback(null, sortedRates);
				};
				FlightRate.getFlightRateByParams({ package: id }, handler);
			},
			cities: callback => {
				callback(null, []);
				/* const handler = (err, items) => {
					const cities = _.map(items, item => {
						return item.attraction ? item.attraction.city : null;
					});
					const handler2 = (err, resp) => {
						return callback(null, Parser.parseCity(resp, 'all'));
					};
					// console.log('>>>>getPackageDetails.cityAttractions : cities', cities);
					return City.getFullCityByParams({ _id: { $in: cities } }, handler2);
				};
				PackageItem.getPackageItemByPackage(id, handler);*/
			},
			carRates: callback => {
				// TBD
				callback(null, []);
			},
			snapshots: callback => {
				const handler = (err, resp) => {
					callback(err, Parser.parseSnapshot(resp));
				};
				TravelPackage.getTravelPackageByParams({ template: id }, handler);
			},
		},
		function (err, results) {
			// console.log('>>>>server final callback for event[push:package:get]', results);
			socket.emit('package:get', results);
		}
	);
};

exports.getFilteredPackages = ({ request, sendStatus, socket }) => {
	// console.log('>>>>server socket received event[push:package:filter]', request);
	const TravelPackage = keystone.list('TravelPackage');

	TravelPackage.model.find(request).exec(function (err, items) {
		socket.emit('package:refreshAll', {
			packages: Parser.parseTravelPackage(items),
		});
	});
};

exports.archivePackage = ({ request: { id }, sendStatus, socket }) => {
	console.log('>>>>server socket received event[push:package:archive]', id);
	const handler = (err, resp) => {
		if (err) {
			console.log('>>>>Socket.publishPackage >> Finished in error', err);
			socket.emit('package:archive', {
				message: 'Failed to archive travel package',
				err: true,
			});
		} else {
			console.log('>>>>Socket.archivePackage resp', resp);
			socket.emit('package:archive', {
				message: 'Travel package has been archived',
			});
		}
	};
	TravelPackage.archiveTravelPackageById(id, handler);
};

exports.publishPackage = ({ request: { id }, sendStatus, socket }) => {
	// console.log('>>>>server socket received event[push:package:status]', id);
	const handler = (err, resp) => {
		console.log('>>>>Socket.publishPackage, archived existing snapshots', resp);
		async.parallel(
			{
				packageSummary: callback => {
					TravelPackage.getTravelPackageById(id, callback);
				},
				packageItems: callback => {
					const handler = (err, resp) => {
						if (err) {
							console.log('>>>>Model.packageItems >> Error', err);
							callback(err, null);
						} else {
							// console.log('>>>>Model.packageItems', resp);
							const snapshots = _.map(resp, it => {
								const ss = Parser.snapshot(it._doc);
								ss.package = undefined;
								ss.attraction = ss.attraction
									? ss.attraction._id
									: ss.attraction;
								return ss;
							});
							// console.log('>>>>Model.packageItems before publish', snapshots);
							PackageItem.publishPackageItem(snapshots, callback);
						}
					};
					PackageItem.getPackageItemByPackage(id, handler);
				},
				packageHotels: callback => {
					const handler = (err, resp) => {
						if (err) {
							console.log('>>>>Model.packageHotels >> Error', err);
							callback(err, null);
						} else {
							// console.log('>>>>Model.packageHotels', resp);
							const snapshots = _.map(resp, it => {
								const ss = Parser.snapshot(it._doc);
								ss.package = undefined;
								ss.hotel = ss.hotel ? ss.hotel._id : ss.hotel;
								return ss;
							});
							// console.log('>>>>Model.packageHotels before publish', snapshots);
							PackageHotel.publishPackageHotel(snapshots, callback);
						}
					};
					PackageHotel.getPackageHotelByParams({ package: id }, handler);
				},
				packageRates: callback => {
					const handler = (err, resp) => {
						if (err) {
							console.log('>>>>Model.packageRates >> Error', err);
							callback(err, null);
						} else {
							// console.log('>>>>Model.packageRates', resp);
							const snapshots = _.map(resp, it => {
								const ss = Parser.snapshot(it._doc);
								ss.package = undefined;
								return ss;
							});
							// console.log('>>>>Model.packageRates before publish', snapshots);
							PackageRate.publishPackageRate(snapshots, callback);
						}
					};
					PackageRate.getPackageRateByParams({ package: id }, handler);
				},
				flightRates: callback => {
					const handler = (err, resp) => {
						if (err) {
							console.log('>>>>Model.flightRates >> Error', err);
							callback(err, null);
						} else {
							// console.log('>>>>Model.flightRates', resp);
							const snapshots = _.map(resp, it => {
								const ss = Parser.snapshot(it._doc);
								ss.package = undefined;
								return ss;
							});
							// console.log('>>>>Model.flightRates before publish', snapshots);
							FlightRate.publishFlightRate(snapshots, callback);
						}
					};
					FlightRate.getFlightRateByParams({ package: id }, handler);
				},
			},
			function (err, results) {
				if (err) {
					console.log('>>>>Socket.publishPackage >> Finished in error', err);
					socket.emit('package:publish', {
						message: 'Failed to publish travel package',
						err: true,
					});
				} else if (!results.packageSummary) {
					console.log('>>>>Socket.publishPackage >> PackageSummary is created');
					socket.emit('package:publish', {
						message: 'Travel package not found',
						err: true,
					});
				} else {
					// console.log('>>>>Socket.publishPackage, new snapshot', results);
					const flightRates = _.map(results.flightRates, item => {
						return item._id;
					});
					const packageRates = _.map(results.packageRates, item => {
						return item._id;
					});
					const packageHotels = _.map(results.packageHotels, item => {
						return item._id;
					});
					const packageItems = _.map(results.packageItems, item => {
						return item._id;
					});

					const templateId = results.packageSummary._id;
					const snapshot = Parser.snapshot(resp._doc);
					snapshot.template = templateId;
					snapshot.isSnapshot = true;
					snapshot.status = status.PUBLISHED;
					snapshot.packageItems = packageItems;
					snapshot.packageRates = packageRates;
					snapshot.flightRates = flightRates;
					snapshot.packageHotels = packageHotels;

					const handler = (err, response) => {
						console.log('>>>>Completed publish travel package', response);
						socket.emit('package:publish', {
							message: 'Travel package has been published',
						});
					};

					TravelPackage.publishTravelPackage(snapshot, handler);
				}
			}
		);
	};
	TravelPackage.publishTravelPackageByTemplateId(id, handler);
};
