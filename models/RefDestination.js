var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Destination Model
 * ==========
 */
var RefDestination = new keystone.List('RefDestination', {
	map: { name: 'name' },
	singular: 'RefDestination',
	plural: 'RefDestination',
	track: true,
});

RefDestination.add({
	name: { type: Types.Text, required: true, index: true },
	selectable: { type: Types.Boolean, default: false },
	defaultCurrencyCode: { type: Types.Text, required: true, default: 'AUD' },
	parentId: { type: Types.Number, default: -1 },
	timeZone: { type: Types.Text },
	type: {
		type: Types.Select,
		options: 'COUNTRY, REGION, CITY',
		default: 'CITY',
	},
	destinationId: { type: Types.Number, default: -1 },
	latitude: { type: Types.Text },
	longitude: { type: Types.Text },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefDestination.defaultColumns = 'name, type';

RefDestination.schema.set('usePushEach', true);

RefDestination.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_Destination Save', this);
	next();
});

/**
 * Registration
 */
RefDestination.register();
