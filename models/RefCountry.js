var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Country Model
 * ==========
 */
var RefCountry = new keystone.List('RefCountry', {
	map: { name: 'name' },
	singular: 'RefCountry',
	plural: 'RefCountry',
	track: true,
});

RefCountry.add({
	name: { type: Types.Text, required: true, index: true },
	region: {
		type: Types.Select,
		options:
			'Africa, Arab States, Asia & Pacific, Europe, North America, South/Latin America',
	},
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefCountry.defaultColumns = 'name';

RefCountry.schema.set('usePushEach', true);

RefCountry.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_Country Save', this);
	next();
});

/**
 * Registration
 */
RefCountry.register();
