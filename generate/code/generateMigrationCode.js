const ejs = require('ejs');
const path = require('path');
const { typeMapping } = require('../../constants');
const pluralize = require('pluralize');

function generateMigrationCode(pluralModelName, options) {
  const hasVector = options.some((option) => option.split(':')[1] === 'vector');

  // Add extensions to install, default is uuid-ossp since we use UUID.
  let extensionsToInstall = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';

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

  // Remove references from options, since we don't want to create any additional columns for them.
  options = options.filter((option) => option.split(':')[1] !== 'references');

  const data = {
    pluralModelName,
    options,
    typeMapping,
    extensionsToInstall,
    references,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(__dirname, './templates/migrationCode.ejs'), data, {}, function (err, str) {
      if (err) reject(err);
      resolve(str);
    });
  });
}

module.exports = generateMigrationCode;
