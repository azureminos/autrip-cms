var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;
var CONSTANT = require('../lib/constants');
var { carOption } = CONSTANT.get().TravelPackage;
/**
 * CarRate Model
 * ==========
 */
var CarRate = new keystone.List('CarRate', {
	map: { name: 'name' },
	singular: 'CarRate',
	plural: 'CarRate',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

CarRate.add({
	city: { type: Types.Relationship, ref: 'City' },
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	type: {
		type: Types.Select,
		options: `${carOption.REGULAR}, ${carOption.PREMIUM}, ${carOption.LUXURY}`,
		default: carOption.REGULAR,
		index: true,
	},
	minParticipant: { type: Types.Number, default: 0 },
	maxParticipant: { type: Types.Number, default: 0 },
	rangeFrom: { type: Types.Date, default: Date.now },
	rangeTo: { type: Types.Date, default: Date.now },
	cost: { type: Types.Number, default: 0 },
	rate: { type: Types.Number, default: 0 },
	costLocalGuide: { type: Types.Number, default: 0 },
	rateLocalGuide: { type: Types.Number, default: 0 },
	costAirport: { type: Types.Number, default: 0 },
	rateAirport: { type: Types.Number, default: 0 },
	costExtra: { type: Types.Number, default: 0 },
	rateExtra: { type: Types.Number, default: 0 },
	priority: { type: Types.Number, default: 0 },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

CarRate.defaultColumns = 'name|50%, type, minParticipant, maxParticipant, rate';

CarRate.schema.methods.cleanupCity = function (callback) {
	var hotel = this;
	// Remove hotel from city.hotels
	keystone
		.list('City')
		.model.findOne({ hotels: hotel._id })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (
				!hotel.city
				|| (hotel.city && item._id.toString() != hotel.city.toString())
			) {
				item.hotels = _.remove(item.hotels, function (o) {
					return o.toString() != hotel._id.toString();
				});
				// console.log('>>>>Updated item.hotels', item);
				keystone
					.list('City')
					.model.findByIdAndUpdate(item._id, { hotels: item.hotels }, callback);
			} else {
				return callback();
			}
		});
};

CarRate.schema.methods.updateCity = function (callback) {
	var carRate = this;
	// Update hotel from city.hotels
	if (carRate.city) {
		// Find the new selected city, then add this hotel to city.hotels
		keystone
			.list('City')
			.model.findById(carRate.city.toString())
			.exec(function (err, item) {
				if (err || !item) return callback();
				var isFound = _.find(item.carRates, function (o) {
					return o.toString() == carRate._id.toString();
				});
				if (!isFound) {
					item.carRates.push(carRate._id);
					keystone
						.list('City')
						.model.findByIdAndUpdate(
							item._id,
							{ carRates: item.carRates },
							callback
						);
				} else {
					return callback();
				}
			});
	} else {
		return callback();
	}
};

CarRate.schema.set('usePushEach', true);

CarRate.schema.pre('save', function (next) {
	console.log('>>>>Before Save Hotel', this.name);
	var carRate = this;
	async.series(
		[
			function (callback) {
				if (carRate.isModified('city')) {
					carRate.cleanupCity(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (carRate.isModified('city')) {
					carRate.updateCity(callback);
				} else {
					return callback();
				}
			},
		],
		function (err) {
			next();
		}
	);
});

/**
 * Registration
 */
CarRate.register();
