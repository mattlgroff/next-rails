const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

// Mapping from generate option types to TypeScript types
const typeMapping = {
  string: 'string',
  integer: 'number',
  boolean: 'boolean',
  date: 'Date',
  text: 'string',
  // TODO: Add other type mappings as needed
};

function generateModelCode(singularModelName, options) {
  // Begin constructing the model interface string
  let modelInterface = `export interface ${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} {\n`;
  modelInterface += '  id: string;\n'; // UUID

  // Add each option as a property on the interface
  options.forEach((option) => {
    const [name, type] = option.split(':');
    const tsType = typeMapping[type];
    if (!tsType) {
      throw new Error(`Unknown type '${type}' for option '${option}'`);
    }
    modelInterface += `  ${name}: ${tsType};\n`;
  });

  // Add created_at and updated_at properties
  modelInterface += '  created_at: Date;\n';
  modelInterface += '  updated_at: Date;\n';

  modelInterface += '}';

  return modelInterface;
}

function generateApiCode(singularModelName, pluralModelName) {
  return `
  import type { NextApiRequest, NextApiResponse } from 'next';
  import { getKnex } from '@deps/db';

  const knex = getKnex();

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, query: { id } } = req;

    switch (method) {
      case 'GET':
        if (id) {
          const ${singularModelName} = await knex('${pluralModelName}').where('id', id).first();
          res.status(200).json(${singularModelName});
        } else {
          const ${pluralModelName} = await knex('${pluralModelName}');
          res.status(200).json(${pluralModelName});
        }
        break;

      case 'POST':
        const new${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} = req.body;
        const [inserted${
          singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
        }] = await knex('${pluralModelName}').insert(new${
    singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
  }).returning('*');
        res.status(201).json(inserted${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)});
        break;

      case 'PUT':
      case 'PATCH':
        if (id) {
          const updated${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} = req.body;
          const [updatedEntry] = await knex('${pluralModelName}').where('id', id).update(updated${
    singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
  }).returning('*');
          res.status(200).json(updatedEntry);
        } else {
          res.status(400).json({message: 'Missing ID'});
        }
        break;

      case 'DELETE':
        if (id) {
          await knex('${pluralModelName}').where('id', id).del();
          res.status(200).json({message: \`${
            singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
          } with id \${id} deleted\`});
        } else {
          res.status(400).json({message: 'Missing ID'});
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).end(\`Method \${method} Not Allowed\`);
    }
  }`;
}

function generateMigrationCode(pluralModelName, options) {
  // Begin constructing the migration file string
  let migration = `exports.up = function (knex, Promise) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').createTable('${pluralModelName}', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));\n`;

  // Add each option as a column in the table
  options.forEach((option) => {
    const [name, type] = option.split(':');
    const migrationType = typeMapping[type];
    if (!migrationType) {
      throw new Error(`Unknown type '${type}' for option '${option}'`);
    }

    // Include special handling for boolean with defaultTo(false)
    if (type === 'boolean') {
      migration += `    table.${migrationType}('${name}').defaultTo(false);\n`;
    } else {
      migration += `    table.${migrationType}('${name}').notNullable();\n`;
    }
  });

  // Add created_at and updated_at columns
  migration += `    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('${pluralModelName}');
};`;

  return migration;
}

function writeStringToFile(string, filePath) {
  // Create the directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFile(filePath, string, (err) => {
    if (err) throw err;
    console.log(`File ${filePath} written successfully`);
  });
}

function generateCurrentTimestamp() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.T]/g, '')
    .split('.')[0]; // Current timestamp in the format YYYYMMDDHHMMSS
  return timestamp;
}

function generateModel(modelName, options) {
  const singularModelName = modelName.toLowerCase();

  // Generate model (src/db/models/${singularModelName}.ts) - Has the Typescript interface for the model
  const modelPath = path.join(
    process.cwd(),
    'src/db/models',
    `${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)}.ts`
  );
  writeStringToFile(generateModelCode(singularModelName, options), modelPath);
}

function generateScaffold(modelName, options) {
  const singularModelName = modelName.toLowerCase();
  const pluralModelName = pluralize(singularModelName); // Using the pluralize package to pluralize the model name

  // Generate model (src/db/models/${singularModelName}.ts) - Has the Typescript interface for the model
  generateModel(modelName, options);

  // Generate controller (pages/api/${pluralModelName}.ts)
  const controllerPath = path.join(process.cwd(), 'src/pages/api', `${pluralModelName}.ts`);
  writeStringToFile(generateApiCode(singularModelName, pluralModelName), controllerPath);

  // Generate migration (src/db/migrations/<timestamp>_create_${pluralModelName}.js)
  const timestamp = generateCurrentTimestamp(); // Current timestamp in the format YYYYMMDDHHMMSS
  const migrationPath = path.join(process.cwd(), 'src/db/migrations', `${timestamp}_create_${pluralModelName}.js`);
  writeStringToFile(generateMigrationCode(pluralModelName, options), migrationPath);
}

module.exports = {
  generateModel,
  generateScaffold,
  generateApiCode,
  generateModelCode,
  generateMigrationCode,
};
