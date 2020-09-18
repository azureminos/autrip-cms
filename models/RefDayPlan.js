var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * DayPlan Model
 * ==========
 */
var RefDayPlan = new keystone.List('RefDayPlan', {
	map: { name: 'name' },
	singular: 'RefDayPlan',
	plural: 'RefDayPlan',
	track: true,
});

RefDayPlan.add({
	name: { type: Types.Text, required: true, index: true },
	destId: { type: Types.Number, default: -1 },
	products: { type: Types.TextArray },
	tag: { type: Types.TextArray },
	alias: { type: Types.TextArray },
	additionalField: { type: Types.Textarea },
});
RefDayPlan.defaultColumns = 'name';

RefDayPlan.schema.set('usePushEach', true);

RefDayPlan.schema.pre('save', function (next) {
	console.log('>>>>Before Ref_DayPlan Save', this);
	next();
});

/**
 * Registration
 */
RefDayPlan.register();
