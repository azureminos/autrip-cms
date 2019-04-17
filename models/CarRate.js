var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;
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
  package: { type: Types.Relationship, ref: 'TravelPackage' },
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  type: { type: Types.Select, options: 'Regular, Premium, Luxury', index: true },
  minParticipant: { type: Types.Number, default: 0 },
  maxParticipant: { type: Types.Number, default: 0 },
  rangeFrom: { type: Types.Date, default: Date.now },
  rangeTo: { type: Types.Date, default: Date.now },
  cost: { type: Types.Number, default: 0 },
  rate: { type: Types.Number, default: 0 },
  priority: { type: Types.Number, default: 0 },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

CarRate.defaultColumns = 'name, package|30%, type|10%, minParticipant|10%, maxParticipant|10%, rate|10%';

CarRate.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
    var rs = _.pick(doc, 'name', 'description', 'type', 'package', 'priority', 'rate', 'cost', 'rangeFrom', 
      'rangeTo', 'minParticipant', 'maxParticipant');
    rs.id = doc._id;
		return rs;
	}
});

CarRate.schema.methods.cleanupPackage = function (callback) {
  var carRate = this;
  // Remove carRate from package.carRates
  keystone.list('TravelPackage').model
    .findOne({ carRates: carRate._id })
    .exec(function (err, item) {
      if (err || !item) return callback();
      if (!carRate.package || (carRate.package && item._id.toString() != carRate.package.toString())) {
        item.carRates = _.remove(item.carRates, function (o) {
          return o.toString() != carRate._id.toString();
        });
        //console.log('>>>>Updated item.carRates', item);
        keystone.list('TravelPackage').model
          .findByIdAndUpdate(item._id, { carRates: item.carRates }, callback);
      } else {
        return callback();
      }
    });
}

CarRate.schema.methods.updatePackage = function (callback) {
  var carRate = this;
  // Update carRate from package.carRates
  if (carRate.package) {
    // Find the new selected paclage, then add this carRate to package.carRates
    //console.log('>>>>Found carRate to add package', this.package);
    keystone.list('TravelPackage').model
      .findById(carRate.package.toString())
      .exec(function (err, item) {
        if (err || !item) return callback();
        //console.log('>>>>package retrieved', item);
        var isFound = _.find(item.carRates, function (o) {
          return o.toString() == carRate._id.toString(); }
        );
        if (!isFound) {
          item.carRates.push(carRate._id);
          //console.log('>>>>Updated item.carRates', item);
          keystone.list('TravelPackage').model
            .findByIdAndUpdate(item._id, { carRates: item.carRates }, callback);
        } else {
          return callback();
        }
      });
  } else {
    return callback();
  }
}

CarRate.schema.set('usePushEach', true);

CarRate.schema.pre('save', function (next) {
  console.log('>>>>Before Save CarRate', this.name);
  var carRate = this;
	async.series([
		function (callback) {
      if(carRate.isModified('package')) {
        console.log('>>>>carRate.package changed, calling carRate.cleanupPackage');
        carRate.cleanupPackage(callback);
      } else {
        return callback();
      }
		},
		function (callback) {
      if (carRate.isModified('package')) {
        console.log('>>>>carRate.package changed, calling carRate.updatePackage');
        carRate.updatePackage(callback);
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
CarRate.register();
