// tests/generateApiCode.test.js
const { generateApiCode } = require('../index');

describe('generateApiCode', () => {
  it('should generate correct api code', () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const result = generateApiCode(singularModelName, pluralModelName);

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

/* 
We can do an assert for each HTTP Methods. We need to be thorough here.
Expect that the generated code contains the following if the model name is Todo:

import type { NextApiRequest, NextApiResponse } from 'next';
import { getKnex } from '@deps/db';
import { Todo } from '@deps/db/models/Todo'; // Code-gen will make this file with this import for you

const knex = getKnex();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req;

  switch (method) {
    case 'GET': 
      if (id) {
        const todo = await knex('todos').where('id', id).first();
        res.status(200).json(todo);
      } else {
        const todos = await knex('todos');
        res.status(200).json(todos);
      }
      break;

    case 'POST':
      const newTodo = req.body as Todo;
      const [insertedTodo] = await knex('todos').insert(newTodo).returning('*');
      res.status(201).json(insertedTodo);
      break;

    case 'PUT':
    case 'PATCH':
      if (id) {
        const updatedTodo = req.body as Partial<Todo>;
        const [updatedEntry] = await knex('todos').where('id', id).update(updatedTodo).returning('*');
        res.status(200).json(updatedEntry);
      } else {
        res.status(400).json({message: 'Missing ID'});
      }
      break;

    case 'DELETE':
      if (id) {
        await knex('todos').where('id', id).del();
        res.status(200).json({message: `Todo with id ${id} deleted`});
      } else {
        res.status(400).json({message: 'Missing ID'});
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

*/
