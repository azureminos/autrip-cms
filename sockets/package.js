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
				const handler = (err, resp) => {
					return callback(err, Parser.parsePackageItem(resp));
				};
				PackageItem.getPackageItemByParams({ package: id }, handler);
			},
			packageHotels: callback => {
				const handler = (err, resp) => {
					return callback(err, Parser.parsePackageHotel(resp));
				};
				PackageHotel.getPackageHotelByParams({ package: id }, handler);
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
				const handler = (err, items) => {
					const cities = _.map(items, item => {
						return item.attraction ? item.attraction.city : null;
					});
					const handler2 = (err, resp) => {
						return callback(null, Parser.parseCity(resp, 'all'));
					};
					// console.log('>>>>getPackageDetails.cityAttractions : cities', cities);
					return City.getFullCityByParams({ _id: { $in: cities } }, handler2);
				};
				PackageItem.getPackageItemByParams({ package: id }, handler);
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
	// console.log('>>>>server socket received event[push:package:archive]', id);
	const TravelPackage = keystone.list('TravelPackage');
	const handler = (err, resp) => {
		console.log('>>>>Socket.archivePackage resp', resp);
	};
	TravelPackage.archiveTravelPackageByTemplateId(id, handler);
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
					PackageItem.getPackageItemByParams({ package: id }, callback);
				},
				packageHotels: callback => {
					PackageHotel.getPackageHotelByParams({ package: id }, callback);
				},
				packageRates: callback => {
					PackageRate.getPackageRateByParams({ package: id }, callback);
				},
				flightRates: callback => {
					FlightRate.getFlightRateByParams({ package: id }, callback);
				},
			},
			function (err, results) {
				console.log(
					'>>>>Socket.publishPackage, before building snapshot',
					results
				);
				const handler = (err, resp) => {
					console.log(
						'>>>>Socket.publishPackage, published travel package only',
						resp
					);
				};
				TravelPackage.publishTravelPackage(
					Parser.snapshot(results.packageSummary),
					handler
				);
			}
		);
	};
	TravelPackage.publishTravelPackageByTemplateId(id, handler);
};
