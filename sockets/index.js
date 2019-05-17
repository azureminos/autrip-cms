
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
		channel('push:package:status', PackageSocket.updatePackageState);
		channel('disconnect', () => { console.log('>>>>User disconnected'); });
	});
}
