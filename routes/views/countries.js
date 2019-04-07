var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'countries';

	// Load the galleries by sortOrder
	view.query('countries', keystone.list('Country').model.find());

	// Render the view
	view.render('countries');
};
