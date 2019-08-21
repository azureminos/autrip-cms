const _ = require('lodash');
const async = require('async');
const keystone = require('keystone');
const Parser = require('../../lib/object-parser');

const reorg = items => {
	if (!items) return [];
	const result = [];
	const groups = _.groupBy(_.sortBy(items, ['dayNo', 'daySeq']), item => {
		return item.dayNo;
	});
	let day = 0;
	const days = _.keys(groups);
	_.each(days, d => {
		day++;
		let seq = 0;
		// console.log(`Re-org Day ${d}`, groups[d]);
		_.each(groups[d], i => {
			if (!i.linkedItems) {
				seq++;
				result.push({ ...i, dayNo: day, daySeq: seq });
			} else {
				const subgroups = _.groupBy(
					_.sortBy(i.linkedItems, ['dayNo', 'daySeq']),
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
						result.push({ ...si, dayNo: day, daySeq: seq });
					});
				});
			}
		});
	});
	// console.log('>>>>After reorg', result);
	return result;
};

/** * Get List of PackageItem */
exports.getAllPackageItem = handler => {
	const PackageItem = keystone.list('PackageItem').model;
	return PackageItem.find()
		.populate('attraction')
		.exec(handler);
};

/** * Get PackageItem by Params */
exports.getPackageItemByParams = (params, handler) => {
	const PackageItem = keystone.list('PackageItem').model;
	return PackageItem.find(params)
		.populate('attraction')
		.exec(handler);
};

/** * Get PackageItem by ID */
exports.getPackageItemById = (id, handler) => {
	const PackageItem = keystone.list('PackageItem').model;
	return PackageItem.findById(id)
		.populate('attraction')
		.exec(handler);
};

/** * Get PackageItem by Package */
exports.getPackageItemByPackage = (id, handler) => {
	const PackageItem = keystone.list('PackageItem').model;
	const callback = (err, resp) => {
		if (err) return handler(err, []);
		const itemHandlers = _.map(resp, item => {
			const itemHandler = itemCallback => {
				// console.log('>>>>Package item with attraction]', item);
				if (!item.linkedPackage) {
					return itemCallback(err, Parser.parsePackageItem(item));
				} else {
					// console.log('>>>>Package item with linked package', item);
					const linkHandler = (err, items) => {
						// console.log('>>>>Linked package items', items);
						const nItem = {
							...Parser.parsePackageItem(item),
							linkedItems: Parser.parsePackageItem(items),
						};
						itemCallback(err, nItem);
					};
					PackageItem.find({ package: item.linkedPackage })
						.populate('attraction')
						.exec(linkHandler);
				}
			};
			return itemHandler;
		});
		async.parallel(itemHandlers, (err, results) => {
			if (err) return handler(err, []);
			console.log('>>>>itemHandlers results', results);
			return handler(err, reorg(results));
		});
	};
	return PackageItem.find({ package: id })
		.populate('attraction')
		.exec(callback);
};

exports.publishPackageItem = (docs, handler) => {
	console.log('>>>>Model.publishPackageItem', docs);
	const PackageItem = keystone.list('PackageItem').model;
	PackageItem.create(docs, handler);
};
