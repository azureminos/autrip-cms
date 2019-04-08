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

/**
 * Registration
 */
CarRate.register();
