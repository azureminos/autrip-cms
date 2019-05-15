export default function attachSockets (io) {
	io.on('connection', (socket) => {
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
		console.log(`A user connected (socket ID ${socket.id})`);
		// Register channels
		channel('disconnect', ({ request, sendStatus, socket }) => {
			console.log(`A user disconnect (socket ID ${socket.id})`, request);
			sendStatus('ok');
		});
		channel('push:test', ({ request, sendStatus, socket }) => {
			console.log(`Received a test push from (socket ID ${socket.id})`, request);
			socket.emit('test', 'hello from server');
			sendStatus('ok');
		});
	});
}
