var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Instance Package Model
 * ==========
 */
var InstPackage = new keystone.List('InstPackage', {
	map: { name: 'name' },
	singular: 'InstPackage',
	plural: 'InstPackage',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

InstPackage.add({
	package: { type: Types.Relationship, ref: 'TravelPackage' },
	startDate: { type: Types.Date },
	endDate: { type: Types.Date },
	isCustomised: { type: Types.Boolean },
	totalKids: { type: Types.Number, default: 0 },
	totalAdults: { type: Types.Number, default: 0 },
	rate: { type: Types.Number, default: 0 },
	cost: { type: Types.Number, default: 0 },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

InstPackage.defaultColumns
	= 'package, rate, startDate, endDate, totalKids, totalAdults';

/**
 * Registration
 */
InstPackage.register();
