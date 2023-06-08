// Mapping from generate option types to TypeScript types
const typeMapping = {
  string: 'string',
  integer: 'number',
  boolean: 'boolean',
  date: 'Date',
  text: 'string',
  vector: 'number[]',
  references: 'uuid',
  // TODO: Add other type mappings as needed
};

module.exports = {
  typeMapping,
}