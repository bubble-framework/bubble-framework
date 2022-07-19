#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs/promises';

import init from '../src/commands/init.js';
import destroy from '../src/commands/destroy.js';
import list from '../src/commands/list.js';
import teardown from '../src/commands/teardown.js';
import detail from '../src/commands/detail.js';
import dashboard from '../src/commands/dashboard.js';

const packageJson = JSON.parse(
  await fs.readFile(
    new URL('../package.json', import.meta.url)
  )
);

const { version } = packageJson;

program.version(version).description('Bubble Framework');

// Init
program
  .command('init')
  .alias('i')
  .description('Create a bubble application')
  .action(init);

// Destroy all
program
  .command('destroy')
  .alias('d')
  .description('Destroy AWS user and all attached preview apps')
  .action(destroy);

// list
program
  .command('list')
  .alias('l')
  .description('Select a preview app to go to its url')
  .action(list);

// teardown
program
  .command('teardown')
  .alias('t')
  .description('tear down leftover Lambdas functions and delete user')
  .action(teardown);

// table detail
program
  .command('detail')
  .alias('de')
  .description('display details about bubbles')
  .action(detail);

//dashboard
program
  .command("dashboard")
  .alias("da")
  .description("start dashboard to view bubbles for all active repos currently using Bubble")
  .action(dashboard);

program.parse(process.argv);
