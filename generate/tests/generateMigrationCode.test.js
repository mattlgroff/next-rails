// tests/generateMigrationCode.test.js
const { generateMigrationCode } = require('../index');

describe('generateMigrationCode', () => {
  it('should generate correct migration code', () => {
    const pluralModelName = 'users';
    const options = ['name:string', 'age:integer', 'isActive:boolean'];
    const result = generateMigrationCode(pluralModelName, options);

    // Add your assertions here
    expect(result).toContain(
      `return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').createTable('${pluralModelName}', function (table) {`
    );
    expect(result).toContain(`table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));`);
    expect(result).toContain(`table.timestamp('created_at').defaultTo(knex.fn.now());`);
    expect(result).toContain(`table.timestamp('updated_at').defaultTo(knex.fn.now());`);
    expect(result).toContain(`knex.schema.dropTable('${pluralModelName}');`);
  });

  it('should generate correct migration code for todos', () => {
    const pluralModelName = 'todos';
    const options = ['title:string', 'is_completed:boolean'];
    const result = generateMigrationCode(pluralModelName, options);

    // Expected output
    const expectedOutput = `exports.up = function (knex, Promise) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').createTable('${pluralModelName}', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('${pluralModelName}');
};`;

    // Expect we get this exact migration for todos as requested
    expect(result).toBe(expectedOutput);
  });
});
