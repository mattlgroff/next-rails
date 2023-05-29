// tests/generateModelCode.test.js
const { generateModelCode } = require('../index');

describe('generateModelCode', () => {
  it('should generate correct model code for a user', () => {
    const singularModelName = 'user';
    const options = ['name:string', 'age:integer', 'isActive:boolean'];
    const result = generateModelCode(singularModelName, options);

    expect(result).toContain(`export interface ${singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1)} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('name: string;');
    expect(result).toContain('age: number;');
    expect(result).toContain('isActive: boolean;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
  });

  it('should generate correct model code for a Todo', () => {
    const singularModelName = 'todo';
    const options = ['title:string', 'is_completed:boolean'];
    const result = generateModelCode(singularModelName, options);

    // Add your assertions here
    const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);

    expect(result).toContain(`export interface ${modelName} {`);
    expect(result).toContain('id: string;');
    expect(result).toContain('title: string;');
    expect(result).toContain('is_completed: boolean;');
    expect(result).toContain('created_at: Date;');
    expect(result).toContain('updated_at: Date;');
    expect(result).toContain('}');
  });
});