const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins(
  [
    withCSS,
  ],
  {
    SOCKET_BASE_URL : "test next",
  },
);
