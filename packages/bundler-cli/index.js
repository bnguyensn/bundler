#!/usr/bin/env node

const path = require('path');
const logger = require('@bnguyensn/logger')();
const commander = require('commander');
const cliPackageJson = require('./package');

// ========== NODE VERSION ========== //

const nodeVer = process.version;

logger.info(`You are running Node.js version ${nodeVer}`);

// ========== SETUP PROGRAM ========== //

const cli = new commander.Command().version(cliPackageJson.version);

cli
  .name('@bnguyensn/bundler')
  .usage('<app-name> [options]')
  .option('-t, --typescript', 'Enable TypeScript support');

// ---------- Parse ---------- //

cli.parse(process.argv);

// ---------- Others ---------- //

// Name of the app being scaffolded
const appName = process.argv[2];
if (!appName) {
  logger.error('You must provide an app name!');
  process.exit(1);
}

logger.info('Your app name is ' + appName);
if (cli.typescript) logger.info('You have opted to use TypeScript');
