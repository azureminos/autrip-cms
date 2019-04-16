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
	// Allow cross-domain requests (development only)
	if (process.env.NODE_ENV !== 'production') {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		app.all('*', function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
	}
	/* ===== Views ===== */
	app.get('/', routes.views.index);
	app.get('/country', routes.views.country);
	/* ===== APIs ===== */
	// Country
	app.get('/api/country', keystone.middleware.api, routes.api.country.getAllCountry);
	app.get('/api/country/:id', keystone.middleware.api, routes.api.country.getCountryById);
	// City
	app.get('/api/city', keystone.middleware.api, routes.api.city.getAllCity);
	app.get('/api/city/:id', keystone.middleware.api, routes.api.city.getCityById);
	app.post('/api/city', keystone.middleware.api, routes.api.city.getCityByCountry);
	// Attraction
	app.get('/api/attraction', keystone.middleware.api, routes.api.attraction.getAllAttraction);
	app.get('/api/attraction/:id', keystone.middleware.api, routes.api.attraction.getAttractionById);
	app.post('/api/attraction', keystone.middleware.api, routes.api.attraction.getAttractionByCity);
	// HotelRoom
	app.get('/api/hotelroom', keystone.middleware.api, routes.api.hotelroom.getAllHotelRoom);
	app.get('/api/hotelroom/:id', keystone.middleware.api, routes.api.hotelroom.getHotelRoomById);
	app.post('/api/hotelroom', keystone.middleware.api, routes.api.hotelroom.getHotelRoomByHotel);
	// Hotel
	app.get('/api/hotel', keystone.middleware.api, routes.api.hotel.getAllHotel);
	app.get('/api/hotel/:id', keystone.middleware.api, routes.api.hotel.getHotelById);
	app.post('/api/hotel', keystone.middleware.api, routes.api.hotel.getHotelByCity);
	// FlightRate
	app.get('/api/flightrate', keystone.middleware.api, routes.api.flightrate.getAllFlightRate);
	app.get('/api/flightrate/:id', keystone.middleware.api, routes.api.flightrate.getFlightRateById);
	app.post('/api/flightrate', keystone.middleware.api, routes.api.flightrate.getFlightRateByPackage);
	// CarRate
	app.get('/api/carrate', keystone.middleware.api, routes.api.carrate.getAllCarRate);
	app.get('/api/carrate/:id', keystone.middleware.api, routes.api.carrate.getCarRateById);
	app.post('/api/carrate', keystone.middleware.api, routes.api.carrate.getCarRateByPackage);
	// PackageRate
	app.get('/api/packagerate', keystone.middleware.api, routes.api.packagerate.getAllPackageRate);
	app.get('/api/packagerate/:id', keystone.middleware.api, routes.api.packagerate.getPackageRateById);
	app.post('/api/packagerate', keystone.middleware.api, routes.api.packagerate.getPackageRateByPackage);
	// PackageHotel
	app.get('/api/packagehotel', keystone.middleware.api, routes.api.packagehotel.getAllPackageHotel);
	app.get('/api/packagehotel/:id', keystone.middleware.api, routes.api.packagehotel.getPackageHotelById);
	app.post('/api/packagehotel', keystone.middleware.api, routes.api.packagehotel.getPackageHotelByPackage);
	// PackageItem
	app.get('/api/packageitem', keystone.middleware.api, routes.api.packageitem.getAllPackageItem);
	app.get('/api/packageitem/:id', keystone.middleware.api, routes.api.packageitem.getPackageItemById);
	app.post('/api/packageitem', keystone.middleware.api, routes.api.packageitem.getPackageItemByPackage);
	// TravelPackage
	app.get('/api/travelpackage', keystone.middleware.api, routes.api.travelpackage.getAllTravelPackage);
	app.get('/api/travelpackage/:id', keystone.middleware.api, routes.api.travelpackage.getTravelPackageById);
	app.post('/api/travelpackage', keystone.middleware.api, routes.api.travelpackage.getTravelPackageByCountry);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
