var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Hotel Model
 * ==========
 */
var Hotel = new keystone.List('Hotel', {
  map: { name: 'name' },
  singular: 'Hotel',
  plural: 'Hotel',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

Hotel.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  city: { type: Types.Relationship, ref: 'City' },
  stars: { type: Types.Number, default: 0 },
  type: { type: Types.Text },
  image: { type: Types.CloudinaryImage, folder: 'Hotels', select: true, selectPrefix: 'Hotels' },
  timeTraffic: { type: Types.Number, default: 0 },
  rooms: { type: Types.Relationship, ref: 'HotelRoom', many: true },
  nearByAttractions: { type: Types.Relationship, ref: 'Attraction', many: true },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

Hotel.defaultColumns = 'name, city, type';

Hotel.schema.methods.cleanupCity = function (callback) {
  var hotel = this;
  // Remove hotel from city.hotels
  keystone.list('City').model
    .findOne({ hotels: hotel._id })
    .exec(function (err, item) {
      if (err || !item) return callback();
      if (!hotel.city || (hotel.city && item._id.toString() != hotel.city.toString())) {
        item.hotels = _.remove(item.hotels, function (o) {
          return o.toString() != hotel._id.toString();
        });
        //console.log('>>>>Updated item.hotels', item);
        keystone.list('City').model
          .findByIdAndUpdate(item._id, { hotels: item.hotels }, callback);
      } else {
        return callback();
      }
    });
}

Hotel.schema.methods.updateCity = function (callback) {
  var hotel = this;
  // Update hotel from city.hotels
  if (hotel.city) {
    // Find the new selected city, then add this hotel to city.hotels
    //console.log('>>>>Found city to add hotel', this.city);
    keystone.list('City').model
      .findById(hotel.city.toString())
      .exec(function (err, item) {
        if (err || !item) return callback();
        //console.log('>>>>City retrieved', item);
        var isFound = _.find(item.hotels, function (o) {
          return o.toString() == hotel._id.toString(); }
        );
        if (!isFound) {
          item.hotels.push(hotel._id);
          //console.log('>>>>Updated item.hotels', item);
          keystone.list('City').model
            .findByIdAndUpdate(item._id, { hotels: item.hotels }, callback);
        } else {
          return callback();
        }
      });
  } else {
    return callback();
  }
}

Hotel.schema.methods.cleanupRooms = function (callback) {
  var hotel = this;
  keystone.list('HotelRoom').model
    .find({ hotel: hotel._id })
    .exec(function (err, items) {
      if (err || !items) return callback();
      var promises = [];
      _.each(items, function (item) {
        promises.push(function (callback) {
          console.log(`>>>>Hotel.cleanupRooms, Checking room[${item.name}] against [${hotel.name}, ${hotel._id}]`, hotel.rooms);
          var isFound = _.find(hotel.rooms, function(o) {
            return o.toString() == item.toString(); }
          );
          if (!hotel.rooms || !isFound) {
            console.log(`>>>>Hotel.cleanupRooms, Removing [${hotel.name}] from room[${item.name}].hotel`, item.hotel);
            keystone.list('HotelRoom').model
              .findByIdAndUpdate(item._id, { hotel: undefined }, callback);
          } else {
            return callback();
          }
        });
      });
      async.series(promises, callback);
    });
}

Hotel.schema.methods.updateRooms = function (callback) {
  var hotel = this;
  var promises = [];
  // Get all rooms
  console.log(`>>>>Hotel.updateRooms, Looping through hotel[${hotel.name}].rooms`, hotel.rooms);
  _.forEach(hotel.rooms, function (id) {
    // Loop through and check if current room.hotel is the same as hotel
    promises.push(function (callback) {
      keystone.list('HotelRoom').model
        .findById(id)
        .exec(function (err, item) {
          if (err || !item) return callback();
          // If yes, bypass; if no, update room.hotel
          console.log(`>>>>Hotel.updateRooms, Checking if room[${item.name}].hotel is [${hotel.name}, ${hotel._id.toString()}]`, item.hotel);
          if(!item.country || country._id.toString() != item.country.toString()) {
            item.hotel = hotel._id;
            console.log(`>>>>Hotel.updateRooms, Set [${hotel.name}, ${hotel._id.toString()}] as room[${item.name}].hotel`, item.hotel);
            keystone.list('HotelRoom').model
              .findByIdAndUpdate(item._id, { hotel: item.hotel }, callback);
          } else {
            return callback();
          }
        });
    });
  });
  async.series(promises, callback);
}

Hotel.schema.set('usePushEach', true);

Hotel.schema.pre('save', function (next) {
  console.log('>>>>Before Save Hotel', this.name);
  var hotel = this;
	async.series([
		function (callback) {
      if(hotel.isModified('city')) {
        console.log('>>>>hotel.city changed, calling hotel.cleanupCity');
        hotel.cleanupCity(callback);
      } else {
        return callback();
      }
		},
		function (callback) {
      if (hotel.isModified('city')) {
        console.log('>>>>hotel.city changed, calling hotel.updateCity');
        hotel.updateCity(callback);
      } else {
        return callback();
      }
    },
		function (callback) {
      if(hotel.isModified('rooms')) {
        console.log('>>>>hotel.rooms changed, calling hotel.cleanupRooms');
        hotel.cleanupRooms(callback);
      } else {
        return callback();
      }
		},
		function (callback) {
      if (hotel.isModified('rooms')) {
        console.log('>>>>hotel.rooms changed, calling hotel.updateRooms');
        hotel.updateRooms(callback);
      } else {
        return callback();
      }
    },
	], function (err) {
    next();
	});
});

// Todo: Add method for getting default room

/**
 * Registration
 */
Hotel.register();
