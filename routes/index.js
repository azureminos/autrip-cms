/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/gallery', routes.views.gallery);
	// Country
	app.get('/api/country', keystone.middleware.api, routes.api.country.getCountry);
	app.get('/api/country/:id', keystone.middleware.api, routes.api.country.getCountryById);
	// City
	app.get('/api/city', keystone.middleware.api, routes.api.city.getCity);
	app.get('/api/city/:id', keystone.middleware.api, routes.api.city.getCityById);
	// Attraction
	app.get('/api/attraction', keystone.middleware.api, routes.api.attraction.getAttraction);
	app.get('/api/attraction/:id', keystone.middleware.api, routes.api.attraction.getAttractionById);
	// HotelRoom
	app.get('/api/hotelroom', keystone.middleware.api, routes.api.hotelroom.getHotelRoom);
	app.get('/api/hotelroom/:id', keystone.middleware.api, routes.api.hotelroom.getHotelRoomById);
	// HotelRoom
	app.get('/api/hotel', keystone.middleware.api, routes.api.hotel.getHotel);
	app.get('/api/hotel/:id', keystone.middleware.api, routes.api.hotel.getHotelById);



	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
