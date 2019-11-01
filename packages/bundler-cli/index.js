#!/usr/bin/env node

const logger = require('@bnguyensn/logger')();
const commander = require('commander');

const nodeVer = process.version;

logger.info(`You are running Node.js version ${nodeVer}`);

const cli = new commander.Command();
