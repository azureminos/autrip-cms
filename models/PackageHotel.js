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

/**
 * Registration
 */
PackageHotel.register();
