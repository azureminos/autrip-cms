// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Next app
const app = require('express')();
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

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
nextApp.prepare()
	.then(() => {
		app.get('*', (req, res) => {
			return nextHandler(req, res);
		});

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
		keystone.set('routes', require('./routes')(nextApp));


		// Configure the navigation bar in Keystone's Admin UI
		keystone.set('nav', {
			destinations: ['countries', 'cities', 'attractions'],
			hotels: ['hotels', 'hotel-rooms'],
			packages: ['travel-packages', 'package-items', 'package-hotels', 'package-rates', 'flight-rates', 'car-rates'],
			users: 'users',
		});

		keystone.start({
			onHttpServerCreated: function () {
				const server = keystone.httpsServer ? keystone.httpsServer : keystone.httpServer;
				keystone.set('io', require('socket.io').listen(server));
			},
			onStart: function () {
				var io = keystone.get('io');
				var session = keystone.expressSession;

				// Share session between express and socketio
				io.use(function (socket, next) {
					session(socket.handshake, {}, next);
				});

				// Socketio connection
				io.on('connect', (socket) => {
					console.log('>>>>User connected', socket.id);

					socket.on('push:message', (data) => {
						console.log('>>>>server socket', data);
						socket.emit('message', data);
					});

					socket.on('disconnect', () => {
						console.log('>>>>User disconnected');
					});
				});
			},
		});
	});

