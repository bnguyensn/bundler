#!/usr/bin/env node

/**
 * There is only this command for our tool...
 * npx @bnguyensn/bundler xxx
 *
 * ...where xxx = test | dev | prod
 * */

const path = require('path');
const scripts = require('../lib/scripts');
const generateConfig = require('../lib/generateConfig');

const mode = process.argv[2];

if (mode === 'test') {
  // Initiate tests 🚨...

  scripts.test();
} else if (mode === 'dev' || mode === 'prod') {
  // Initiate dev / prod webpack run 🛠️

  const webpackMode =
    mode === 'dev' ? 'development' : mode === 'prod' ? 'production' : '';
  const srcPath = path.resolve(process.cwd());

  const config = generateConfig(webpackMode, srcPath);

  scripts[mode](config);
}
