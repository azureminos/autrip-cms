var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * TravelPackage Model
 * ==========
 */
var TravelPackage = new keystone.List('TravelPackage', {
	map: { name: 'name' },
	singular: 'TravelPackage',
	plural: 'TravelPackage',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

TravelPackage.add({
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	finePrint: { type: Types.Textarea },
	country: { type: Types.Relationship, ref: 'Country' },
	totalDays: { type: Types.Number, default: 0 },
	maxParticipant: { type: Types.Number, default: 0 },
	departureDate: { type: Types.Textarea },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', noedit: true },
	publishedAt: { type: Types.Date, noedit: true },
	isPromoted: { type: Types.Boolean, default: false },
	isCustomisable: { type: Types.Boolean, default: false },
	isExtention: { type: Types.Boolean, default: false },
	image: { type: Types.CloudinaryImage, folder: 'Packages', select: true, selectPrefix: 'Packages' },
	effectiveFrom: { type: Types.Date, default: Date.now },
	effectiveTo: { type: Types.Date, default: Date.now },
	flightRates: { type: Types.Relationship, ref: 'FlightRate', many: true },
	carRates: { type: Types.Relationship, ref: 'CarRate', many: true },
	packageRates: { type: Types.Relationship, ref: 'PackageRate', many: true },
	packageItems: { type: Types.Relationship, ref: 'PackageItem', many: true },
	packageHotels: { type: Types.Relationship, ref: 'PackageHotel', many: true },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

TravelPackage.defaultColumns = 'name, totalDays|15%, maxParticipant|15%, isPromoted|15%, isExtention|15%';

TravelPackage.schema.methods.isPublished = function () {
	return this.state == 'published';
}

TravelPackage.schema.methods.cleanupCountry = function (callback) {
	var pkg = this;
	// Remove package from country.packages
	keystone.list('Country').model
		.findOne({ packages: pkg._id })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (!pkg.country || (pkg.country && item._id.toString() != pkg.country.toString())) {
				item.packages = _.remove(item.packages, function (o) {
					return o.toString() != pkg._id.toString();
				});
				// console.log('>>>>Updated country.packages', item);
				keystone.list('Country').model
					.findByIdAndUpdate(item._id, { packages: item.packages }, callback);
			} else {
				return callback();
			}
		});
};

TravelPackage.schema.methods.updateCountry = function (callback) {
	var pkg = this;
	// Update package from country.packages
	if (pkg.country) {
		// Find the new selected country, then add this package to country.package
		//console.log('>>>>Found country to add package', pkg.country);
		keystone.list('Country').model
			.findById(pkg.country.toString())
			.exec(function (err, item) {
				if (err || !item) return callback();
				//console.log('>>>>country retrieved', item);
				var isFound = _.find(item.packages, function (o) {
					return o.toString() == pkg._id.toString();
				}
				);
				if (!isFound) {
					item.packages.push(pkg._id);
					//console.log('>>>>Updated item.packages', item);
					keystone.list('Country').model
						.findByIdAndUpdate(item._id, { packages: item.packages }, callback);
				} else {
					return callback();
				}
			});
	} else {
		return callback();
	}
};

// Handle CarRate
TravelPackage.schema.methods.cleanupCarRates = function (callback) {
	var pkg = this;
	keystone.list('CarRate').model
		.find({ pkg: pkg._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					//console.log(`>>>>TravelPackage.cleanupCarRates, Checking carRate[${item.name}] against [${pkg.name}, ${pkg._id}]`, pkg.carRates);
					var isFound = _.find(pkg.carRates, function (o) {
						return o.toString() == item.toString();
					}
					);
					if (!pkg.carRates || !isFound) {
						//console.log(`>>>>TravelPackage.cleanupCarRates, Removing [${pkg.name}] from CarRate[${item.name}].package`, item.package);
						keystone.list('CarRate').model
							.findByIdAndUpdate(item._id, { package: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

TravelPackage.schema.methods.updateCarRates = function (callback) {
	var pkg = this;
	var promises = [];
	// Get all CarRate
	//console.log(`>>>>TravelPackage.updateCarRates, Looping through package[${pkg.name}].carRates`, pkg.carRates);
	_.forEach(pkg.carRates, function (id) {
		// Loop through and check if current carRate.package is the same as package
		promises.push(function (callback) {
			keystone.list('CarRate').model
				.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update carRate.package
					//console.log(`>>>>TravelPackage.updateCarRates, Checking if carRate[${item.name}].package is [${pkg.name}, ${pkg._id.toString()}]`, item.package);
					if (!item.package || pkg._id.toString() != item.package.toString()) {
						item.package = pkg._id;
						//console.log(`>>>>TravelPackage.updateCarRates, Set [${pkg.name}, ${pkg._id.toString()}] as carRate[${item.name}].package`, item.package);
						keystone.list('CarRate').model
							.findByIdAndUpdate(item._id, { package: item.package }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

// Handle FlightRate
TravelPackage.schema.methods.cleanupFlightRates = function (callback) {
	var pkg = this;
	keystone.list('FlightRate').model
		.find({ pkg: pkg._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					//console.log(`>>>>TravelPackage.cleanupFlightRates, Checking flightRate[${item.name}] against [${pkg.name}, ${pkg._id}]`, pkg.flightRates);
					var isFound = _.find(pkg.flightRates, function (o) {
						return o.toString() == item.toString();
					}
					);
					if (!pkg.flightRates || !isFound) {
						//console.log(`>>>>TravelPackage.cleanupFlightRates, Removing [${pkg.name}] from FlightRate[${item.name}].package`, item.package);
						keystone.list('FlightRate').model
							.findByIdAndUpdate(item._id, { package: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

TravelPackage.schema.methods.updateFlightRates = function (callback) {
	var pkg = this;
	var promises = [];
	// Get all FlightRate
	//console.log(`>>>>TravelPackage.updateFlightRates, Looping through package[${pkg.name}].flightRates`, pkg.flightRates);
	_.forEach(pkg.flightRates, function (id) {
		// Loop through and check if current flightRate.package is the same as package
		promises.push(function (callback) {
			keystone.list('FlightRate').model
				.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update flightRate.package
					//console.log(`>>>>TravelPackage.updateFlightRates, Checking if flightRate[${item.name}].package is [${pkg.name}, ${pkg._id.toString()}]`, item.package);
					if (!item.package || pkg._id.toString() != item.package.toString()) {
						item.package = pkg._id;
						//console.log(`>>>>TravelPackage.updateFlightRates, Set [${pkg.name}, ${pkg._id.toString()}] as flightRate[${item.name}].package`, item.package);
						keystone.list('FlightRate').model
							.findByIdAndUpdate(item._id, { package: item.package }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

// Handle PackageRate
TravelPackage.schema.methods.cleanupPackageRates = function (callback) {
	var pkg = this;
	keystone.list('PackageRate').model
		.find({ pkg: pkg._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					//console.log(`>>>>TravelPackage.cleanupPackageRates, Checking packageRate[${item.name}] against [${pkg.name}, ${pkg._id}]`, pkg.packageRates);
					var isFound = _.find(pkg.packageRates, function (o) {
						return o.toString() == item.toString();
					}
					);
					if (!pkg.packageRates || !isFound) {
						//console.log(`>>>>TravelPackage.cleanupPackageRates, Removing [${pkg.name}] from PackageRate[${item.name}].package`, item.package);
						keystone.list('PackageRate').model
							.findByIdAndUpdate(item._id, { package: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

TravelPackage.schema.methods.updatePackageRates = function (callback) {
	var pkg = this;
	var promises = [];
	// Get all packageRate
	//console.log(`>>>>TravelPackage.updatePackageRates, Looping through package[${pkg.name}].packageRates`, pkg.packageRates);
	_.forEach(pkg.packageRates, function (id) {
		// Loop through and check if current packageRate.package is the same as package
		promises.push(function (callback) {
			keystone.list('PackageRate').model
				.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update packageRate.package
					//console.log(`>>>>TravelPackage.updatePackageRates, Checking if packageRate[${item.name}].package is [${pkg.name}, ${pkg._id.toString()}]`, item.package);
					if (!item.package || pkg._id.toString() != item.package.toString()) {
						item.package = pkg._id;
						//console.log(`>>>>TravelPackage.updatePackageRates, Set [${pkg.name}, ${pkg._id.toString()}] as packageRate[${item.name}].package`, item.package);
						keystone.list('PackageRate').model
							.findByIdAndUpdate(item._id, { package: item.package }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

// Handle PackageItem
TravelPackage.schema.methods.cleanupPackageItems = function (callback) {
	var pkg = this;
	keystone.list('PackageItem').model
		.find({ pkg: pkg._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					//console.log(`>>>>TravelPackage.cleanupPackageItems, Checking packageItem[${item.name}] against [${pkg.name}, ${pkg._id}]`, pkg.packageItems);
					var isFound = _.find(pkg.packageItems, function (o) {
						return o.toString() == item.toString();
					}
					);
					if (!pkg.packageItems || !isFound) {
						//console.log(`>>>>TravelPackage.cleanupPackageItems, Removing [${pkg.name}] from PackageItem[${item.name}].package`, item.package);
						keystone.list('PackageItem').model
							.findByIdAndUpdate(item._id, { package: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

TravelPackage.schema.methods.updatePackageItems = function (callback) {
	var pkg = this;
	var promises = [];
	// Get all PackageItem
	//console.log(`>>>>TravelPackage.updatePackageItems, Looping through package[${pkg.name}].packageItems`, pkg.packageItems);
	_.forEach(pkg.packageItems, function (id) {
		// Loop through and check if current packageItem.package is the same as package
		promises.push(function (callback) {
			keystone.list('PackageItem').model
				.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update packageItem.package
					//console.log(`>>>>TravelPackage.updatePackageItems, Checking if packageItem[${item.name}].package is [${pkg.name}, ${pkg._id.toString()}]`, item.package);
					if (!item.package || pkg._id.toString() != item.package.toString()) {
						item.package = pkg._id;
						//console.log(`>>>>TravelPackage.updatePackageItems, Set [${pkg.name}, ${pkg._id.toString()}] as packageItem[${item.name}].package`, item.package);
						keystone.list('PackageItem').model
							.findByIdAndUpdate(item._id, { package: item.package }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

// Handel PackageHotel
TravelPackage.schema.methods.cleanupPackageHotels = function (callback) {
	var pkg = this;
	keystone.list('PackageHotel').model
		.find({ pkg: pkg._id })
		.exec(function (err, items) {
			if (err || !items) return callback();
			var promises = [];
			_.each(items, function (item) {
				promises.push(function (callback) {
					//console.log(`>>>>TravelPackage.cleanupPackageHotels, Checking packageHotel[${item.name}] against [${pkg.name}, ${pkg._id}]`, pkg.packageHotels);
					var isFound = _.find(pkg.packageHotels, function (o) {
						return o.toString() == item.toString();
					}
					);
					if (!pkg.packageHotels || !isFound) {
						//console.log(`>>>>TravelPackage.cleanupPackageHotels, Removing [${pkg.name}] from packageHotel[${item.name}].package`, item.package);
						keystone.list('PackageHotel').model
							.findByIdAndUpdate(item._id, { package: undefined }, callback);
					} else {
						return callback();
					}
				});
			});
			async.series(promises, callback);
		});
};

TravelPackage.schema.methods.updatePackageHotels = function (callback) {
	var pkg = this;
	var promises = [];
	// Get all PackageHotel
	//console.log(`>>>>TravelPackage.updatePackageHotels, Looping through package[${pkg.name}].packageHotels`, pkg.packageHotels);
	_.forEach(pkg.packageHotels, function (id) {
		// Loop through and check if current packageHotel.package is the same as package
		promises.push(function (callback) {
			keystone.list('PackageHotel').model
				.findById(id)
				.exec(function (err, item) {
					if (err || !item) return callback();
					// If yes, bypass; if no, update packageHotel.package
					//console.log(`>>>>TravelPackage.updatePackageHotels, Checking if packageHotel[${item.name}].package is [${pkg.name}, ${pkg._id.toString()}]`, item.package);
					if (!item.package || pkg._id.toString() != item.package.toString()) {
						item.package = pkg._id;
						//console.log(`>>>>TravelPackage.updatePackageHotels, Set [${pkg.name}, ${pkg._id.toString()}] as packageHotel[${item.name}].package`, item.package);
						keystone.list('PackageHotel').model
							.findByIdAndUpdate(item._id, { package: item.package }, callback);
					} else {
						return callback();
					}
				});
		});
	});
	async.series(promises, callback);
};

TravelPackage.schema.pre('save', function (next) {
	console.log('>>>>Before Save PackageItem', this.name);
	// Update Date[publishedAt]
	if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
		this.publishedAt = new Date();
	}
	// Handle relationship changes
	var travelPackage = this;
	async.series([
		function (callback) {
			if (travelPackage.isModified('country')) {
				console.log('>>>>travelPackage.country changed, calling travelPackage.cleanupCountry');
				travelPackage.cleanupCountry(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('country')) {
				console.log('>>>>travelPackage.country changed, calling travelPackage.updateCountry');
				travelPackage.updateCountry(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('carRates')) {
				console.log('>>>>travelPackage.carRates changed, calling travelPackage.cleanupCarRates');
				travelPackage.cleanupCarRates(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('carRates')) {
				console.log('>>>>travelPackage.carRates changed, calling travelPackage.updateCarRates');
				travelPackage.updateCarRates(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('flightRates')) {
				console.log('>>>>travelPackage.flightRates changed, calling travelPackage.cleanupFlightRates');
				travelPackage.cleanupFlightRates(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('flightRates')) {
				console.log('>>>>travelPackage.flightRates changed, calling travelPackage.updateFlightRates');
				travelPackage.updateFlightRates(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('packageRates')) {
				console.log('>>>>travelPackage.packageRates changed, calling travelPackage.cleanupPackageRates');
				travelPackage.cleanupPackageRates(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('packageRates')) {
				console.log('>>>>travelPackage.packageRates changed, calling travelPackage.updatePackageRates');
				travelPackage.updatePackageRates(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('packageItems')) {
				console.log('>>>>travelPackage.packageItems changed, calling travelPackage.cleanupPackageItems');
				travelPackage.cleanupPackageItems(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('packageItems')) {
				console.log('>>>>travelPackage.packageItems changed, calling travelPackage.updatePackageItems');
				travelPackage.updatePackageItems(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('packageHotels')) {
				console.log('>>>>travelPackage.packageHotels changed, calling travelPackage.cleanupPackageHotels');
				travelPackage.cleanupPackageHotels(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (travelPackage.isModified('packageHotels')) {
				console.log('>>>>travelPackage.packageHotels changed, calling travelPackage.updatePackageHotels');
				travelPackage.updatePackageHotels(callback);
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
TravelPackage.register();
