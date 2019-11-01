#!/usr/bin/env node

const path = require('path');
const logger = require('@bnguyensn/logger')();
const commander = require('commander');
const cliPackageJson = require('./package');

const nodeVer = process.version;

logger.info(`You are running Node.js version ${nodeVer}`);

const cli = new commander.Command().version(cliPackageJson.version);

const root = path.resolve(name);
const appName = path.basename(root);
