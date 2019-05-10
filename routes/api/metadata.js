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
    //console.log('>>>>Metadata.parseCountry', rs);
		return rs;
	} else {
    var r = {};
    r.id = item._id;
    r.name = item.name;
    //console.log('>>>>Metadata.parseCountry', r);
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
        //console.log('>>>>Metadata.getCountryList', {err, items});
        if (err || !items) return callback();
        // If yes, bypass; if no, update carRate.package
        result.country = parseCountry(items);
        return callback();
      });
  };

  const returnMetadata = function() {
    let rs = {};
    //console.log('>>>>Metadata.returnMetadata >> query', query);
    //console.log('>>>>Metadata.returnMetadata >> result', result);
    if (query && query.keys && Array.isArray(query.keys)) {
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
