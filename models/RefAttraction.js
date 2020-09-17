var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Attraction Model
 * ==========
 */
var RefAttraction = new keystone.List('RefAttraction', {
	map: { name: 'name' },
	singular: 'RefAttraction',
	plural: 'RefAttraction',
	track: true,
});

RefAttraction.add({
	source: { type: Types.Select, options: 'VIATOR, MANUAL', default: 'MANUAL' },
	name: { type: Types.Text, required: true, default: '' },
	seoId: { type: Types.Number, default: -1 },
	webURL: { type: Types.Text },
	primaryDestinationName: { type: Types.Text },
	primaryDestinationId: { type: Types.Number, default: -1 },
	primaryGroupId: { type: Types.Number, default: -1 },
	thumbnailHiResURL: { type: Types.Text },
	thumbnailURL: { type: Types.Text },
	rating: { type: Types.Number, default: 0 },
	photoCount: { type: Types.Number, default: 0 },
	latitude: { type: Types.Text },
	longitude: { type: Types.Text },
	attractionStreetAddress: { type: Types.Text },
	attractionCity: { type: Types.Text },
	attractionState: { type: Types.Text },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefAttraction.defaultColumns = 'name, seoId, primaryDestinationName';

RefAttraction.schema.set('usePushEach', true);

RefAttraction.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_Attraction Save', this);
	next();
});

/**
 * Registration
 */
RefAttraction.register();
