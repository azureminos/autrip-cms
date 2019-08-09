var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * City Model
 * ==========
 */
var City = new keystone.List('City', {
	map: { name: 'name' },
	singular: 'City',
	plural: 'City',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

City.add({
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	country: { type: Types.Relationship, ref: 'Country' },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	attractions: { type: Types.Relationship, ref: 'Attraction', many: true },
	hotels: { type: Types.Relationship, ref: 'Hotel', many: true },
	carRates: { type: Types.Relationship, ref: 'CarRate', many: true },
	additionalField: { type: Types.Textarea },
});

City.schema.methods.cleanupCountry = function (callback) {
	var city = this;
	// Remove city from country.cities
	keystone
		.list('Country')
		.model.findOne({ cities: city._id })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (
				!city.country
				|| (city.country && item._id.toString() != city.country.toString())
			) {
				item.cities = _.remove(item.cities, function (o) {
					return o.toString() != city._id.toString();
				});
				// console.log('>>>>Updated country.cities', item);
				keystone
					.list('Country')
					.model.findByIdAndUpdate(item._id, { cities: item.cities }, callback);
			} else {
				return callback();
			}
		});
};

City.schema.methods.updateCountry = function (callback) {
	var city = this;
	// Update city from country.cities
	if (city.country) {
		// Find the new selected country, then add this city to country.cities
		// console.log('>>>>Found country to add city', city.country);
		keystone
			.list('Country')
			.model.findById(city.country.toString())
			.exec(function (err, item) {
				if (err || !item) return callback();
				// console.log('>>>>country retrieved', item);
				var isFound = _.find(item.cities, function (o) {
					return o.toString() == city._id.toString();
				});
				if (!isFound) {
					item.cities.push(city._id);
					// console.log('>>>>Updated item.cities', item);
					keystone
						.list('Country')
						.model.findByIdAndUpdate(
							item._id,
							{ cities: item.cities },
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

City.schema.methods.cleanupAttractions = function (callback) {
	var city = this;
	keystone
		.list('Attraction')
		.model.find({ city: city._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					// console.log(`>>>>City.cleanupAttractions, Checking attraction[${item.name}] against [${city.name}, ${city._id}]`, city.attractions);
					var isFound = _.find(city.attractions, function (o) {
						return o.toString() == item.toString();
					});
					if (!city.attractions || !isFound) {
						// console.log(`>>>>City.cleanupAttractions, Removing [${city.name}] from attraction[${item.name}].city`, item.city);
						keystone
							.list('Attraction')
							.model.findByIdAndUpdate(item._id, { city: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

City.schema.methods.updateAttractions = function (callback) {
	var city = this;
	var promises = [];
	// Get all attractions
	// console.log(`>>>>City.updateAttractions, Looping through city[${city.name}].attractions`, city.attractions);
	_.forEach(city.attractions, function (id) {
		// Loop through and check if current attraction.city is hte same as city
		promises.push(function (callback) {
			keystone
				.list('Attraction')
				.model.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update attraction.city
					// console.log(`>>>>City.updateAttractions, Checking if attraction[${item.name}].city is [${city.name}, ${city._id.toString()}]`, item.city);
					if (!item.city || city._id.toString() != item.city.toString()) {
						item.city = city._id;
						// console.log(`>>>>City.updateAttractions, Set [${city.name}, ${city._id.toString()}] as attrraction[${item.name}].city`, item.city);
						keystone
							.list('Attraction')
							.model.findByIdAndUpdate(item._id, { city: item.city }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

City.schema.methods.cleanupHotels = function (callback) {
	var city = this;
	keystone
		.list('Hotel')
		.model.find({ city: city._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					// console.log(`>>>>City.cleanupHotels, Checking hotel[${item.name}] against [${city.name}, ${city._id}]`, city.hotels);
					var isFound = _.find(city.hotels, function (o) {
						return o.toString() == item.toString();
					});
					if (!city.hotels || !isFound) {
						// console.log(`>>>>City.cleanupHotels, Removing [${city.name}] from hotel[${item.name}].city`, item.city);
						keystone
							.list('Hotel')
							.model.findByIdAndUpdate(item._id, { city: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

City.schema.methods.updateHotels = function (callback) {
	var city = this;
	var promises = [];
	// Get all hotels
	// console.log(`>>>>City.updateHotels, Looping through city[${city.name}].hotels`, city.hotels);
	_.forEach(city.hotels, function (id) {
		// Loop through and check if current hotel.city is hte same as city
		promises.push(function (callback) {
			keystone
				.list('Hotel')
				.model.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update hotel.city
					// console.log(`>>>>City.updateHotels, Checking if hotel[${item.name}].city is [${city.name}, ${city._id.toString()}]`, item.city);
					if (!item.city || city._id.toString() != item.city.toString()) {
						item.city = city._id;
						// console.log(`>>>>City.updateHotels, Set [${city.name}, ${city._id.toString()}] as hotel[${item.name}].city`, item.city);
						keystone
							.list('Hotel')
							.model.findByIdAndUpdate(item._id, { city: item.city }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

City.schema.methods.cleanupCarRates = function (callback) {
	var city = this;
	keystone
		.list('CarRate')
		.model.find({ city: city._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					var isFound = _.find(city.carRates, function (o) {
						return o.toString() === item.toString();
					});
					if (!city.carRates || !isFound) {
						keystone
							.list('CarRate')
							.model.findByIdAndUpdate(item._id, { city: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

City.schema.methods.updateCarRates = function (callback) {
	var city = this;
	var promises = [];
	// Get all carRates
	_.forEach(city.carRates, function (id) {
		// Loop through and check if current carRates.city is the same as city
		promises.push(function (callback) {
			keystone
				.list('CarRate')
				.model.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update carRates.city
					if (!item.city || city._id.toString() != item.city.toString()) {
						item.city = city._id;
						keystone
							.list('CarRate')
							.model.findByIdAndUpdate(item._id, { city: item.city }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

City.defaultColumns = 'name, country';

City.schema.set('usePushEach', true);

City.schema.pre('save', function (next) {
	console.log('>>>>Before City Save', this);
	var city = this;
	async.series(
		[
			function (callback) {
				if (city.isModified('country')) {
					console.log('>>>>city.country changed, calling city.cleanupCountry');
					city.cleanupCountry(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('country')) {
					console.log('>>>>city.country changed, calling city.updateCountry');
					city.updateCountry(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('carRates')) {
					console.log(
						'>>>>city.carRates changed, calling city.cleanupCarRates'
					);
					city.cleanupCarRates(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('carRates')) {
					console.log('>>>>city.carRates changed, calling city.updateCarRates');
					city.updateCarRates(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('attractions')) {
					console.log(
						'>>>>city.attractions changed, calling city.cleanupAttractions'
					);
					city.cleanupAttractions(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('attractions')) {
					console.log(
						'>>>>city.attractions changed, calling city.updateAttractions'
					);
					city.updateAttractions(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('hotels')) {
					console.log('>>>>city.hotels changed, calling city.cleanupHotels');
					city.cleanupHotels(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (city.isModified('hotels')) {
					console.log('>>>>city.hotels changed, calling city.updateHotels');
					city.updateHotels(callback);
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
City.register();
