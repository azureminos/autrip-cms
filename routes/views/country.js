var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'countries';
  locals.filters = {
    country: req.params.country
  }
  locals.data = {
    countries:[]
  }

view.on('init', function(next){
  var q = keystone.list('Country').model.findOne({
    slug: locals.filters.country
  });

  q.exec(function(err, result){
    locals.data.country = result;
    next(err);
  });
});

  // Render View
  view.render('country');
}