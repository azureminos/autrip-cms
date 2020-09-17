var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SubCategory Model
 * ==========
 */
var RefSubCategory = new keystone.List('RefSubCategory', {
	map: { name: 'name' },
	singular: 'RefSubCategory',
	plural: 'RefSubCategory',
	track: true,
});

RefSubCategory.add({
	name: { type: Types.Text, required: true, index: true },
	itemId: { type: Types.Number, default: -1 },
	parentId: { type: Types.Number, default: -1 },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefSubCategory.defaultColumns = 'name';

RefSubCategory.schema.set('usePushEach', true);

RefSubCategory.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_SubCategory Save', this);
	next();
});

/**
 * Registration
 */
RefSubCategory.register();
