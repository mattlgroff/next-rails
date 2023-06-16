const ejs = require('ejs');
const path = require('path');
const pluralize = require('pluralize');
const { generateTypeMapping, toPascalCase, toTitleCase, toCamelCase, toSnakeCase } = require('../../utils');

function generateIndexPage(singularModelName, pluralModelName, options, dbType = 'pg', primaryKeyType = 'integer') {
  const pascalSingularModelName = toPascalCase(singularModelName);
  const pascalPluralModelName = pluralize(pascalSingularModelName);
  const camelCaseSingularModelName = toCamelCase(singularModelName);
  const camelCasePluralModelName = toCamelCase(pluralModelName);

  // Construct the model metadata
  const modelMetadata = {
    id: { label: 'ID' },
  };

  const typeMapping = generateTypeMapping(dbType, primaryKeyType);

  // Replace foreignModelName:references with foreignModelName_id:string
  options = options.map((option) => {
    const [name, type] = option.split(':');

    if (type === 'references' || type === 'belongs_to') {
      return `${toSnakeCase(name)}_id:${typeMapping.references.db_column}`;
    }

    return option;
  });

  // Add each option as a field in the metadata
  options.forEach((option) => {
    const [name] = option.split(':');
    const label = toTitleCase(name);

    modelMetadata[name] = { label };
  });

  modelMetadata['created_at'] = { label: 'Created At' };
  modelMetadata['updated_at'] = { label: 'Updated At' };

  const fields = Object.keys(modelMetadata);

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/indexPage.ejs'),
      {
        singularModelName,
        pluralModelName,
        camelCaseSingularModelName,
        camelCasePluralModelName,
        tableName: pluralModelName,
        pascalSingularModelName,
        pascalPluralModelName,
        fields,
        modelMetadata,
      },
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateIndexPage;
