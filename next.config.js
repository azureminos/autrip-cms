const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const hostname = process.env.API_BASE_URL || 'http://localhost';
const {DEMO, PORT, LOCAL} = process.env;
const socketPort = Number(PORT) - 1;
const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${socketPort}` : `wss://${hostname}`;

console.log('>>>>Print env[socketAddress]', socketAddress);

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
