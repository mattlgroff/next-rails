const pluralize = require('pluralize');
const {
  generateCreateControllerCode,
  generateUpdateControllerCode,
  generateDestroyControllerCode,
  generateShowControllerCode,
  generateIndexControllerCode
} = require('../generateApiCode');
const { toPascalCase } = require('../../../utils');

describe('generateCreateControllerCode', () => {
  it('should generate correct create controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = pluralize(singularModelName)
    const pascalSingularModelName = toPascalCase(singularModelName);
    const result = await generateCreateControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getCachedDbInstanceIfExist
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getCachedDbInstanceIfExist } from '@/db';`);
    expect(result).toContain(`import ${pascalSingularModelName}Model, { ${pascalSingularModelName} } from '@/db/models/${singularModelName}';`);


    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${pascalSingularModelName} | { message: string };`);

    // Expect we create a new instance of the model
    expect(result).toContain(`const new${pascalSingularModelName}: ${pascalSingularModelName} = req.body;`);

    // Expect we use Objection to insert the new instance into the database
    expect(result).toContain(
      `const inserted${pascalSingularModelName} = await ${pascalSingularModelName}Model.query().insertAndFetch(new${pascalSingularModelName});`
    );
  });
});

describe('generateUpdateControllerCode', () => {
  it('should generate correct update controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = pluralize(singularModelName)
    const pascalSingularModelName = toPascalCase(singularModelName);
    const result = await generateUpdateControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getCachedDbInstanceIfExist
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getCachedDbInstanceIfExist } from '@/db';`);
    expect(result).toContain(`import ${pascalSingularModelName}Model, { ${pascalSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${pascalSingularModelName} | { message: string };`);

    // Expect we create a new instance of the model
    expect(result).toContain(`const updated${pascalSingularModelName}: ${pascalSingularModelName} = req.body;`);

    // Expect we retrieve the ID from the request query
    expect(result).toContain(`const id = req.query.id;`);

    // Expect we use knex to update the instance in the database
    expect(result).toContain(
      `const updatedEntry = await ${pascalSingularModelName}Model.query().patchAndFetchById(id, updated${pascalSingularModelName});`
    );

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ message: 'An unexpected error occurred.' });`);
  });
});

describe('generateDestroyControllerCode', () => {
  it('should generate correct destroy controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = pluralize(singularModelName)
    const pascalSingularModelName = toPascalCase(singularModelName);
    const result = await generateDestroyControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getCachedDbInstanceIfExist
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getCachedDbInstanceIfExist } from '@/db';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = { success: boolean, message: string };`);

    // Expect we check for DELETE method
    expect(result).toContain(`if (req.method !== 'DELETE')`);

    // Expect we retrieve the ID from the request query
    expect(result).toContain(`const id = req.query.id;`);

    // Expect we use knex to delete the instance from the database
    expect(result).toContain(`await ${pascalSingularModelName}Model.query().deleteById(id);`);

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });`);
  });
});

describe('generateShowControllerCode', () => {
  it('should generate correct show controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = pluralize(singularModelName)
    const pascalSingularModelName = toPascalCase(singularModelName);
    const result = await generateShowControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getCachedDbInstanceIfExist
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getCachedDbInstanceIfExist } from '@/db';`);
    expect(result).toContain(`import ${pascalSingularModelName}Model, { ${pascalSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${pascalSingularModelName} | { message: string };`);

    // Expect we check for GET method
    expect(result).toContain(`if (req.method !== 'GET')`);

    // Expect we retrieve the ID from the request query
    expect(result).toContain(`const id = req.query.id;`);

    // Expect we handle cases where the ID is not provided
    expect(result).toContain(`return res.status(400).json({ message: 'Missing ID' });`);

    // Expect we use knex to fetch the instance from the database
    expect(result).toContain(`const ${singularModelName} = await ${pascalSingularModelName}Model.query().findById(id);`);

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ message: 'An unexpected error occurred.' });`);
  });
});

describe('generateIndexControllerCode', () => {
  it('should generate correct index controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = pluralize(singularModelName)
    const pascalSingularModelName = toPascalCase(singularModelName);
    const result = await generateIndexControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getCachedDbInstanceIfExist
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getCachedDbInstanceIfExist } from '@/db';`);
    expect(result).toContain(`import ${pascalSingularModelName}Model, { ${pascalSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${pascalSingularModelName}[] | { message: string };`);

    // Expect we check for GET method
    expect(result).toContain(`if (req.method !== 'GET')`);

    // Expect we use knex to fetch all instances from the database
    expect(result).toContain(`const ${pluralModelName} = await ${pascalSingularModelName}Model.query();`);

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ message: 'An unexpected error occurred.' });`);

    // Expect we return the results
    expect(result).toContain(`return res.status(200).json(${pluralModelName});`);
  });
});
