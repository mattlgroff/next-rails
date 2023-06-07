const generateApiCode = require('../generateApiCode');

describe('generateApiCode', () => {
  it('should generate correct api code', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const result = await generateApiCode(singularModelName, pluralModelName);

    // Expect we import the types and getKnex
    expect(result).toContain(
      `import type { NextApiRequest, NextApiResponse } from 'next';`
    );
    expect(result).toContain(`import { getKnex } from '@deps/db';`);

    // Check GET method
    expect(result).toContain(`case 'GET':`);
    expect(result).toContain(`const ${singularModelName} = await knex('${pluralModelName}').where('id', id).first();`);
    expect(result).toContain(`res.status(200).json(${singularModelName});`);
    expect(result).toContain(`const ${pluralModelName} = await knex('${pluralModelName}');`);
    expect(result).toContain(`res.status(200).json(${pluralModelName});`);

    // Check POST method
    expect(result).toContain(`case 'POST':`);
    expect(result).toContain(`const new${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} = req.body;`);
    expect(result).toContain(
      `const [inserted${
        singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
      }] = await knex('${pluralModelName}').insert(new${
        singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
      }).returning('*');`
    );
    expect(result).toContain(`res.status(201).json(inserted${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)});`);

    // Check PUT/PATCH method
    expect(result).toContain(`case 'PUT':`);
    expect(result).toContain(`const updated${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} = req.body;`);
    expect(result).toContain(
      `const [updatedEntry] = await knex('${pluralModelName}').where('id', id).update(updated${
        singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
      }).returning('*');`
    );
    expect(result).toContain(`res.status(200).json(updatedEntry);`);

    // Check DELETE method
    expect(result).toContain(`case 'DELETE':`);
    expect(result).toContain(`await knex('${pluralModelName}').where('id', id).del();`);
    expect(result).toContain(
      `res.status(200).json({message: \`${
        singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)
      } with id \${id} deleted\`});`
    );

    // Check default case
    expect(result).toContain(`default:`);
    expect(result).toContain(`res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);`);
    expect(result).toContain(`res.status(405).end(\`Method \${method} Not Allowed\`);`);
  });
});