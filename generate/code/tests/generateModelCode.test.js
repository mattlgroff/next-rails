const generateModelCode = require('../generateModelCode');
const { toPascalCase, toCamelCase } = require('../../../utils');

describe('generateModelCode', () => {
  it('should generate correct model code for a user', async () => {
    const singularModelName = 'user';
    const options = ['name:string', 'age:integer', 'isActive:boolean'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);
    const pascalSingularModelName = toPascalCase(singularModelName);

    expect(result).toContain(`export interface ${pascalSingularModelName} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('name: string;');
    expect(result).toContain('age: number;');
    expect(result).toContain('isActive: boolean;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${pascalSingularModelName}Metadata {`);
  });

  it('should generate correct model code for a Todo', async () => {
    const singularModelName = 'todo';
    const options = ['title:string', 'is_completed:boolean', 'user:references'];
    const dbType = 'pg';
    const primaryKeyType = 'integer';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);
    const pascalSingularModelName = toPascalCase(singularModelName);

    expect(result).toContain(`export interface ${pascalSingularModelName} {`);
    expect(result).toContain('id: number;');
    expect(result).toContain('title: string;');
    expect(result).toContain('is_completed: boolean;');
    expect(result).toContain('user_id: number;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${pascalSingularModelName}Metadata {`);

    // Let's also test the metadata
    expect(result).toContain(`export const ${singularModelName}Metadata: ${pascalSingularModelName}Metadata = {`);
    expect(result).toContain(`id: { label: 'ID' }`);
    expect(result).toContain(`title: { label: 'Title', inputType: 'text' }`);
    expect(result).toContain(`is_completed: { label: 'Is Completed', inputType: 'checkbox' }`);
    expect(result).toContain(`created_at: { label: 'Created At' }`);
    expect(result).toContain(`updated_at: { label: 'Updated At' }`);
  });

  it('should generate correct model code for a reference in CamelCase', async () => {
    const singularModelName = 'project';
    const options = ['title:string', 'isActive:boolean', 'UserProject:references'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);
    const pascalSingularModelName = toPascalCase(singularModelName);

    expect(result).toContain(`export interface ${pascalSingularModelName} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('title: string;');
    expect(result).toContain('isActive: boolean;');
    expect(result).toContain('user_project_id: string;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${pascalSingularModelName}Metadata {`);
  });

  it('should generate correct model code for a reference in snake_case', async () => {
    const singularModelName = 'project';
    const options = ['title:string', 'isActive:boolean', 'user_project:references'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);
    const pascalSingularModelName = toPascalCase(singularModelName);

    expect(result).toContain(`export interface ${pascalSingularModelName} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('title: string;');
    expect(result).toContain('isActive: boolean;');
    expect(result).toContain('user_project_id: string;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${pascalSingularModelName}Metadata {`);
  });

  it('should generate correct model code for a model name in snake_case', async () => {
    const singularModelName = 'user_profile';
    const options = ['username:string', 'age:integer', 'isActive:boolean', 'user:references'];
    const dbType = 'pg';
    const primaryKeyType = 'integer';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);
    const pascalSingularModelName = toPascalCase(singularModelName);
    const camelCaseSingularModelName = toCamelCase(singularModelName);

    expect(result).toContain(`export interface ${pascalSingularModelName} {`);
    expect(result).toContain('id: number;');
    expect(result).toContain('username: string;');
    expect(result).toContain('age: number;');
    expect(result).toContain('isActive: boolean;');
    expect(result).toContain('user_id: number;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${pascalSingularModelName}Metadata {`);

    // Let's also test the metadata
    expect(result).toContain(`export const ${camelCaseSingularModelName}Metadata: ${pascalSingularModelName}Metadata = {`);
    expect(result).toContain(`id: { label: 'ID' }`);
    expect(result).toContain(`username: { label: 'Username', inputType: 'text' }`);
    expect(result).toContain(`age: { label: 'Age', inputType: 'number' }`);
    expect(result).toContain(`isActive: { label: 'Is Active', inputType: 'checkbox' }`);
    expect(result).toContain(`user_id: { label: 'User Id', inputType: 'number' }`);
    expect(result).toContain(`created_at: { label: 'Created At' }`);
    expect(result).toContain(`updated_at: { label: 'Updated At' }`);
  });
});
