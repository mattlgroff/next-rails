const path = require('path');
const fs = require('fs');
const pluralize = require('pluralize');
const generateIndexPage = require('./code/generateIndexPage');
const generateMigrationCode = require('./code/generateMigrationCode');
const generateModelCode = require('./code/generateModelCode');
const {
  generateCreateControllerCode,
  generateUpdateControllerCode,
  generateDestroyControllerCode,
  generateShowControllerCode,
  generateIndexControllerCode,
} = require('./code/generateApiCode');
const generateShowPage = require('./code/generateShowPage');
const generateNewPage = require('./code/generateNewPage');
const generateEditPage = require('./code/generateEditPage');
const { writeStringToFile, generateCurrentTimestamp, getNextRailsConfig, toSnakeCase } = require('../utils');

function generateModel(modelName, options) {
  const singularModelName = toSnakeCase(modelName);

  // Generate model (src/db/models/${singularModelName}.ts) - Has the Typescript interface for the model
  const modelPath = path.join(process.cwd(), 'src/db/models', `${singularModelName}.ts`);

  // Get the dbType and primaryKeyType from next-rails.config.json
  const { dbType, primaryKeyType } = getNextRailsConfig();

  generateModelCode(singularModelName, options, dbType, primaryKeyType)
    .then((result) => {
      writeStringToFile(result, modelPath);
    })
    .catch((error) => {
      console.error(error);
    });
}

function generateScaffold(modelName, options) {
  const singularModelName = toSnakeCase(modelName);
  const pluralModelName = pluralize(singularModelName); // Using the pluralize package to pluralize the model name

  // Get the dbType and primaryKeyType from next-rails.config.json
  const { dbType, primaryKeyType } = getNextRailsConfig();

  // Generate model (src/db/models/${singularModelName}.ts) - Has the Typescript interface for the model
  generateModel(modelName, options);

  // Create the folder src/db/pages/api/${pluralModelName} if it doesn't exist
  fs.mkdirSync(path.join(process.cwd(), 'src/pages/api', pluralModelName), { recursive: true });

  // Generate controllers (src/pages/api/${pluralModelName}/create.ts, update.ts, destroy.ts, show.ts, index.ts)
  const createControllerPath = path.join(process.cwd(), `src/pages/api/${pluralModelName}`, `create.ts`);
  generateCreateControllerCode(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, createControllerPath);
    })
    .catch((error) => {
      console.error(error);
    });

  fs.mkdirSync(path.join(process.cwd(), `src/pages/api/${pluralModelName}`, 'update'), { recursive: true });
  const updateControllerPath = path.join(process.cwd(), `src/pages/api/${pluralModelName}/update`, `[id].ts`);
  generateUpdateControllerCode(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, updateControllerPath);
    })
    .catch((error) => {
      console.error(error);
    });

  fs.mkdirSync(path.join(process.cwd(), `src/pages/api/${pluralModelName}`, 'destroy'), { recursive: true });
  const destroyControllerPath = path.join(process.cwd(), `src/pages/api/${pluralModelName}/destroy`, `[id].ts`);
  generateDestroyControllerCode(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, destroyControllerPath);
    })
    .catch((error) => {
      console.error(error);
    });

  fs.mkdirSync(path.join(process.cwd(), `src/pages/api/${pluralModelName}`, 'show'), { recursive: true });
  const showControllerPath = path.join(process.cwd(), `src/pages/api/${pluralModelName}/show`, `[id].ts`);
  generateShowControllerCode(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, showControllerPath);
    })
    .catch((error) => {
      console.error(error);
    });

  const indexControllerPath = path.join(process.cwd(), `src/pages/api/${pluralModelName}`, `index.ts`);
  generateIndexControllerCode(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, indexControllerPath);
    })
    .catch((error) => {
      console.error(error);
    });

  // Generate migration (src/db/migrations/<timestamp>_create_${pluralModelName}.js)
  const timestamp = generateCurrentTimestamp(); // Current timestamp in the format YYYYMMDDHHMMSS
  const migrationPath = path.join(process.cwd(), 'src/db/migrations', `${timestamp}_create_${pluralModelName}.js`);

  generateMigrationCode(pluralModelName, options, dbType, primaryKeyType)
    .then((result) => {
      writeStringToFile(result, migrationPath);
    })
    .catch((error) => {
      console.error(error);
    });

  // Generate views
  const indexPath = path.join(process.cwd(), 'src/pages', pluralModelName, 'index.tsx');
  generateIndexPage(singularModelName, pluralModelName, options, dbType, primaryKeyType)
    .then((result) => {
      writeStringToFile(result, indexPath);
    })
    .catch((error) => {
      console.error(error);
    });

  fs.mkdirSync(path.join(process.cwd(), `src/pages/${pluralModelName}`, '[id]'), { recursive: true });
  const showPath = path.join(process.cwd(), `src/pages/${pluralModelName}/[id]`, 'index.tsx');

  generateShowPage(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, showPath);
    })
    .catch((error) => {
      console.error(error);
    });

  const newPath = path.join(process.cwd(), 'src/pages', pluralModelName, 'new.tsx');
  generateNewPage(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, newPath);
    })
    .catch((error) => {
      console.error(error);
    });

  const editPath = path.join(process.cwd(), `src/pages/${pluralModelName}/[id]`, 'edit.tsx');
  generateEditPage(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, editPath);
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  generateModel,
  generateScaffold,
};
