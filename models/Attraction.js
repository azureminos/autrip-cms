var keystone = require('keystone');
var _ = require('lodash');
var Types = keystone.Field.Types;

/**
 * Attraction Model
 * ==========
 */
var Attraction = new keystone.List('Attraction', {
  map: { name: 'name' },
  singular: 'Attraction',
  plural: 'Attraction',
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
});

Attraction.add({
  name: { type: Types.Text, required: true, index: true },
  description: { type: Types.Textarea },
  city: { type: Types.Relationship, ref: 'City' },
  tag: { type: Types.TextArray },
  alias: { type: Types.TextArray },
  image: { type: Types.CloudinaryImage, folder: 'Attractions', select: true, selectPrefix: 'Attractions' },
  cost: { type: Types.Number, default: 0 },
  rate: { type: Types.Number, default: 0 },
  timeTraffic: { type: Types.Number, default: 0 },
  timeVisit: { type: Types.Number, default: 0 },
  nearByAttractions: { type: Types.Relationship, ref: 'Attraction', many: true },
  notes: { type: Types.Textarea },
  additionalField: { type: Types.Textarea },
});

Attraction.defaultColumns = 'name, city';

Attraction.relationship({ path: 'nearBySites', ref: 'Attraction', refPath: 'nearByAttractions' });

Attraction.schema.methods.updateNearby = function(callback) {
  var site = this;
  var siteId = site._id;
  // Get all nearby attractions
  _.forEach(site.nearByAttractions, function(id) {
    // Loop through and check if current attraction is in their nearby
    keystone.list('Attraction').model.findById(id).exec(function (err, item) {
      if (err || !item) return;
      // If yes, bypass; if no, add to their nearby
      var isFound = _.find(item.nearByAttractions, function(o) {
        return o.toString() == siteId.toString(); }
      );

      if(!isFound) {
        item.nearByAttractions.push(siteId);
        item.save(callback);
      }
    });
  });
}

Attraction.schema.set('usePushEach', true);

/*Attraction.schema.pre('save', function (next) {
  console.log('>>>>Before save object[Attraction]', this);
  next();
});*/

Attraction.schema.post('save', function () {
  //console.log('>>>>After save object[Attraction]', this);
  this.updateNearby();
});

/**
 * Registration
 */
Attraction.register();
