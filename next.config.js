const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  publicRuntimeConfig: {
    SOCKET_BASE_URL: process.env.SOCKET_BASE_URL || 'http://0.0.0.0',
    SOCKET_PORT: Number(process.env.SOCKET_PORT || '4000'),
  },
};

module.exports = withPlugins(
  [
    withCSS,
  ],
  nextConfig
);
