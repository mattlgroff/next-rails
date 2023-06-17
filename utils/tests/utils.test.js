const { generateCurrentTimestamp, toPascalCase, toSnakeCase, toTitleCase, toCamelCase } = require('../index');

describe('generateCurrentTimestamp', () => {
  it('should generate a timestamp in the format YYYYMMDDHHMMSS', () => {
    const timestamp = generateCurrentTimestamp();
    
    // The length should be 14 (4 for the year, 2 for the month, 2 for the day, 2 for the hour, 2 for the minutes, and 2 for the secods)
    expect(timestamp.length).toEqual(14);
    
    // It should be a valid number
    expect(Number.isNaN(Number(timestamp))).toBe(false);
  });
});

describe('toPascalCase', () => {
  it('should convert strings to PascalCase', () => {
    expect(toPascalCase('multiple_words')).toEqual('MultipleWords');
    expect(toPascalCase('MultipleWords')).toEqual('MultipleWords');
    expect(toPascalCase('multiple words')).toEqual('MultipleWords');
    expect(toPascalCase('multiple-words')).toEqual('MultipleWords');
    expect(toPascalCase('multiple.words')).toEqual('MultipleWords');
    expect(toPascalCase('_multiple_words')).toEqual('MultipleWords');
  });
});

describe('toTitleCase', () => {
  it('should convert strings to Title Case', () => {
    expect(toTitleCase('MultipleWords')).toEqual('Multiple Words');
    expect(toTitleCase('multiple words')).toEqual('Multiple Words');
    expect(toTitleCase('multiple-words')).toEqual('Multiple Words');
    expect(toTitleCase('multiple.words')).toEqual('Multiple Words');
    expect(toTitleCase('_multiple_words')).toEqual(' Multiple Words');
    expect(toTitleCase('IsActive')).toEqual('Is Active');
  });
});

describe('toSnakeCase', () => {
  it('should convert strings to snake_case', () => {
    expect(toSnakeCase('MultipleWords')).toEqual('multiple_words');
    expect(toSnakeCase('multipleWords')).toEqual('multiple_words');
    expect(toSnakeCase('Multiple Words')).toEqual('multiple_words');
    expect(toSnakeCase('multiple words')).toEqual('multiple_words');
    expect(toSnakeCase('multiple-words')).toEqual('multiple_words');
    expect(toSnakeCase('multiple.words')).toEqual('multiple_words');
    expect(toSnakeCase('multiple_words')).toEqual('multiple_words');
    expect(toSnakeCase('_MultipleWords_')).toEqual('multiple_words');
  });
});

describe('toCamelCase', () => {
  it('should convert strings to camelCase', () => {
    expect(toCamelCase('MultipleWords')).toEqual('multipleWords');
    expect(toCamelCase('Resource')).toEqual('resource');
    expect(toCamelCase('multipleWords')).toEqual('multipleWords');
    expect(toCamelCase('multiple_words')).toEqual('multipleWords');
  });
});
