const ejs = require('ejs');
const path = require('path');
const pluralize = require('pluralize');
const { generateTypeMapping, toSnakeCase } = require('../../utils');

function generateMigrationCode(pluralModelName, options, dbType = 'pg', primaryKeyType = 'integer') {
  const hasVector = options.some((option) => option.split(':')[1] === 'vector');

  // Add extensions to install
  let extensionsToInstall = '';

  // If the primaryKeyType is 'uuid', we need to install the uuid-ossp extension.
  if (primaryKeyType === 'uuid') {
    extensionsToInstall = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
  }

  // Add vector extension if needed, since most projects will not need PGVector.
  if (hasVector) {
    extensionsToInstall = `${extensionsToInstall} CREATE EXTENSION IF NOT EXISTS "vector";`;
  }

  // Generate the first line of the migration
  let firstLineOfMigration = '';
  if (extensionsToInstall) {
    firstLineOfMigration = `return knex.schema.raw('${extensionsToInstall}').createTable('${pluralModelName}', function (table) {`;
  } else {
    firstLineOfMigration = `return knex.schema.createTable('${pluralModelName}', function (table) {`;
  }

  // Extract all references to other models
  const references = options
    .filter((option) => option.split(':')[1] === 'references')
    .map((option) => {
      const singularName = toSnakeCase(option.split(':')[0]);
      const pluralName = pluralize(singularName);
      return [singularName, pluralName];
    });

  const belongsTo = options
    .filter((option) => option.split(':')[1] === 'belongs_to')
    .map((option) => {
      const singularName = toSnakeCase(option.split(':')[0]);
      const pluralName = pluralize(singularName);
      return [singularName, pluralName];
    });

  // Remove references from options, since we don't want to create any additional columns for them.
  options = options.filter((option) => option.split(':')[1] !== 'references' && option.split(':')[1] !== 'belongs_to');

  const typeMapping = generateTypeMapping(dbType, primaryKeyType);

  const data = {
    pluralModelName,
    options,
    typeMapping,
    firstLineOfMigration,
    belongsTo,
    references,
    primaryKeyType,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(__dirname, './templates/migrationCode.ejs'), data, {}, function (err, str) {
      if (err) reject(err);
      resolve(str);
    });
  });
}

module.exports = generateMigrationCode;
