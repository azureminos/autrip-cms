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
  nearByAttractions: { type: Types.Relationship, ref: 'Attraction', many: true },
  //rooms: { type: Types.Relationship, ref: 'HotelRoom', many: true },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

Hotel.defaultColumns = 'name, city, type';

Hotel.relationship({ path: 'rooms', ref: 'HotelRoom', refPath: 'hotel' });

// Todo: Add method for getting default room

/**
 * Registration
 */
Hotel.register();
