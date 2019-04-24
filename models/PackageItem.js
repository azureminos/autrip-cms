var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PackageItem Model
 * ==========
 */
var PackageItem = new keystone.List('PackageItem', {
	map: { name: 'name' },
	singular: 'PackageItem',
	plural: 'PackageItem',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

PackageItem.add({
	package: { type: Types.Relationship, ref: 'TravelPackage' },
	name: { type: Types.Text, required: true, index: true },
	description: { type: Types.Textarea },
	dayNo: { type: Types.Number, default: 0 },
	daySeq: { type: Types.Number, default: 0 },
	isPlannable: { type: Types.Boolean, default: true },
	attraction: { type: Types.Relationship, ref: 'Attraction' },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

PackageItem.defaultColumns = 'name, package, dayNo, daySeq, attraction';

PackageItem.schema.methods.cleanupPackage = function (callback) {
	var packageItem = this;
	// Remove packageItem from package.packageItems
	keystone.list('TravelPackage').model
		.findOne({ packageItems: packageItem._id })
		.exec(function (err, item) {
			if (err || !item) return callback();
			if (!packageItem.package || (packageItem.package && item._id.toString() != packageItem.package.toString())) {
				item.packageItems = _.remove(item.packageItems, function (o) {
					return o.toString() != packageItem._id.toString();
				});
				//console.log('>>>>Updated item.packageItems', item);
				keystone.list('TravelPackage').model
					.findByIdAndUpdate(item._id, { packageItems: item.packageItems }, callback);
			} else {
				return callback();
			}
		});
};

PackageItem.schema.methods.updatePackage = function (callback) {
	var packageItem = this;
	// Update packageItem from package.packageItems
	if (packageItem.package) {
		// Find the new selected package, then add this packageItem to package.packageItems
		//console.log('>>>>Found packageItem to add package', this.package);
		keystone.list('TravelPackage').model
			.findById(packageItem.package.toString())
			.exec(function (err, item) {
				if (err || !item) return callback();
				//console.log('>>>>package retrieved', item);
				var isFound = _.find(item.packageItems, function (o) {
					return o.toString() == packageItem._id.toString();
				}
				);
				if (!isFound) {
					item.packageItems.push(packageItem._id);
					//console.log('>>>>Updated item.packageItems', item);
					keystone.list('TravelPackage').model
						.findByIdAndUpdate(item._id, { packageItems: item.packageItems }, callback);
				} else {
					return callback();
				}
			});
	} else {
		return callback();
	}
};

PackageItem.schema.set('usePushEach', true);

PackageItem.schema.pre('save', function (next) {
	console.log('>>>>Before Save PackageItem', this.name);
	var packageItem = this;
	async.series([
		function (callback) {
			if (packageItem.isModified('package')) {
				console.log('>>>>packageItem.package changed, calling packageItem.cleanupPackage');
				packageItem.cleanupPackage(callback);
			} else {
				return callback();
			}
		},
		function (callback) {
			if (packageItem.isModified('package')) {
				console.log('>>>>packageItem.package changed, calling packageItem.updatePackage');
				packageItem.updatePackage(callback);
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
PackageItem.register();
