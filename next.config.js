const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  env: {SOCKET_BASE_URL : "test next"},
};

module.exports = withPlugins(
  [
    withCSS,
  ],
  nextConfig
);
