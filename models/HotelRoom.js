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
  effectiveFrom: { type: Types.Datetime, default: Date.now },
  effectiveTo: { type: Types.Datetime, default: Date.now },
  priority: { type: Types.Number, default: 0 },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

//HotelRoom.relationship({ path: 'hotel', ref: 'Hotel', refPath: 'rooms' });

HotelRoom.defaultColumns = 'name, hotel';

/**
 * Registration
 */
HotelRoom.register();
