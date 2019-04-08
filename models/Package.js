var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Package Model
 * ==========
 */
var Package = new keystone.List('Package', {
  map: { name: 'name' },
  singular: 'Package',
  plural: 'Package',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

Package.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  finePrint: { type: Types.Textarea },
  totalDays: { type: Types.Number, default: 0 },
  maxParticipant: { type: Types.Number, default: 0 },
  is_promoted: { type: Types.Boolean, default: false },
  is_extention: { type: Types.Boolean, default: false },
  image: { type: Types.CloudinaryImage, folder: 'Packages', select: true, selectPrefix: 'Packages' },
  effectiveFrom: { type: Types.Datetime, default: Date.now },
  effectiveTo: { type: Types.Datetime, default: Date.now },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

Package.relationship({ path: 'flightRate', ref: 'FlightRate', refPath: 'package' });
Package.relationship({ path: 'carRate', ref: 'carRate', refPath: 'package' });
Package.relationship({ path: 'packageRate', ref: 'packageRate', refPath: 'package' });

Package.defaultColumns = 'name, totalDays|15%, maxParticipant|15%, is_promoted|15%, is_extention|15%';

/**
 * Registration
 */
Package.register();
