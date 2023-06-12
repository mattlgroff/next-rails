const ejs = require('ejs');
const path = require('path');
const { generateTypeMapping } = require('../../utils');

function generateModelCode(singularModelName, options, dbType = 'pg', primaryKeyType = 'integer') {
  // Helper function to convert snake_case to Title Case
  function toTitleCase(str) {
    return str.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

  const typeMapping = generateTypeMapping(dbType, primaryKeyType);
  const idType = typeMapping.references.ts;

  // Replace foreignModelName:references with foreignModelName_id:string
  options = options.map((option) => {
    const [name, type] = option.split(':');

    if (type === 'references' || type === 'belongs_to') {
      return `${name}_id:${typeMapping.references.db_column}`;
    }

    return option;
  });

  const data = {
    singularModelName,
    modelName,
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
