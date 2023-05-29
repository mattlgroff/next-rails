const { generateModelCode } = require('../index');

describe('generateModelCode', () => {
  it('should generate correct model code for a user', () => {
    const singularModelName = 'user';
    const options = ['name:string', 'age:integer', 'isActive:boolean'];
    const result = generateModelCode(singularModelName, options);
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

  it('should generate correct model code for a Todo', () => {
    const singularModelName = 'todo';
    const options = ['title:string', 'is_completed:boolean'];
    const result = generateModelCode(singularModelName, options);

    const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

    expect(result).toContain(`export interface ${modelName} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('title: string;');
    expect(result).toContain('is_completed: boolean;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain(`export interface ${modelName}Metadata {`);

    // Let's also test the metadata
    expect(result).toContain(`export const ${singularModelName}Metadata: ${modelName}Metadata = {`);
    expect(result).toContain(`id: { label: 'ID', display: (value: string) => value }`);
    expect(result).toContain(`title: { label: 'Title', display: (value: string) => value }`);
    expect(result).toContain(`is_completed: { label: 'Is Completed', display: (value: boolean) => value ? "Yes" : "No" }`);
    expect(result).toContain(`created_at: { label: 'Created At', display: (value: Date) => value?.toLocaleString() || "" }`);
    expect(result).toContain(`updated_at: { label: 'Updated At', display: (value: Date) => value?.toLocaleString() || "" }`);
  });
});