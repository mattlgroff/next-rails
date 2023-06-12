const generateModelCode = require('../generateModelCode');

describe('generateModelCode', () => {
  it('should generate correct model code for a user', async () => {
    const singularModelName = 'user';
    const options = ['name:string', 'age:integer', 'isActive:boolean'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);
    const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

    expect(result).toContain(`export interface ${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('name: string;');
    expect(result).toContain('age: number;');
    expect(result).toContain('isActive: boolean;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${modelName}Metadata {`);
  });

  it('should generate correct model code for a Todo', async () => {
    const singularModelName = 'todo';
    const options = ['title:string', 'is_completed:boolean', 'user:references'];
    const dbType = 'pg';
    const primaryKeyType = 'integer';
    const result = await generateModelCode(singularModelName, options, dbType, primaryKeyType);

    const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

    expect(result).toContain(`export interface ${modelName} {`);
    expect(result).toContain('id: number;');
    expect(result).toContain('title: string;');
    expect(result).toContain('is_completed: boolean;');
    expect(result).toContain('user_id: number;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${modelName}Metadata {`);

    // Let's also test the metadata
    expect(result).toContain(`export const ${singularModelName}Metadata: ${modelName}Metadata = {`);
    expect(result).toContain(`id: { label: 'ID' }`);
    expect(result).toContain(`title: { label: 'Title', inputType: 'text' }`);
    expect(result).toContain(`is_completed: { label: 'Is Completed', inputType: 'checkbox' }`);
    expect(result).toContain(`created_at: { label: 'Created At' }`);
    expect(result).toContain(`updated_at: { label: 'Updated At' }`);
  });
});
