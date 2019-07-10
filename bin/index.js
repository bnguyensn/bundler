#!/usr/bin/env node

/**
 * Need to turn this...
 * npx @bnguyensn/bundler xxx
 *
 * ...into this:
 * npx just xxx --webpackMode=xxx --srcPath=xxx
 *
 * The Just library will then find our just-task.js file in the top-level
 * directory and run our tasks. The webpackMode and srcPath argument is
 * needed to create correct config files relative to the user's project.
 * */

const path = require('path');
const shell = require('shelljs');

const mode = process.argv[2];
const webpackMode =
  mode === 'dev' ? 'development' : mode === 'prod' ? 'production' : '';
const srcPath = path.resolve(process.cwd());

const root = path.resolve(__dirname, '..');
shell.cd(root);
shell.exec(
  `npx just ${mode} ` +
    `--webpackMode=${webpackMode} ` +
    `--srcPath=${srcPath}`,
);
