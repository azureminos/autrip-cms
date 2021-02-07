var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * RefTagGroup Model
 * ==========
 */
var RefTagGroup = new keystone.List('RefTagGroup', {
	map: { name: 'name' },
	singular: 'RefTagGroup',
	plural: 'RefTagGroup',
	track: true,
});

RefTagGroup.add({
	name: { type: Types.Text, required: true, index: true },
	tags: { type: Types.TextArray },
	selectable: { type: Types.Boolean, default: false },
	imgUrl: { type: Types.Text },
});
RefTagGroup.defaultColumns = 'name';

RefTagGroup.schema.set('usePushEach', true);

RefTagGroup.schema.pre('save', function (next) {
	console.log('>>>>Before RefTagGroup Save', this);
	next();
});

/**
 * Registration
 */
RefTagGroup.register();
