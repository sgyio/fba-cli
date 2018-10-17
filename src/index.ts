#!/usr/bin/env node

import 'reflect-metadata';

import * as yargs from 'yargs';

import { ICommand } from './commands/command.interface';
import { container, TYPES } from './ioc';

try {
  yargs
  .command(container.getNamed<ICommand>(TYPES.Command, 'configure'))
  .command(container.getNamed<ICommand>(TYPES.Command, 'deleteUsers'))
  .demandCommand(1, 'At least one command is required.')
  .help()
  .argv;
} catch (e) {
  console.log(e.message);
}
