// API to get Country
var _ = require('lodash');
var async = require('async');
var keystone = require('keystone');

var Country = keystone.list('Country');

var parseCountry = function (input) {
	if (Array.isArray(input)) {
		var rs = [];
		_.each(input, function (item) {
			var r = {};
      r.id = item._id;
      r.name = item.name;
			rs.push(r);
		});
		return rs;
	} else {
    var r = {};
    r.id = item._id;
    r.name = item.name;
		return r;
	}
};

/** * Get Metadata */
exports.getMetadata = function (req, res) {
  var query = req.body;

  const result = {
    state: ['draft', 'published', 'archived']
  };

  const getCountryList = function (callback) {
    Country.model.find()
      .exec(function (err, items) {
        if (err || !items) return callback();
        // If yes, bypass; if no, update carRate.package
        result.country = parseCountry(items);
        return callback();
      });
  };

  const returnMetadata = function() {
    let rs = {};
    if (query.keys) {
      _.each(query.keys, function(item) {
        rs[item] = result[item];
      });
    } else {
      rs = result;
    }
    return res.apiResponse(rs);
  }

  async.series(
    [
      getCountryList,
    ], returnMetadata);
};
