var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('lodash');
/**
 * Country Model
 * ==========
 */
var Country = new keystone.List('Country', {
  map: { name: 'name' },
  singular: 'Country',
  plural: 'Country',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

Country.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  region: { type: Types.Select, options: 'Africa, Arab States, Asia & Pacific, Europe, North America, South/Latin America', index: true },
  tag: { type: Types.TextArray },
  alias: { type: Types.TextArray },
  additionalField: { type: Types.Textarea },
});

Country.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'description', 'region', 'additionalField');
	}
});

Country.defaultColumns = 'name, region';

/**
 * Registration
 */
Country.register();
