var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Attraction Model
 * ==========
 */
var Attraction = new keystone.List('Attraction', {
	map: { name: 'name' },
	singular: 'Attraction',
	plural: 'Attraction',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

Attraction.add({
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	city: { type: Types.Relationship, ref: 'City' },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	image: {
		type: Types.CloudinaryImage,
		folder: 'Attractions',
		select: true,
		selectPrefix: 'Attractions',
	},
	cost: { type: Types.Number, default: 0 },
	rate: { type: Types.Number, default: 0 },
	timeTraffic: { type: Types.Number, default: 0 },
	timeVisit: { type: Types.Number, default: 0 },
	nearByAttractions: {
		type: Types.Relationship,
		ref: 'Attraction',
		many: true,
	},
	parentAttraction: { type: Types.Relationship, ref: 'Attraction' },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

Attraction.defaultColumns = 'name, city';

Attraction.schema.methods.cleanupCity = function (callback) {
	var attraction = this;
	var attractionId = this._id;
	// Remove attraction from city.attrations
	keystone
		.list('City')
		.model.findOne({ attractions: attractionId })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (
				!attraction.city
				|| (attraction.city && item._id.toString() != attraction.city.toString())
			) {
				item.attractions = _.remove(item.attractions, function (o) {
					return o.toString() != attractionId.toString();
				});
				// console.log('>>>>Updated item.attractions', item);
				keystone
					.list('City')
					.model.findByIdAndUpdate(
						item._id,
						{ attractions: item.attractions },
						callback
					);
			} else {
				return callback();
			}
		});
};

Attraction.schema.methods.updateCity = function (callback) {
	var attractionId = this._id;
	// Update attraction from city.attrations
	if (this.city) {
		var cityId = this.city.toString();
		// Find the new selected city, then add this attraction to city.attractions
		// console.log('>>>>Found city to add attraction', this.city);
		keystone
			.list('City')
			.model.findById(cityId)
			.exec(function (err, item) {
				if (err || !item) return callback();
				// console.log('>>>>City retrieved', item);
				var isFound = _.find(item.attractions, function (o) {
					return o.toString() == attractionId.toString();
				});
				if (!isFound) {
					item.attractions.push(attractionId);
					// console.log('>>>>Updated item.attractions', item);
					keystone
						.list('City')
						.model.findByIdAndUpdate(
							item._id,
							{ attractions: item.attractions },
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

Attraction.schema.methods.cleanupNearby = function (callback) {
	var site = this;
	var siteId = site._id;
	keystone
		.list('Attraction')
		.model.find({ nearByAttractions: siteId })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					// console.log(`>>>>Attraction.cleanupNearby, Checking site[${item.name}] against [${site.name}, ${siteId}]`, site.nearByAttractions);
					var isFound = _.find(site.nearByAttractions, function (o) {
						return o.toString() == item.toString();
					});
					if (!site.nearByAttractions || !isFound) {
						// console.log(`>>>>Attraction.cleanupNearby, Removing [${site.name}] from site[${item.name}].nearByAttractions`, item.nearByAttractions);
						item.nearByAttractions = _.remove(item.nearByAttractions, function (
							o
						) {
							return o.toString() != siteId.toString();
						});
						// console.log(`>>>>Attraction.cleanupNearby, New site[${item.name}].nearByAttractions`, item.nearByAttractions);
						keystone
							.list('Attraction')
							.model.findByIdAndUpdate(
								item._id,
								{ nearByAttractions: item.nearByAttractions },
								callback
							);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

Attraction.schema.methods.updateNearby = function (callback) {
	var site = this;
	var siteId = site._id;
	var promises = [];
	// Get all nearby attractions
	// console.log(`>>>>Attraction.updateNearby, Looping through site[${site.name}].nearByAttractions`, site.nearByAttractions);
	_.forEach(site.nearByAttractions, function (id) {
		// Loop through and check if current attraction is in their nearby
		promises.push(function (callback) {
			keystone
				.list('Attraction')
				.model.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, add to their nearby
					// console.log(`>>>>Attraction.updateNearby, Checking if site[${item.name}].nearByAttractions has [${site.name}, ${siteId.toString()}]`, item.nearByAttractions);
					var isFound = _.find(item.nearByAttractions, function (o) {
						return o.toString() == siteId.toString();
					});
					if (!isFound) {
						item.nearByAttractions.push(siteId);
						// console.log(`>>>>Attraction.updateNearby, Add [${site.name}, ${siteId.toString()}] into site[${item.name}].nearByAttractions`, item.nearByAttractions);
						keystone
							.list('Attraction')
							.model.findByIdAndUpdate(
								item._id,
								{ nearByAttractions: item.nearByAttractions },
								callback
							);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

Attraction.schema.set('usePushEach', true);

Attraction.schema.pre('save', function (next) {
	console.log('>>>>Before Save Attraction', this.name);
	var attraction = this;
	async.series(
		[
			function (callback) {
				if (attraction.isModified('city')) {
					console.log(
						'>>>>attraction.city changed, calling attraction.cleanupCity'
					);
					attraction.cleanupCity(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (attraction.isModified('city')) {
					console.log(
						'>>>>attraction.city changed, calling attraction.updateCity'
					);
					attraction.updateCity(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (attraction.isModified('nearByAttractions')) {
					console.log(
						'>>>>attraction.nearByAttractions changed, calling attraction.cleanupNearby'
					);
					attraction.cleanupNearby(callback);
				} else {
					return callback();
				}
			},
			function (callback) {
				if (attraction.isModified('nearByAttractions')) {
					console.log(
						'>>>>attraction.nearByAttractions changed, calling attraction.updateNearby'
					);
					attraction.updateNearby(callback);
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
Attraction.register();
