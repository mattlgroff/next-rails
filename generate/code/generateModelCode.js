const ejs = require('ejs');
const path = require('path');
const { typeMapping } = require('../../constants');

function generateModelCode(singularModelName, options) {
  // Helper function to convert snake_case to Title Case
  function toTitleCase(str) {
    return str.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

  // Replace references:foreignModelName with foreignModelName_id:string
  options = options.map((option) => {
    const [name, type] = option.split(':');

    if(name === 'references') {
      return `${type}_id:string`;
    }

    return option;
  });



  const data = {
    singularModelName,
    modelName,
    options,
    typeMapping,
    toTitleCase,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(path.resolve(__dirname, './templates/modelCode.ejs'), data, {}, function (err, str) {
      if (err) reject(err);
      resolve(str);
    });
  });
}

module.exports = generateModelCode;
