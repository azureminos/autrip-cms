var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = nextApp => keystoneApp => {
	// Next request handler
	const handle = nextApp.getRequestHandler();

	if (process.env.NODE_ENV !== 'production' || true) {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		keystoneApp.get('*', function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
	}
	/* ===== Functions ===== */
	keystoneApp.get(
		'/api/func/loadReference',
		keystone.middleware.api,
		routes.api.reference.loadReference
	);
	/* ===== APIs ===== */
	// Metadata
	keystoneApp.get(
		'/api/metadata',
		keystone.middleware.api,
		routes.api.metadata.getMetadata
	);
	keystoneApp.post(
		'/api/metadata',
		keystone.middleware.api,
		routes.api.metadata.getMetadata
	);
	// Country
	keystoneApp.get(
		'/api/country',
		keystone.middleware.api,
		routes.api.country.getAllCountry
	);
	keystoneApp.get(
		'/api/country/:id',
		keystone.middleware.api,
		routes.api.country.getCountryById
	);
	// City
	keystoneApp.get(
		'/api/city',
		keystone.middleware.api,
		routes.api.city.getAllCity
	);
	keystoneApp.get(
		'/api/city/:id',
		keystone.middleware.api,
		routes.api.city.getCityById
	);
	keystoneApp.post(
		'/api/city',
		keystone.middleware.api,
		routes.api.city.getCityByCountry
	);
	// Attraction
	keystoneApp.get(
		'/api/attraction',
		keystone.middleware.api,
		routes.api.attraction.getAllAttraction
	);
	keystoneApp.get(
		'/api/attraction/:id',
		keystone.middleware.api,
		routes.api.attraction.getAttractionById
	);
	keystoneApp.post(
		'/api/attraction',
		keystone.middleware.api,
		routes.api.attraction.getAttractionByCity
	);
	// HotelRoom
	keystoneApp.get(
		'/api/hotelroom',
		keystone.middleware.api,
		routes.api.hotelroom.getAllHotelRoom
	);
	keystoneApp.get(
		'/api/hotelroom/:id',
		keystone.middleware.api,
		routes.api.hotelroom.getHotelRoomById
	);
	keystoneApp.post(
		'/api/hotelroom',
		keystone.middleware.api,
		routes.api.hotelroom.getHotelRoomByHotel
	);
	// Hotel
	keystoneApp.get(
		'/api/hotel',
		keystone.middleware.api,
		routes.api.hotel.getAllHotel
	);
	keystoneApp.get(
		'/api/hotel/:id',
		keystone.middleware.api,
		routes.api.hotel.getHotelById
	);
	keystoneApp.post(
		'/api/hotel',
		keystone.middleware.api,
		routes.api.hotel.getHotelByCity
	);
	// FlightRate
	keystoneApp.get(
		'/api/flightrate',
		keystone.middleware.api,
		routes.api.flightrate.getAllFlightRate
	);
	keystoneApp.get(
		'/api/flightrate/:id',
		keystone.middleware.api,
		routes.api.flightrate.getFlightRateById
	);
	keystoneApp.post(
		'/api/flightrate',
		keystone.middleware.api,
		routes.api.flightrate.getFlightRateByPackage
	);
	// CarRate
	keystoneApp.get(
		'/api/carrate',
		keystone.middleware.api,
		routes.api.carrate.getAllCarRate
	);
	keystoneApp.get(
		'/api/carrate/:id',
		keystone.middleware.api,
		routes.api.carrate.getCarRateById
	);
	keystoneApp.post(
		'/api/carrate',
		keystone.middleware.api,
		routes.api.carrate.getCarRateByPackage
	);
	// PackageRate
	keystoneApp.get(
		'/api/packagerate',
		keystone.middleware.api,
		routes.api.packagerate.getAllPackageRate
	);
	keystoneApp.get(
		'/api/packagerate/:id',
		keystone.middleware.api,
		routes.api.packagerate.getPackageRateById
	);
	keystoneApp.post(
		'/api/packagerate',
		keystone.middleware.api,
		routes.api.packagerate.getPackageRateByPackage
	);
	// PackageHotel
	keystoneApp.get(
		'/api/packagehotel',
		keystone.middleware.api,
		routes.api.packagehotel.getAllPackageHotel
	);
	keystoneApp.get(
		'/api/packagehotel/:id',
		keystone.middleware.api,
		routes.api.packagehotel.getPackageHotelById
	);
	keystoneApp.post(
		'/api/packagehotel',
		keystone.middleware.api,
		routes.api.packagehotel.getPackageHotelByPackage
	);
	// PackageItem
	keystoneApp.get(
		'/api/packageitem',
		keystone.middleware.api,
		routes.api.packageitem.getAllPackageItem
	);
	keystoneApp.get(
		'/api/packageitem/:id',
		keystone.middleware.api,
		routes.api.packageitem.getPackageItemById
	);
	keystoneApp.post(
		'/api/packageitem',
		keystone.middleware.api,
		routes.api.packageitem.getPackageItemByPackage
	);
	// TravelPackage
	keystoneApp.get(
		'/api/travelpackage',
		keystone.middleware.api,
		routes.api.travelpackage.getAllTravelPackage
	);
	keystoneApp.get(
		'/api/travelpackage/template',
		keystone.middleware.api,
		routes.api.travelpackage.getTravelPackageTemplate
	);
	keystoneApp.get(
		'/api/travelpackage/snapshot',
		keystone.middleware.api,
		routes.api.travelpackage.getTravelPackageSnapshot
	);
	keystoneApp.get(
		'/api/travelpackage/:id',
		keystone.middleware.api,
		routes.api.travelpackage.getTravelPackageById
	);
	keystoneApp.post(
		'/api/travelpackage',
		keystone.middleware.api,
		routes.api.travelpackage.getTravelPackageByParams
	);

	keystoneApp.get('*', (req, res) => {
		return handle(req, res);
	});
};
