const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost',
    SOCKET_PORT: Number(process.env.SOCKET_PORT || '4000'),
  },
};

module.exports = withPlugins(
  [
    withCSS,
  ],
  nextConfig
);
