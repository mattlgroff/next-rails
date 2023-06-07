const generateMigrationCode = require('../generateMigrationCode');

// Remove extra whitespace and newlines from a string
const formatString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

describe('generateMigrationCode', () => {
  it('should generate correct migration code', async () => {
    const pluralModelName = 'users';
    const options = ['name:string', 'age:integer', 'isActive:boolean', 'embedding:vector'];
    const result = formatString(await generateMigrationCode(pluralModelName, options));

    // Add your assertions here
    expect(result).toContain(
      `return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; CREATE EXTENSION IF NOT EXISTS \"vector\";').createTable('users', function (table`
    );
    expect(result).toContain(`table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));`);
    expect(result).toContain(`table.specificType('embedding', 'vector(1536)');`);
    expect(result).toContain(`table.timestamp('created_at').defaultTo(knex.fn.now());`);
    expect(result).toContain(`table.timestamp('updated_at').defaultTo(knex.fn.now());`);
    expect(result).toContain(`knex.schema.dropTable('${pluralModelName}');`);
  });

  it('should generate correct migration code for todos', async () => {
    const pluralModelName = 'todos';
    const options = ['title:string', 'is_completed:boolean'];
    const result = formatString(await generateMigrationCode(pluralModelName, options));

    // Expected output
    const expectedOutput = `exports.up = function (knex, Promise) { return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').createTable('todos', function (table) { table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); table.string('title').notNullable(); table.boolean('is_completed').defaultTo(false); table.timestamp('created_at').defaultTo(knex.fn.now()); table.timestamp('updated_at').defaultTo(knex.fn.now()); }); }; exports.down = function (knex, Promise) { return knex.schema.dropTable('todos'); };`;

    // Expect we get this exact migration for todos as requested
    expect(result).toBe(expectedOutput);
  });
});
