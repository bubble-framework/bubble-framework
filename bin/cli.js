#!/usr/bin/env node

import { program } from 'commander';

import init from '../src/commands/init.js';
import destroy from '../src/commands/destroy.js';
import list from '../src/commands/list.js';
import teardown from '../src/commands/teardown.js';
import detail from '../src/commands/detail.js';

import { version } from '../package.json.js';

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

program.parse(process.argv);
