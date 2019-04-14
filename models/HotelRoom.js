var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * HotelRoom Model
 * ==========
 */
var HotelRoom = new keystone.List('HotelRoom', {
  map: { name: 'name' },
  singular: 'HotelRoom',
  plural: 'HotelRoom',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

HotelRoom.add({
  name: { type: Types.Text, required: true, index: true },
  hotel: { type: Types.Relationship, ref: 'Hotel' },
  costOffPeak: { type: Types.Number, default: 0 },
  rateOffPeak: { type: Types.Number, default: 0 },
  costPeak: { type: Types.Number, default: 0 },
  ratePeak: { type: Types.Number, default: 0 },
  isDefault: { type: Types.Boolean, default: false },
  isAddBedAllowed: { type: Types.Boolean, default: false },
  rangeFrom: { type: Types.Date, default: Date.now },
  rangeTo: { type: Types.Date, default: Date.now },
  priority: { type: Types.Number, default: 0 },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

HotelRoom.defaultColumns = 'name, hotel';

HotelRoom.schema.methods.cleanupHotel = function (callback) {
  var room = this;
  // Remove room from hotel.room
  keystone.list('Hotel').model
    .findOne({ rooms: room._id })
    .exec(function (err, item) {
      if (err || !item) return callback();
      if (!room.hotel || (room.hotel && item._id.toString() != room.hotel.toString())) {
        item.rooms = _.remove(item.rooms, function (o) {
          return o.toString() != room._id.toString();
        });
        //console.log('>>>>Updated item.hotels', item);
        keystone.list('Hotel').model
          .findByIdAndUpdate(item._id, { rooms: item.rooms }, callback);
      } else {
        return callback();
      }
    });
}

HotelRoom.schema.methods.updateHotel = function (callback) {
  var room = this;
  // Update room from hotel.rooms
  if (room.hotel) {
    // Find the new selected hotel, then add this room to hotel.rooms
    //console.log('>>>>Found room to add hotel', this.hotel);
    keystone.list('Hotel').model
      .findById(room.hotel.toString())
      .exec(function (err, item) {
        if (err || !item) return callback();
        //console.log('>>>>hotel retrieved', item);
        var isFound = _.find(item.rooms, function (o) {
          return o.toString() == room._id.toString(); }
        );
        if (!isFound) {
          item.rooms.push(room._id);
          //console.log('>>>>Updated item.rooms', item);
          keystone.list('Hotel').model
            .findByIdAndUpdate(item._id, { rooms: item.rooms }, callback);
        } else {
          return callback();
        }
      });
  } else {
    return callback();
  }
}

HotelRoom.schema.set('usePushEach', true);

HotelRoom.schema.pre('save', function (next) {
  console.log('>>>>Before Save Hotel', this.name);
  var room = this;
	async.series([
		function (callback) {
      if(room.isModified('hotel')) {
        console.log('>>>>room.hotel changed, calling room.cleanupHotel');
        room.cleanupHotel(callback);
      } else {
        return callback();
      }
		},
		function (callback) {
      if (room.isModified('hotel')) {
        console.log('>>>>room.hotel changed, calling room.updateHotel');
        room.updateHotel(callback);
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
HotelRoom.register();
