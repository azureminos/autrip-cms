// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Next app
const app = require('express')();
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Socket components
const socketIO = require('socket.io');

// Require keystone
const keystone = require('keystone');
const PackageSocket = require('./sockets/package');
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
				keystone.set('io', socketIO.listen(server));
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
					const channel = (channel, handler) => {
						socket.on(channel, (request, sendStatus) => {
							console.log(`>>>>Captured event[${channel}] on socket[${socket.id}]`, request);

							handler({
								request,
								sendStatus,
								socket,
							});
						});
					};

					console.log('>>>>User connected', socket.id);

					channel('push:package:get', PackageSocket.getPackageDetails);
					channel('disconnect', () => {console.log('>>>>User disconnected');});
				});
			},
		});
	});

