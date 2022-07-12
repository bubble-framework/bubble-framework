#!/usr/bin/env node

const { init } = require("../src/commands/init");
const { destroy } = require('../src/commands/destroy')

const prompts = require("prompts");
const { program } = require("commander");

const version = require("../package.json").version;
program.version(version).description("Bubble Framework");

// Init
program
  .command("init")
  .alias("i")
  .description("Create a bubble application")
  .action(init);

// Destroy all
program
  .command("destroy")
  .alias("d")
  .description("Destroy AWS user and all attached preview apps")
  .action(destroy);

program.parse(process.argv);