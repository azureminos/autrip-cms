// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Init socket
const app = require('express')();
const appPort = process.env.PORT;
const server = require('http').Server(app);
const SocketServer = require('socket.io');
const io = new SocketServer(server, {pingInterval: 2000, pingTimeout: 5000});

// Next app
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const messages = [];
io.on('connection', (socket) => {
	console.log('Client connected', socket.id);
	/*const channel = (channel, handler) => {
		socket.on(channel, (request, sendStatus) => {
			console.log(`>>>>Captured event[${channel}] on socket[${socket.id}]`, request);

			handler({
				request,
				sendStatus,
				socket,
			});
		});
	};
	console.log(`A user connected (socket ID ${socket.id})`);
	// Register channels
	channel('disconnect', ({ request, sendStatus, socket }) => {
		console.log(`A user disconnect (socket ID ${socket.id})`, request);
		sendStatus('ok');
	});*/
	socket.on('push:message', (data) => {
		console.log('>>>>server socket', data);
		messages.push(data);
		socket.emit('message', data);
	});
});

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

		app.use(function(req, res, next) {
			res.io = io;
			next();
		});
		
		server.listen(appPort);

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

		keystone.start();
	});

