const ejs = require('ejs');
const path = require('path');
const pluralize = require('pluralize');
const { generateTypeMapping, toCamelCase, toTitleCase, toPascalCase, toSnakeCase } = require('../../utils');

function generateModelCode(singularModelName, options, dbType = 'pg', primaryKeyType = 'integer') {
  const pluralModelName = pluralize(singularModelName);
  const pascalSingularModelName = toPascalCase(singularModelName);
  const camelCaseSingularModelName = toCamelCase(singularModelName);

  const typeMapping = generateTypeMapping(dbType, primaryKeyType);
  const idType = typeMapping.references.ts;

  // Replace foreignModelName:references with foreignModelName_id:string
  options = options.map((option) => {
    const [name, type] = option.split(':');

    if (type === 'references' || type === 'belongs_to') {
      return `${toSnakeCase(name)}_id:${primaryKeyType === 'uuid' ? 'string' : 'integer'}`;
    }

    return option;
  });

  const data = {
    singularModelName: camelCaseSingularModelName,
    pluralModelName,
    pascalSingularModelName,
    options,
    typeMapping,
    toTitleCase,
    idType,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(__dirname, './templates/modelCode.ejs'), data, {}, function (err, str) {
      if (err) reject(err);
      resolve(str);
    });
  });
}

module.exports = generateModelCode;
