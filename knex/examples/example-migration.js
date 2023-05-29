// 1. Empty Migration

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};

// 2. Create Table or Drop Table (with uuid-ossp extension)
exports.up = function (knex, Promise) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').createTable('users', function (table) {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};

// 3. Add Column or Drop Column
exports.up = function (knex, Promise) {
  knex.schema.table('users', function (table) {
    table.integer('fullname').notNull();
  });
};

exports.down = function (knex, Promise) {
  knex.schema.table('users', function (table) {
    table.dropColumn('fullname');
  });
};

// 3. Create Todos Table
exports.up = function (knex, Promise) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').createTable('todos', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('todos');
};
