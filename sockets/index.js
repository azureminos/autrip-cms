
const PackageSocket = require('./package');

exports.attachSockets = (io) => {
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
		channel('push:package:filter', PackageSocket.getFilteredPackages);
		channel('push:package:publish', PackageSocket.publishPackage);
		channel('push:package:archive', PackageSocket.archivePackage);
		channel('disconnect', () => { console.log('>>>>User disconnected'); });
	});
};
