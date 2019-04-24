var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FlightRate Model
 * ==========
 */
var FlightRate = new keystone.List('FlightRate', {
	map: { name: 'name' },
	singular: 'FlightRate',
	plural: 'FlightRate',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

FlightRate.add({
	package: { type: Types.Relationship, ref: 'TravelPackage' },
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	airline: { type: Types.Text },
	type: { type: Types.Select, options: 'Economic, Economic Premium, Business', index: true },
	rangeFrom: { type: Types.Date, default: Date.now },
	rangeTo: { type: Types.Date, default: Date.now },
	cost: { type: Types.Number, default: 0 },
	rate: { type: Types.Number, default: 0 },
	priority: { type: Types.Number, default: 0 },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

FlightRate.defaultColumns = 'name, airline|15%, type|15%, rangeFrom|15%, rangeTo|15%, rate|15%';

FlightRate.schema.methods.cleanupPackage = function (callback) {
	var flightRate = this;
	// Remove flightRate from package.flightRates
	keystone.list('TravelPackage').model
		.findOne({ flightRates: flightRate._id })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (!flightRate.package || (flightRate.package && item._id.toString() != flightRate.package.toString())) {
				item.flightRates = _.remove(item.flightRates, function (o) {
					return o.toString() != flightRate._id.toString();
				});
				//console.log('>>>>Updated item.flightRates', item);
				keystone.list('TravelPackage').model
					.findByIdAndUpdate(item._id, { flightRates: item.flightRates }, callback);
			} else {
				return callback();
			}
		});
};

FlightRate.schema.methods.updatePackage = function (callback) {
	var flightRate = this;
	// Update flightRate from package.flightRates
	if (flightRate.package) {
		// Find the new selected paclage, then add this flightRate to package.flightRates
		//console.log('>>>>Found flightRate to add package', this.package);
		keystone.list('TravelPackage').model
			.findById(flightRate.package.toString())
			.exec(function (err, item) {
				if (err || !item) return callback();
				//console.log('>>>>package retrieved', item);
				var isFound = _.find(item.flightRates, function (o) {
					return o.toString() == flightRate._id.toString();
				}
				);
				if (!isFound) {
					item.flightRates.push(flightRate._id);
					//console.log('>>>>Updated item.flightRates', item);
					keystone.list('TravelPackage').model
						.findByIdAndUpdate(item._id, { flightRates: item.flightRates }, callback);
				} else {
					return callback();
				}
			});
	} else {
		return callback();
	}
};

FlightRate.schema.set('usePushEach', true);

FlightRate.schema.pre('save', function (next) {
	console.log('>>>>Before Save FlightRate', this.name);
	var flightRate = this;
	async.series([
		function (callback) {
			if (flightRate.isModified('package')) {
				console.log('>>>>flightRate.package changed, calling flightRate.cleanupPackage');
				flightRate.cleanupPackage(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (flightRate.isModified('package')) {
				console.log('>>>>flightRate.package changed, calling flightRate.updatePackage');
				flightRate.updatePackage(callback);
			} else {
				return callback();
			}
		},
	], function (err) {
		next();
	});
});

/**
 * Registration
 */
FlightRate.register();
