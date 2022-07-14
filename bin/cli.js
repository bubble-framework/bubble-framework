#!/usr/bin/env node

const { init } = require("../src/commands/init");
const { destroy } = require('../src/commands/destroy');
const { list } = require('../src/commands/list');
const { teardown } = require('../src/commands/teardown')

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

//list
program
  .command("list")
  .alias("l")
  .description("List all preview apps for this repo")
  .action(list);

//teardown
program
  .command("teardown")
  .alias("t")
  .description("tear down leftover Lambdas functions and delete user")
  .action(teardown);

program.parse(process.argv);