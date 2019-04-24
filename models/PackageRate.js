var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PackageRate Model
 * ==========
 */
var PackageRate = new keystone.List('PackageRate', {
	map: { name: 'name' },
	singular: 'PackageRate',
	plural: 'PackageRate',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

PackageRate.add({
	package: { type: Types.Relationship, ref: 'TravelPackage' },
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	premiumFee: { type: Types.Number, default: 0 },
	minParticipant: { type: Types.Number, default: 0 },
	maxParticipant: { type: Types.Number, default: 0 },
	cost: { type: Types.Number, default: 0 },
	rate: { type: Types.Number, default: 0 },
	//rangeFrom and rangeTo applies to departure date only
	rangeFrom: { type: Types.Date, default: Date.now },
	rangeTo: { type: Types.Date, default: Date.now },
	priority: { type: Types.Number, default: 0 },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

PackageRate.defaultColumns = 'name, package|30%, minParticipant|10%, maxParticipant|10%, rate|10%';

PackageRate.schema.methods.cleanupPackage = function (callback) {
	var packageRate = this;
	// Remove packageRate from package.packageRates
	keystone.list('TravelPackage').model
		.findOne({ packageRates: packageRate._id })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (!packageRate.package || (packageRate.package && item._id.toString() != packageRate.package.toString())) {
				item.packageRates = _.remove(item.packageRates, function (o) {
					return o.toString() != packageRate._id.toString();
				});
				//console.log('>>>>Updated item.packageRates', item);
				keystone.list('TravelPackage').model
					.findByIdAndUpdate(item._id, { packageRates: item.packageRates }, callback);
			} else {
				return callback();
			}
		});
};

PackageRate.schema.methods.updatePackage = function (callback) {
	var packageRate = this;
	// Update packageRate from package.packageRates
	if (packageRate.package) {
		// Find the new selected paclage, then add this packageRate to package.packageRates
		//console.log('>>>>Found packageRate to add package', this.package);
		keystone.list('TravelPackage').model
			.findById(packageRate.package.toString())
			.exec(function (err, item) {
				if (err || !item) return callback();
				//console.log('>>>>package retrieved', item);
				var isFound = _.find(item.packageRates, function (o) {
					return o.toString() == packageRate._id.toString();
				}
				);
				if (!isFound) {
					item.packageRates.push(packageRate._id);
					//console.log('>>>>Updated item.packageRates', item);
					keystone.list('TravelPackage').model
						.findByIdAndUpdate(item._id, { packageRates: item.packageRates }, callback);
				} else {
					return callback();
				}
			});
	} else {
		return callback();
	}
};

PackageRate.schema.set('usePushEach', true);

PackageRate.schema.pre('save', function (next) {
	console.log('>>>>Before Save PackageRate', this.name);
	var packageRate = this;
	async.series([
		function (callback) {
			if (packageRate.isModified('package')) {
				console.log('>>>>packageRate.package changed, calling packageRate.cleanupPackage');
				packageRate.cleanupPackage(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (packageRate.isModified('package')) {
				console.log('>>>>packageRate.package changed, calling packageRate.updatePackage');
				packageRate.updatePackage(callback);
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
PackageRate.register();
