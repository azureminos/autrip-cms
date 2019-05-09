// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Next app
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Autrip-CMS',
	'brand': 'Autrip-CMS',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Start Next app
app.prepare()
	.then(() => {
		// Setup common locals for your templates. The following are required for the
		// bundled templates and layouts. Any runtime locals (that should be set uniquely
		// for each request) should be added to ./routes/middleware.js
		keystone.set('locals', {
			_: require('lodash'),
			env: keystone.get('env'),
			utils: keystone.utils,
			editable: keystone.content.editable,
		});

		// Load your project's Routes
		keystone.set('routes', require('./routes')(app));


		// Configure the navigation bar in Keystone's Admin UI
		keystone.set('nav', {
			destinations: ['countries', 'cities', 'attractions'],
			hotels: ['hotels', 'hotel-rooms'],
			packages: ['travel-packages', 'package-items', 'package-hotels', 'package-rates', 'flight-rates', 'car-rates'],
			users: 'users',
		});

		keystone.start();
	});

