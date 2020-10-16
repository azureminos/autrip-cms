var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */
var RefProduct = new keystone.List('RefProduct', {
	map: { name: 'name' },
	singular: 'RefProduct',
	plural: 'RefProduct',
	track: true,
});

RefProduct.add({
	source: {
		type: Types.Select,
		options: 'VIATOR, EXPOZ, ATDW, MANUAL',
		default: 'MANUAL',
	},
	productCode: { type: Types.Text, required: true, index: true, default: '' },
	name: { type: Types.Text, required: true, default: '' },
	shortTitle: { type: Types.Text, required: true, default: '' },
	primaryDestinationName: { type: Types.Text },
	primaryDestinationId: { type: Types.Number, default: -1 },
	primaryGroupId: { type: Types.Number, default: -1 },
	shortDescription: { type: Types.Text },
	duration: { type: Types.Text },
	webURL: { type: Types.Text },
	thumbnailHiResURL: { type: Types.Text },
	thumbnailURL: { type: Types.Text },
	rating: { type: Types.Number, default: 0 },
	reviewCount: { type: Types.Number, default: 0 },
	photoCount: { type: Types.Number, default: 0 },
	supplierName: { type: Types.Text },
	supplierCode: { type: Types.Text },
	available: { type: Types.Boolean, default: false },
	price: { type: Types.Number, default: 0 },
	currencyCode: { type: Types.Text, default: 'AUD' },
	onSale: { type: Types.Boolean, default: false },
	specialOfferAvailable: { type: Types.Boolean, default: false },
	bookingEngineId: { type: Types.Text },
	specialReservationDetails: { type: Types.Text },
	merchantCancellable: { type: Types.Boolean, default: false },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefProduct.defaultColumns = 'name, productCode, primaryDestinationName';

RefProduct.schema.set('usePushEach', true);

RefProduct.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_Product Save', this);
	next();
});

/**
 * Registration
 */
RefProduct.register();
