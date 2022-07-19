#!/usr/bin/env node

const { init } = require("../src/commands/init");
const { destroy } = require('../src/commands/destroy');
const { list } = require('../src/commands/list');
const { teardown } = require('../src/commands/teardown');
const { detail } = require('../src/commands/detail');
const { dashboard } = require('../src/commands/dashboard');

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
  .description("Select a preview app to go to its url")
  .action(list);

//teardown
program
  .command("teardown")
  .alias("t")
  .description("tear down leftover Lambdas functions and delete user")
  .action(teardown);

//table detail
program
  .command("detail")
  .alias("de")
  .description("display details about bubbles")
  .action(detail);

//dashboard
program
  .command("dashboard")
  .alias("da")
  .description("display dashboard to view bubbles for all repos")
  .action(dashboard);

program.parse(process.argv);