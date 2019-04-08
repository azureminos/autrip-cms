var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PackageRate Model
 * ==========
 */
var PackageRate = new keystone.List('PackageRate', {
  map: { name: 'name' },
  singular: 'PackageRate',
  plural: 'PackageRate',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

PackageRate.add({
  package: { type: Types.Relationship, ref: 'TravelPackage' },
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  premiumFee: { type: Types.Number, default: 0 },
  minParticipant: { type: Types.Number, default: 0 },
  maxParticipant: { type: Types.Number, default: 0 },
  cost: { type: Types.Number, default: 0 },
  rate: { type: Types.Number, default: 0 },
  //rangeFrom and rangeTo applies to departure date only
  rangeFrom: { type: Types.Date, default: Date.now },
  rangeTo: { type: Types.Date, default: Date.now },
  priority: { type: Types.Number, default: 0 },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

PackageRate.defaultColumns = 'name, package|30%, minParticipant|10%, maxParticipant|10%, rate|10%';

/**
 * Registration
 */
PackageRate.register();
