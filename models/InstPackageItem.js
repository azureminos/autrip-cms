var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Instance Package Item Model
 * ==========
 */
var InstPackageItem = new keystone.List('InstPackageItem', {
	map: { name: 'name' },
	singular: 'InstPackageItem',
	plural: 'InstPackageItem',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

InstPackageItem.add({
	instPackage: { type: Types.Relationship, ref: 'InstPackage' },
	dayNo: { type: Types.Number },
	daySeq: { type: Types.Number },
	timePlannable: { type: Types.Number, default: 0 },
	attraction: { type: Types.Relationship, ref: 'Attraction' },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

InstPackageItem.defaultColumns = 'dayNo, daySeq, timePlannable, attraction';

/**
 * Registration
 */
InstPackageItem.register();
