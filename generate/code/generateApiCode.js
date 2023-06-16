const ejs = require('ejs');
const path = require('path');
const { toPascalCase } = require('../../utils');

async function generateCreateControllerCode(singularModelName, pluralModelName) {
  const data = {
    singularModelName,
    pluralModelName,
    pascalSingularModelName: toPascalCase(singularModelName),
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/api/create.ejs'),
      data,
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

async function generateUpdateControllerCode(singularModelName, pluralModelName) {
  const data = {
    singularModelName,
    pluralModelName,
    pascalSingularModelName: toPascalCase(singularModelName),
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/api/update.ejs'),
      data,
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

async function generateDestroyControllerCode(singularModelName, pluralModelName) {
  const data = {
    singularModelName,
    pluralModelName,
    pascalSingularModelName: toPascalCase(singularModelName),
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/api/destroy.ejs'),
      data,
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

async function generateShowControllerCode(singularModelName, pluralModelName) {
  const data = {
    singularModelName,
    pluralModelName,
    pascalSingularModelName: toPascalCase(singularModelName),
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/api/show.ejs'),
      data,
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}

async function generateIndexControllerCode(singularModelName, pluralModelName) {
  const data = {
    singularModelName,
    pluralModelName,
    pascalSingularModelName: toPascalCase(singularModelName),
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, './templates/api/index.ejs'),
      data,
      {},
      function (err, str) {
        if (err) reject(err);
        resolve(str);
      }
    );
  });
}


module.exports = {
  generateCreateControllerCode,
  generateUpdateControllerCode,
  generateDestroyControllerCode,
  generateShowControllerCode,
  generateIndexControllerCode,
}