#!/usr/bin/env node

const { init } = require("../src/commands/init");
const { deleteUser } = require('jjam-bubble/src/commands/deleteUser')

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

// Destroy User
program
  .command("deleteUser")
  .alias("du")
  .description("Destroy AWS user and all attached preview apps")
  .action(deleteUser);

program.parse(process.argv);