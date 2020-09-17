var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Category Model
 * ==========
 */
var RefCategory = new keystone.List('RefCategory', {
	map: { name: 'name' },
	singular: 'RefCategory',
	plural: 'RefCategory',
	track: true,
});

RefCategory.add({
	name: { type: Types.Text, required: true, index: true },
	itemId: { type: Types.Number, default: -1 },
	thumbnailURL: { type: Types.Text, default: '' },
	thumbnailHiResURL: { type: Types.Text, default: '' },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefCategory.defaultColumns = 'name';

RefCategory.schema.set('usePushEach', true);

RefCategory.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_Category Save', this);
	next();
});

/**
 * Registration
 */
RefCategory.register();
