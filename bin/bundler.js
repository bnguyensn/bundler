#!/usr/bin/env node

/**
 * There is only this one command for our tool...
 * npx @bnguyensn/bundler xxx
 *
 * ...where xxx = test | dev | prod
 * */

const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const initScript = require('../lib/scripts/init');
const log = require('../lib/log');
const roundMs = require('../lib/roundMs');

// Expected to be one of: test | dev | prod
const mode = process.argv[2];
// Path to the project that we're building
const srcPath = path.resolve(process.cwd());

performance.mark('processStart');

initScript(mode, srcPath).then(
  () => {
    performance.mark('processEnd');
    performance.measure('process', 'processStart', 'processEnd');
  },
  (err) => {
    log.errorEOL(`Error occurred: ${err}`);
  },
);

const obs = new PerformanceObserver((list, obs) => {
  const dur = list.getEntriesByName('process')[0].duration;
  log.infoEOL(`Total time taken: ${roundMs(dur)}`);
  obs.disconnect();
});
obs.observe({ entryTypes: ['measure'] });
