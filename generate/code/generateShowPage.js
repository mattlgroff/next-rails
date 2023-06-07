const ejs = require('ejs');
const path = require('path');

function generateShowPage(singularModelName, pluralModelName, options) {
  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);
  const PascalSingularModelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

  // Helper function to convert snake_case to Title Case
  function toTitleCase(str) {
    return str.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Construct the model metadata
  const modelMetadata = {
    id: { label: 'ID', display: (value) => value },
    created_at: { label: 'Created At', display: (value) => value?.toLocaleString() || '' },
    updated_at: { label: 'Updated At', display: (value) => value?.toLocaleString() || '' },
  };

  // Add each option as a field in the metadata
  options.forEach((option) => {
    const [name, type] = option.split(':');
    const label = toTitleCase(name);
    let displayFunction;

    switch (type) {
      case 'boolean':
        displayFunction = (value) => (value ? 'Yes' : 'No');
        break;
      case 'date':
        displayFunction = (value) => (value ? value.toISOString() : '');
        break;
      default:
        displayFunction = (value) => value;
        break;
    }

    modelMetadata[name] = { label: label, display: displayFunction };
  });

  const fields = Object.keys(modelMetadata);

  // Use a Promise to make the function asynchronous
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/showPage.ejs'),
      { singularModelName, pluralModelName, modelName, fields, PascalSingularModelName },
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

module.exports = generateShowPage;
