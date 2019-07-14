#!/usr/bin/env node

/**
 * There is only this one command for our tool...
 * npx @bnguyensn/bundler mode [cliOptions]
 *
 * ...where mode = test | dev | prod
 * and cliOptions are potential options for the associated mode
 * */

const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const initScript = require('../lib/scripts/init');
const log = require('../lib/log');
const roundMs = require('../lib/roundMs');

// Expected to be one of: test | dev | prod
const mode = process.argv[2];
// Any options passed to the CLI
const cliOptions = process.argv.filter((v, i) => i > 2);
// Path to the project that we're building
const srcPath = path.resolve(process.cwd());

performance.mark('processStart');

initScript(mode, srcPath, cliOptions).then(
  () => {
    performance.mark('processEnd');
    performance.measure('process', 'processStart', 'processEnd');
  },
  err => {
    log.errorEOL('Process did not finish due to an error.');
    process.exit(1);
  },
);

const obs = new PerformanceObserver((list, obs) => {
  const dur = list.getEntriesByName('process')[0].duration;
  log.infoEOL(`Total time taken: ${roundMs(dur)}`);
  obs.disconnect();
});
obs.observe({ entryTypes: ['measure'] });
