const ejs = require('ejs');
const path = require('path');
const pluralize = require('pluralize');
const { generateTypeMapping } = require('../../utils');

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

  // Extract all references to other models
  const references = options
    .filter((option) => option.split(':')[1] === 'references')
    .map((option) => {
      const singularName = option.split(':')[0];
      const pluralName = pluralize(singularName);
      return [singularName, pluralName];
    });

  const belongsTo = options
    .filter((option) => option.split(':')[1] === 'belongsTo')
    .map((option) => {
      const singularName = option.split(':')[0];
      const pluralName = pluralize(singularName);
      return [singularName, pluralName];
    });

  // Remove references from options, since we don't want to create any additional columns for them.
  options = options.filter((option) => option.split(':')[1] !== 'references' && option.split(':')[1] !== 'belongsTo');

  const typeMapping = generateTypeMapping(dbType, primaryKeyType);

  const data = {
    pluralModelName,
    options,
    typeMapping,
    extensionsToInstall,
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
