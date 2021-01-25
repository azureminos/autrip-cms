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
	lookupId: { type: Types.Text },
	timeZone: { type: Types.Text },
	type: {
		type: Types.Select,
		options: 'COUNTRY, REGION, CITY, TOWN',
		default: 'TOWN',
	},
	destinationId: { type: Types.Number, default: -1 },
	location: { type: Types.Text },
	addrCarpark: { type: Types.Text },
	imageUrl: { type: Types.Text },
	description: { type: Types.Text },
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
