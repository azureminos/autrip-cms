var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Instance Package Item Model
 * ==========
 */
var InstPackageHotel = new keystone.List('InstPackageHotel', {
	map: { name: 'name' },
	singular: 'InstPackageHotel',
	plural: 'InstPackageHotel',
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
});

InstPackageHotel.add({
	instPackage: { type: Types.Relationship, ref: 'InstPackage' },
	dayNo: { type: Types.Number },
	isOvernight: { type: Types.Boolean },
	hotel: { type: Types.Relationship, ref: 'Hotel' },
	room: { type: Types.Relationship, ref: 'HotelRoom' },
	notes: { type: Types.Textarea },
	additionalField: { type: Types.Textarea },
});

InstPackageHotel.defaultColumns = 'dayNo, isOvernight, hotel, room';

/**
 * Registration
 */
InstPackageHotel.register();
