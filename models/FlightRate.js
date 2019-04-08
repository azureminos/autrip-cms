var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * FlightRate Model
 * ==========
 */
var FlightRate = new keystone.List('FlightRate', {
  map: { name: 'name' },
  singular: 'FlightRate',
  plural: 'FlightRate',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

FlightRate.add({
  package: { type: Types.Relationship, ref: 'TravelPackage' },
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  airline: { type: Types.Text },
  type: { type: Types.Select, options: 'Economic, Economic Premium, Business', index: true },
  rangeFrom: { type: Types.Date, default: Date.now },
  rangeTo: { type: Types.Date, default: Date.now },
  cost: { type: Types.Number, default: 0 },
  rate: { type: Types.Number, default: 0 },
  priority: { type: Types.Number, default: 0 },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

FlightRate.defaultColumns = 'name, airline|15%, type|15%, rangeFrom|15%, rangeTo|15%, rate|15%';

/**
 * Registration
 */
FlightRate.register();
