const generateMigrationCode = require('../generateMigrationCode');

// Remove extra whitespace and newlines from a string
const formatString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

describe('generateMigrationCode', () => {
  it('should generate correct migration code with references', async () => {
    const pluralModelName = 'users';
    const options = ['name:string', 'age:integer', 'isActive:boolean', 'embedding:vector' , 'user:references'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = formatString(await generateMigrationCode(pluralModelName, options, dbType, primaryKeyType));

    // Add your assertions here
    expect(result).toContain(
      `return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; CREATE EXTENSION IF NOT EXISTS \"vector\";').createTable('users', function (table`
    );
    expect(result).toContain(`table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));`);
    expect(result).toContain(`table.specificType('embedding', 'vector(1536)');`);
    expect(result).toContain(`table.foreign('user_id').references('id').inTable('users');`);
    expect(result).toContain(`table.timestamp('created_at').defaultTo(knex.fn.now());`);
    expect(result).toContain(`table.timestamp('updated_at').defaultTo(knex.fn.now());`);
    expect(result).toContain(`knex.schema.dropTable('${pluralModelName}');`);
  });

  it('should generate correct migration code with belongs_to', async () => {
    const pluralModelName = 'posts';
    const options = ['title:string', 'content:text', 'user:belongs_to'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = formatString(await generateMigrationCode(pluralModelName, options, dbType, primaryKeyType));

    expect(result).toContain(`table.uuid('user_id');`);
    expect(result).toContain(`table.foreign('user_id').references('id').inTable('users');`);
  });

  it('should generate correct migration code with integer primary key', async () => {
    const pluralModelName = 'comments';
    const options = ['content:text', 'post:belongs_to'];
    const dbType = 'pg';
    const primaryKeyType = 'integer';
    const result = formatString(await generateMigrationCode(pluralModelName, options, dbType, primaryKeyType));

    expect(result).toContain(`table.increments('id');`);
    expect(result).toContain(`table.integer('post_id');`);
    expect(result).toContain(`table.foreign('post_id').references('id').inTable('posts');`);
  });

  it('should generate correct migration code with CamelCase references', async () => {
    const pluralModelName = 'userProfiles';
    const options = ['firstName:string', 'lastName:string', 'MultipleWords:references'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = formatString(await generateMigrationCode(pluralModelName, options, dbType, primaryKeyType));
  
    expect(result).toContain(`table.uuid('multiple_words_id');`);
    expect(result).toContain(`table.foreign('multiple_words_id').references('id').inTable('multiple_words');`);
  });
  
  it('should generate correct migration code with snake_case references', async () => {
    const pluralModelName = 'user_profiles';
    const options = ['first_name:string', 'last_name:string', 'multiple_words:references'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = formatString(await generateMigrationCode(pluralModelName, options, dbType, primaryKeyType));
  
    expect(result).toContain(`table.uuid('multiple_words_id');`);
    expect(result).toContain(`table.foreign('multiple_words_id').references('id').inTable('multiple_words');`);
  });
  
});
