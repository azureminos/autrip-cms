const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const hostname = process.env.HOSTNAME || 'localhost';
const { PORT, LOCAL } = process.env;
const socketAddress = (LOCAL) ? `http://${hostname}:${PORT||3000}` : `wss://${hostname}`;

// console.log('>>>>Print env[socketAddress]', socketAddress);

const nextConfig = {
	publicRuntimeConfig: {
		SOCKET_URL: socketAddress,
	},
};

module.exports = withPlugins(
	[
		withCSS,
	],
	nextConfig
);
