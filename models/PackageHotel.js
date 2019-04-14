var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PackageHotel Model
 * ==========
 */
var PackageHotel = new keystone.List('PackageHotel', {
  map: { name: 'name' },
  singular: 'PackageHotel',
  plural: 'PackageHotel',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

PackageHotel.add({
  package: { type: Types.Relationship, ref: 'TravelPackage' },
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  dayNo: { type: Types.Number, default: 0 },
  isOvernight: { type: Types.Boolean, default: true },
  hotel: { type: Types.Relationship, ref: 'Hotel' },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

PackageHotel.defaultColumns = 'name, package, dayNo, hotel';

PackageHotel.schema.methods.cleanupPackage = function (callback) {
  var packageHotel = this;
  // Remove packageHotel from package.packageHotels
  keystone.list('TravelPackage').model
    .findOne({ packageHotels: packageHotel._id })
    .exec(function (err, item) {
      if (err || !item) return callback();
      if (!packageHotel.package || (packageHotel.package && item._id.toString() != packageHotel.package.toString())) {
        item.packageHotels = _.remove(item.packageHotels, function (o) {
          return o.toString() != packageHotel._id.toString();
        });
        //console.log('>>>>Updated item.packageHotels', item);
        keystone.list('TravelPackage').model
          .findByIdAndUpdate(item._id, { packageHotels: item.packageHotels }, callback);
      } else {
        return callback();
      }
    });
}

PackageHotel.schema.methods.updatePackage = function (callback) {
  var packageHotel = this;
  // Update packageHotel from package.packageHotels
  if (packageHotel.package) {
    // Find the new selected package, then add this packageHotel to package.packageHotels
    //console.log('>>>>Found packageHotel to add package', this.package);
    keystone.list('TravelPackage').model
      .findById(packageHotel.package.toString())
      .exec(function (err, item) {
        if (err || !item) return callback();
        //console.log('>>>>package retrieved', item);
        var isFound = _.find(item.packageHotels, function (o) {
          return o.toString() == packageHotel._id.toString(); }
        );
        if (!isFound) {
          item.packageHotels.push(packageHotel._id);
          //console.log('>>>>Updated item.packageHotels', item);
          keystone.list('TravelPackage').model
            .findByIdAndUpdate(item._id, { packageHotels: item.packageHotels }, callback);
        } else {
          return callback();
        }
      });
  } else {
    return callback();
  }
}

PackageHotel.schema.set('usePushEach', true);

PackageHotel.schema.pre('save', function (next) {
  console.log('>>>>Before Save PackageHotel', this.name);
  var packageHotel = this;
	async.series([
		function (callback) {
      if(packageHotel.isModified('package')) {
        console.log('>>>>packageHotel.package changed, calling packageHotel.cleanupPackage');
        packageHotel.cleanupPackage(callback);
      } else {
        return callback();
      }
		},
		function (callback) {
      if (packageHotel.isModified('package')) {
        console.log('>>>>packageHotel.package changed, calling packageHotel.updatePackage');
        packageHotel.updatePackage(callback);
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
PackageHotel.register();
