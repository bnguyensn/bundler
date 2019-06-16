/**
 * This manifest.json configuration object conforms to the options provided by
 * webpack-pwa-manifest. See more here:
 * https://github.com/arthurbergmz/webpack-pwa-manifest
 * */

const path = require('path');

module.exports = {
  short_name: 'JSStandard',
  name: 'Just another standard JavaScript web application',
  icons: [
    {
      src: path.resolve('src/assets/images/favicon/android-chrome-192x192.png'),
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: path.resolve('src/assets/images/favicon/android-chrome-512x512.png'),
      type: 'image/png',
      sizes: '512x512',
    },
  ],
  start_url: '.',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#fce4ec', // Pink 50
};
