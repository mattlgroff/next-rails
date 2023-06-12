#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const initNextApp = require('./next/init-next-app');
const migrations = require('./knex/migrations');
const seeds = require('./knex/seeds');
const { generateScaffold, generateModel } = require('./generate');

/*
  The hideBin helper removes the first two arguments of process.argv (which are the node executable and the path to your script).
  The command function is used to define a new command. It takes four arguments: the command name (with any positional arguments), a description, a builder function to define the positional arguments, and a handler function to run when the command is invoked.
  The demandCommand function enforces that at least one command must be provided.
  The alias function allows you to set an alias for a command, in this case 'g' for 'generate'.
  The help function adds a built-in help command.
  The parsed arguments are accessed via argv.<argumentName> in the handler functions.
*/

yargs(hideBin(process.argv))
  .command(
    'new <app-name>',
    'create a new next app w/ next-rails. Pass in --primary-key-type uuid if you do not want auto incrementing integers',
    (yargs) => {
      yargs.positional('app-name', {
        describe: 'the name of the app to create',
        type: 'string',
      })
      .option('primary-key-type', {
        describe: 'the type of the primary key (default is integer)',
        type: 'string',
        default: 'integer',
        choices: ['integer', 'uuid']
      })
      .option('db-type', {
        describe: 'the type of the database (default is pg for postgres)',
        type: 'string',
        default: 'pg'
      });
    },
    (argv) => {
      initNextApp(argv.appName, argv.dbType, argv.primaryKeyType);
    }
  )
  .command(
    ['generate [type] [name] [options...]', 'g [type] [name] [options...]'],
    'generate a model or scaffold',
    (yargs) => {
      yargs
        .positional('type', {
          describe: 'type of generation to perform (model or scaffold)',
          type: 'string',
        })
        .positional('name', {
          describe: 'name of the model or scaffold',
          type: 'string',
        })
        .array('options')
        .describe('options', 'options for the model or scaffold');
    },
    (argv) => {
      const { type, name, options } = argv;
      switch (type) {
        case 'model':
          console.log(`Generating model ${name}...`);
          generateModel(name, options);
          break;
        case 'scaffold':
          console.log(`Generating scaffold ${name}...`);
          generateScaffold(name, options);
          break;
        default:
          console.log(`Unknown type ${type}`);
          break;
      }
    }
  )
  .command(
    'migration:generate [name]',
    'Generate a new migration',
    (yargs) => {
      yargs.positional('name', {
        describe: 'Name of the migration',
        type: 'string',
      });
    },
    (argv) => {
      migrations.generate(argv);
    }
  )
  .command('db:migrate', 'Run all migrations', {}, migrations.migrate)
  .command('db:migrate:up', 'Run the next migration', {}, migrations.up)
  .command('db:migrate:down', 'Roll back the last batch of migrations', {}, migrations.down)
  .command('db:migrate:status', 'Check the status of migrations', {}, migrations.status)
  .command(
    'seed:generate [name]',
    'generate a new seed',
    (yargs) => {
      yargs.positional('name', {
        describe: 'Name of the seed',
        type: 'string',
      });
    },
    (argv) => {
      seeds.generate(argv);
    }
  )
  .command('db:seed', 'Run seed files', {}, seeds.seed)
  .command('db:reset', 'Reset the database', {}, migrations.reset)
  .command('db:schema_dump', 'Dump the database schema', {}, migrations.schemaDump)
  .demandCommand(1, 'You must provide a valid command')
  .help().argv;
