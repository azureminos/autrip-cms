const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const hostname = process.env.HOSTNAME || 'localhost';
const { PORT, LOCAL, TERMS_CONDS } = process.env;
const { DEF_CURRENCY, DEF_DEPOSIT } = process.env;
const { PAYPAL_ENV, PAYPAL_ID, PAYPAL_DUMMY_ID } = process.env;
const socketAddress = LOCAL
	? `http://${hostname}:${PORT || 3000}`
	: `wss://${hostname}`;

// console.log('>>>>Print env[socketAddress]', socketAddress);

const nextConfig = {
	publicRuntimeConfig: {
		SOCKET_URL: socketAddress,
		PAYPAL_ENV: PAYPAL_ENV,
		PAYPAL_ID: PAYPAL_ID,
		PAYPAL_DUMMY_ID: PAYPAL_DUMMY_ID,
		DEF_DEPOSIT: Number(DEF_DEPOSIT || 0),
		TERMS_CONDS: TERMS_CONDS,
		DEF_CURRENCY: DEF_CURRENCY,
	},
};

module.exports = withPlugins([withCSS], nextConfig);
