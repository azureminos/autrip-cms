var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Country Model
 * ==========
 */
var Country = new keystone.List('Country', {
  map: { name: 'name' },
  singular: 'Country',
  plural: 'Country',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

Country.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  region: { type: Types.Select, options: 'Africa, Arab States, Asia & Pacific, Europe, North America, South/Latin America', index: true },
  cities: { type: Types.Relationship, ref: 'City', many: true },
  packages: { type: Types.Relationship, ref: 'TravelPackage', many: true },
  tag: { type: Types.TextArray },
  alias: { type: Types.TextArray },
  additionalField: { type: Types.Textarea },
});

/*Country.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'description', 'region', 'additionalField');
	}
});*/

Country.schema.methods.cleanupCities = function (callback) {
  var country = this;
  keystone.list('City').model
    .find({ country: country._id })
    .exec(function (err, items) {
      if (err || !items) return callback();
      var promises = [];
      _.each(items, function (item) {
        promises.push(function (callback) {
          console.log(`>>>>Country.cleanupCities, Checking city[${item.name}] against [${country.name}, ${country._id}]`, country.cities);
          var isFound = _.find(country.cities, function(o) {
            return o.toString() == item.toString(); }
          );
          if (!country.cities || !isFound) {
            console.log(`>>>>Country.cleanupCities, Removing [${country.name}] from city[${item.name}].country`, item.country);
            keystone.list('City').model
              .findByIdAndUpdate(item._id, { country: undefined }, callback);
          } else {
            return callback();
          }
        });
      });
      async.series(promises, callback);
    });
}

Country.schema.methods.updateCities = function (callback) {
  var country = this;
  var promises = [];
  // Get all cities
  console.log(`>>>>Country.updateCities, Looping through country[${country.name}].cities`, country.cities);
  _.forEach(country.cities, function (id) {
    // Loop through and check if current city.country is the same as country
    promises.push(function (callback) {
      keystone.list('City').model
        .findById(id)
        .exec(function (err, item) {
          if (err || !item) return callback();
          // If yes, bypass; if no, update city.country
          console.log(`>>>>Country.updateCities, Checking if city[${item.name}].country is [${country.name}, ${country._id.toString()}]`, item.country);
          if(!item.country || country._id.toString() != item.country.toString()) {
            item.country = country._id;
            console.log(`>>>>Country.updateCities, Set [${country.name}, ${country._id.toString()}] as city[${item.name}].country`, item.country);
            keystone.list('City').model
              .findByIdAndUpdate(item._id, { country: item.country }, callback);
          } else {
            return callback();
          }
        });
    });
  });
  async.series(promises, callback);
}

Country.schema.methods.cleanupPackages = function (callback) {
  var country = this;
  keystone.list('TravelPackage').model
    .find({ country: country._id })
    .exec(function (err, items) {
      if (err || !items) return callback();
      var promises = [];
      _.each(items, function (item) {
        promises.push(function (callback) {
          console.log(`>>>>Country.cleanupPackages, Checking package[${item.name}] against [${country.name}, ${country._id}]`, country.packages);
          var isFound = _.find(country.packages, function (o) {
            return o.toString() == item.toString(); }
          );
          if (!country.packages || !isFound) {
            console.log(`>>>>Country.cleanupPackages, Removing [${country.name}] from package[${item.name}].country`, item.country);
            keystone.list('TravelPackage').model
              .findByIdAndUpdate(item._id, { country: undefined }, callback);
          } else {
            return callback();
          }
        });
      });
      async.series(promises, callback);
    });
}

Country.schema.methods.updatePackages = function (callback) {
  var country = this;
  var promises = [];
  // Get all packages
  console.log(`>>>>Country.updatePackages, Looping through country[${country.name}].packages`, country.packages);
  _.forEach(country.packages, function (id) {
    // Loop through and check if current package.country is the same as country
    promises.push(function (callback) {
      keystone.list('TravelPackage').model
        .findById(id)
        .exec(function (err, item) {
          if (err || !item) return callback();
          // If yes, bypass; if no, update package.country
          console.log(`>>>>Country.updatePackages, Checking if package[${item.name}].country is [${country.name}, ${country._id.toString()}]`, item.country);
          if(!item.country || country._id.toString() != item.country.toString()) {
            item.country = country._id;
            console.log(`>>>>Country.updatePackages, Set [${country.name}, ${country._id.toString()}] as package[${item.name}].country`, item.country);
            keystone.list('TravelPackage').model
              .findByIdAndUpdate(item._id, { country: item.country }, callback);
          } else {
            return callback();
          }
        });
    });
  });
  async.series(promises, callback);
}

Country.defaultColumns = 'name, region, cities';

Country.schema.set('usePushEach', true);

Country.schema.pre('save', function (next) {
  console.log('>>>>Before Country Save', this);
  var country = this;
	async.series([
		function (callback) {
      if(country.isModified('cities')) {
        console.log('>>>>country.cities changed, calling country.cleanupCities');
        country.cleanupCities(callback);
      } else {
        return callback();
      }
		},
		function (callback) {
      if (country.isModified('cities')) {
        console.log('>>>>country.cities changed, calling country.updateCities');
        country.updateCities(callback);
      } else {
        return callback();
      }
    },
		function (callback) {
      if (country.isModified('packages')) {
        console.log('>>>>country.packages changed, calling country.cleanupPackages');
        country.cleanupPackages(callback);
      } else {
        return callback();
      }
    },
		function (callback) {
      if (country.isModified('packages')) {
        console.log('>>>>country.packages changed, calling country.updatePackages');
        country.updatePackages(callback);
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
Country.register();
