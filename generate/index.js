const path = require('path');
const pluralize = require('pluralize');
const generateIndexPage = require('./code/generateIndexPage');
const generateMigrationCode = require('./code/generateMigrationCode');
const generateModelCode = require('./code/generateModelCode');
const generateApiCode = require('./code/generateApiCode');
const { writeStringToFile, generateCurrentTimestamp } = require('../utils');

function generateModel(modelName, options) {
  const singularModelName = modelName.toLowerCase();

  // Generate model (src/db/models/${singularModelName}.ts) - Has the Typescript interface for the model
  const modelPath = path.join(process.cwd(), 'src/db/models', `${singularModelName}.ts`);

  generateModelCode(singularModelName, options)
    .then((result) => {
      writeStringToFile(result, modelPath);
    })
    .catch((error) => {
      console.error(error);
    });
}

function generateScaffold(modelName, options) {
  const singularModelName = modelName.toLowerCase();
  const pluralModelName = pluralize(singularModelName); // Using the pluralize package to pluralize the model name

  // Generate model (src/db/models/${singularModelName}.ts) - Has the Typescript interface for the model
  generateModel(modelName, options);

  // Generate controller (pages/api/${pluralModelName}.ts)
  const controllerPath = path.join(process.cwd(), 'src/pages/api', `${pluralModelName}.ts`);

  generateApiCode(singularModelName, pluralModelName)
    .then((result) => {
      writeStringToFile(result, controllerPath);
    })
    .catch((error) => {
      console.error(error);
    });

  // Generate migration (src/db/migrations/<timestamp>_create_${pluralModelName}.js)
  const timestamp = generateCurrentTimestamp(); // Current timestamp in the format YYYYMMDDHHMMSS
  const migrationPath = path.join(process.cwd(), 'src/db/migrations', `${timestamp}_create_${pluralModelName}.js`);

  generateMigrationCode(pluralModelName, options)
    .then((result) => {
      writeStringToFile(result, migrationPath);
    })
    .catch((error) => {
      console.error(error);
    });

  // Generate views
  const indexPath = path.join(process.cwd(), 'src/pages', pluralModelName, 'index.tsx');

  generateIndexPage(singularModelName, pluralModelName, options)
    .then((result) => {
      writeStringToFile(result, indexPath);
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  generateModel,
  generateScaffold,
};
