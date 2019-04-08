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
  package: { type: Types.Relationship, ref: 'Package' },
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  type: { type: Types.Textarea },
  minParticipant: { type: Types.Number, default: 0 },
  maxParticipant: { type: Types.Number, default: 0 },
  rangeFrom: { type: Types.Datetime, default: Date.now },
  rangeTo: { type: Types.Datetime, default: Date.now },
  cost: { type: Types.Number, default: 0 },
  rate: { type: Types.Number, default: 0 },
  priority: { type: Types.Number, default: 0 },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

CarRate.defaultColumns = 'name, type|10%, minParticipant|10%, maxParticipant|10%, '
  + 'rangeFrom|10%, rangeTo|10%, priority, rate|10%';

/**
 * Registration
 */
CarRate.register();
