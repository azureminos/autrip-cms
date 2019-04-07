var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * City Model
 * ==========
 */
var City = new keystone.List('City', {
  map: { name: 'name' },
  singular: 'City',
  plural: 'City',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

City.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  country: { type: Types.Relationship, ref: 'Country' },
  tag: { type: Types.TextArray },
  alias: { type: Types.TextArray },
  additionalField: { type: Types.Textarea },
});

City.defaultColumns = 'name, country';

/**
 * Registration
 */
City.register();
