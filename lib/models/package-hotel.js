const _ = require('lodash');
const async = require('async');
const keystone = require('keystone');
const Parser = require('../../lib/object-parser');

const reorg = items => {
	if (!items) return [];
	const result = [];
	const groups = _.groupBy(_.sortBy(items, ['dayNo']), item => {
		return item.dayNo;
	});
	let day = 0;
	const days = _.keys(groups);
	_.each(days, d => {
		day++;
		let seq = 0;
		// console.log(`Re-org Day ${d}`, groups[d]);
		_.each(groups[d], i => {
			if (!i.linkedHotels) {
				seq++;
				result.push({ ...i, dayNo: day });
			} else {
				const subgroups = _.groupBy(
					_.sortBy(i.linkedHotels, ['dayNo']),
					item => {
						return item.dayNo;
					}
				);
				const subdays = _.keys(subgroups);
				_.each(subdays, (sd, idxSubDay) => {
					day = day + (idxSubDay === 0 ? 0 : 1);
					seq = idxSubDay === 0 ? seq : 0;
					_.each(subgroups[sd], si => {
						seq++;
						result.push({ ...si, dayNo: day });
					});
				});
			}
		});
	});
	// console.log('>>>>After reorg', result);
	return result;
};

/** * Get List of PackageHotel */
exports.getAllPackageHotel = handler => {
	const PackageHotel = keystone.list('PackageHotel').model;
	return PackageHotel.find()
		.populate('hotel')
		.exec(handler);
};

/** * Get PackageHotel by Params */
exports.getPackageHotelByParams = (params, handler) => {
	const PackageHotel = keystone.list('PackageHotel').model;
	return PackageHotel.find(params)
		.populate('hotel')
		.exec(handler);
};

/** * Get PackageHotel by ID */
exports.getPackageHotelById = (id, handler) => {
	const PackageHotel = keystone.list('PackageHotel').model;
	return PackageHotel.findById(id)
		.populate('hotel')
		.exec(handler);
};

/** * Get PackageHotel by Package */
exports.getPackageHotelByPackage = (id, handler) => {
	const PackageHotel = keystone.list('PackageHotel').model;
	const callback = (err, resp) => {
		if (err) return handler(err, []);
		const hotelHandlers = _.map(resp, hotel => {
			const hotelHandler = hotelCallback => {
				// console.log('>>>>Package hotel', hotel);
				if (!hotel.linkedPackage) {
					return hotelCallback(err, Parser.parsePackageHotel(hotel));
				} else {
					console.log('>>>>Package item with linked package', hotel);
					const linkHandler = (err, hotels) => {
						// console.log('>>>>Linked package hotels', hotels);
						const nHotel = {
							...Parser.parsePackageHotel(hotel),
							linkedHotels: Parser.parsePackageHotel(hotels),
						};
						hotelCallback(err, nHotel);
					};
					PackageHotel.find({ package: hotel.linkedPackage })
						.populate('hotel')
						.exec(linkHandler);
				}
			};
			return hotelHandler;
		});
		async.parallel(hotelHandlers, (err, results) => {
			if (err) return handler(err, []);
			console.log('>>>>hotelHandlers results', results);
			return handler(err, reorg(results));
		});
	};
	return PackageHotel.find({ package: id })
		.populate('hotel')
		.exec(callback);
};

exports.publishPackageHotel = (docs, handler) => {
	console.log('>>>>Model.publishPackageHotel', docs);
	const PackageHotel = keystone.list('PackageHotel').model;
	PackageHotel.create(docs, handler);
};
