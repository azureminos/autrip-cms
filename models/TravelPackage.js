var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * TravelPackage Model
 * ==========
 */
var TravelPackage = new keystone.List('TravelPackage', {
  map: { name: 'name' },
  singular: 'TravelPackage',
  plural: 'TravelPackage',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

TravelPackage.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  finePrint: { type: Types.Textarea },
  totalDays: { type: Types.Number, default: 0 },
  maxParticipant: { type: Types.Number, default: 0 },
  departureDate: { type: Types.Textarea },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', noedit: true },
  publishedAt: { type: Types.Date },
  isPromoted: { type: Types.Boolean, default: false },
  isCustomisable: { type: Types.Boolean, default: false },
  isExtention: { type: Types.Boolean, default: false },
  image: { type: Types.CloudinaryImage, folder: 'Packages', select: true, selectPrefix: 'Packages' },
  effectiveFrom: { type: Types.Date, default: Date.now },
  effectiveTo: { type: Types.Date, default: Date.now },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

TravelPackage.relationship({ path: 'flightRate', ref: 'FlightRate', refPath: 'package' });
TravelPackage.relationship({ path: 'carRate', ref: 'CarRate', refPath: 'package' });
TravelPackage.relationship({ path: 'packageRate', ref: 'PackageRate', refPath: 'package' });
TravelPackage.relationship({ path: 'packageItem', ref: 'PackageItem', refPath: 'package' });
TravelPackage.relationship({ path: 'packageHotel', ref: 'PackageHotel', refPath: 'package' });

TravelPackage.schema.methods.isPublished = function() {
  return this.state == 'published';
}

TravelPackage.schema.pre('save', function(next) {
  if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

TravelPackage.defaultColumns = 'name, totalDays|15%, maxParticipant|15%, isPromoted|15%, isExtention|15%';

/**
 * Registration
 */
TravelPackage.register();
