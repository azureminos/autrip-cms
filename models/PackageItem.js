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

/**
 * Registration
 */
PackageItem.register();
