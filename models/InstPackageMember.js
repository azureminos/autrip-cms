var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Instance Package Item Model
 * ==========
 */
var InstPackageMember = new keystone.List('InstPackageMember', {
	map: { name: 'name' },
	singular: 'InstPackageMember',
	plural: 'InstPackageMember',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

InstPackageMember.add({
	instPackage: { type: Types.Relationship, ref: 'InstPackage' },
	loginId: { type: Types.Number },
	isOwner: { type: Types.Boolean },
	kids: { type: Types.Number, default: 0 },
	adults: { type: Types.Number, default: 0 },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

InstPackageMember.defaultColumns = 'loginId, isOwner, kids, adults';

/**
 * Registration
 */
InstPackageMember.register();
