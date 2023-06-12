const ejs = require('ejs');
const path = require('path');
const { generateTypeMapping } = require('../../utils');

function generateIndexPage(singularModelName, pluralModelName, options, dbType = 'pg', primaryKeyType = 'integer') {
  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);
  const PascalPluralModelName = pluralModelName.charAt(0).toUpperCase() + pluralModelName.slice(1);

  // Helper function to convert snake_case to Title Case
  function toTitleCase(str) {
    return str.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Construct the model metadata
  const modelMetadata = {
    id: { label: 'ID' },
  };

  const typeMapping = generateTypeMapping(dbType, primaryKeyType);

  // Replace foreignModelName:references with foreignModelName_id:string
  options = options.map((option) => {
    const [name, type] = option.split(':');

    if (type === 'references' || type === 'belongs_to') {
      return `${name}_id:${typeMapping.references.db_column}`;
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
      { singularModelName, pluralModelName, modelName, PascalPluralModelName, fields, modelMetadata },
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateIndexPage;
