const {
  generateCreateControllerCode,
  generateUpdateControllerCode,
  generateDestroyControllerCode,
  generateShowControllerCode,
  generateIndexControllerCode
} = require('../generateApiCode');

describe('generateCreateControllerCode', () => {
  it('should generate correct create controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const capitalizedSingularModelName = 'User';
    const result = await generateCreateControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getKnex
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getKnex } from '@/db';`);
    expect(result).toContain(`import { ${capitalizedSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${capitalizedSingularModelName} | { message: string };`);

    // Expect we create a new instance of the model
    expect(result).toContain(`const new${capitalizedSingularModelName}: ${capitalizedSingularModelName} = req.body;`);

    // Expect we use knex to insert the new instance into the database
    expect(result).toContain(
      `const [inserted${capitalizedSingularModelName}] = await knex('${pluralModelName}').insert(new${capitalizedSingularModelName}).returning('*');`
    );
  });
});

describe('generateUpdateControllerCode', () => {
  it('should generate correct update controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const capitalizedSingularModelName = 'User';
    const result = await generateUpdateControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getKnex
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getKnex } from '@/db';`);
    expect(result).toContain(`import { ${capitalizedSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${capitalizedSingularModelName} | { message: string };`);

    // Expect we create a new instance of the model
    expect(result).toContain(`const updated${capitalizedSingularModelName}: ${capitalizedSingularModelName} = req.body;`);

    // Expect we retrieve the ID from the request query
    expect(result).toContain(`const id = req.query.id;`);

    // Expect we use knex to update the instance in the database
    expect(result).toContain(
      `const [updatedEntry] = await knex('${pluralModelName}').where('id', id).update(updated${capitalizedSingularModelName}).returning('*');`
    );

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ message: 'An unexpected error occurred.' });`);
  });
});

describe('generateDestroyControllerCode', () => {
  it('should generate correct destroy controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const result = await generateDestroyControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getKnex
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getKnex } from '@/db';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = { success: boolean, message: string };`);

    // Expect we check for DELETE method
    expect(result).toContain(`if (req.method !== 'DELETE')`);

    // Expect we retrieve the ID from the request query
    expect(result).toContain(`const id = req.query.id;`);

    // Expect we use knex to delete the instance from the database
    expect(result).toContain(`const deleteCount = await knex('${pluralModelName}').where('id', id).del();`);

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });`);
  });
});

describe('generateShowControllerCode', () => {
  it('should generate correct show controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const capitalizedSingularModelName = 'User';
    const result = await generateShowControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getKnex
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getKnex } from '@/db';`);
    expect(result).toContain(`import { ${capitalizedSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${capitalizedSingularModelName} | { message: string };`);

    // Expect we check for GET method
    expect(result).toContain(`if (req.method !== 'GET')`);

    // Expect we retrieve the ID from the request query
    expect(result).toContain(`const id = req.query.id;`);

    // Expect we handle cases where the ID is not provided
    expect(result).toContain(`return res.status(400).json({ message: 'Missing ID' });`);

    // Expect we use knex to fetch the instance from the database
    expect(result).toContain(`const ${singularModelName} = await knex('${pluralModelName}').where('id', id).first();`);

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ message: 'An unexpected error occurred.' });`);
  });
});

describe('generateIndexControllerCode', () => {
  it('should generate correct index controller code', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const capitalizedSingularModelName = 'User';
    const result = await generateIndexControllerCode(singularModelName, pluralModelName);

    // Expect we import the types and getKnex
    expect(result).toContain(`import type { NextApiRequest, NextApiResponse } from 'next';`);
    expect(result).toContain(`import { getKnex } from '@/db';`);
    expect(result).toContain(`import { ${capitalizedSingularModelName} } from '@/db/models/${singularModelName}';`);

    // Expect we define the ResponseType
    expect(result).toContain(`type ResponseType = ${capitalizedSingularModelName}[] | { message: string };`);

    // Expect we check for GET method
    expect(result).toContain(`if (req.method !== 'GET')`);

    // Expect we use knex to fetch all instances from the database
    expect(result).toContain(`const ${pluralModelName} = await knex('${pluralModelName}').select('*');`);

    // Expect we handle possible errors
    expect(result).toContain(`return res.status(500).json({ message: 'An unexpected error occurred.' });`);

    // Expect we return the results
    expect(result).toContain(`return res.status(200).json(${pluralModelName});`);
  });
});
