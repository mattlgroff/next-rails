const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readlineSync = require('readline-sync');

function writeStringToFile(string, filePath) {
  // Create the directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    console.log('📁 Creating directory...');
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFile(filePath, string, (err) => {
    if (err) throw err;
    console.log(`✅ File ${filePath} written successfully`);

    // Prettier formatting
    execSync(`npx --no-install prettier --write ${filePath}`);
  });
}

function generateCurrentTimestamp() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.T]/g, '')
    .slice(0, -4); // Current timestamp in the format YYYYMMDDHHMMSS
  return timestamp;
}

function generateTypeMapping(dbType = 'pg', primaryKeyType = 'integer') {
  // Check if dbType is supported
  const supportedDbTypes = ['pg'];
  if (!supportedDbTypes.includes(dbType)) {
    throw new Error(`dbType "${dbType}" is not supported. Supported dbTypes are: ${supportedDbTypes.join(', ')}`);
  }

  // Check if primaryKeyType is supported
  const supportedPrimaryKeyTypes = ['uuid', 'integer'];
  if (!supportedPrimaryKeyTypes.includes(primaryKeyType)) {
    throw new Error(`primaryKeyType "${primaryKeyType}" is not supported. Supported primaryKeyTypes are: ${supportedPrimaryKeyTypes.join(', ')}`);
  }

  // Generate type mapping
  switch(dbType) {
    case 'pg':
    default:
      return {
        string: { ts: 'string', db_column: 'varchar(255)' },
        text: { ts: 'string', db_column: 'text' },
        integer: { ts: 'number', db_column: 'integer' },
        float: { ts: 'number', db_column: 'float' },
        decimal: { ts: 'number', db_column: 'decimal' },
        datetime: { ts: 'Date', db_column: 'timestamp' },
        timestamp: { ts: 'Date', db_column: 'timestamp' },
        time: { ts: 'string', db_column: 'time' },
        date: { ts: 'Date', db_column: 'date' },
        binary: { ts: 'Buffer', db_column: 'bytea' },
        boolean: { ts: 'boolean', db_column: 'boolean' },
        vector: { ts: 'number[]', db_column: 'vector(1536)' }, // Supported only with PGVector extension
        references: { ts: primaryKeyType === 'uuid' ? 'string' : 'number', db_column: primaryKeyType === 'uuid' ? 'uuid' : 'integer' },
        belongs_to: { ts: primaryKeyType === 'uuid' ? 'string' : 'number', db_column: primaryKeyType === 'uuid' ? 'uuid' : 'integer' },
      }
  }
}

function getNextRailsConfig() {
  let dbType = 'pg';  // Default to pg, since that's what we're using for now.
  let primaryKeyType = 'integer'; // Default to integer, since that's the Rails way.

  const nextRailsConfigPath = path.join(process.cwd(), 'next-rails.config.json');

  try {
    const nextRailsConfig = JSON.parse(fs.readFileSync(nextRailsConfigPath, 'utf8'));
    dbType = nextRailsConfig.dbType;
    primaryKeyType = nextRailsConfig.primaryKeyType;
  } catch (error) {
    // If it doesn't exist, we should prompt the user for the primaryKeyType and dbType.
    console.log("next-rails.config.json does not exist, we're going to make one now.");
    console.log('What type of primary key are you using?');
    console.log('Choices are: uuid, integer');
    primaryKeyType = readlineSync.question('primaryKeyType: ');

    if(primaryKeyType !== 'uuid' && primaryKeyType !== 'integer') {
      console.error('primaryKeyType must be either uuid or integer.');
      process.exit(1);
    }

    // Assume pg for now, which is already defaulted.
    // Now write the next-rails.config.json file, inside a try catch:
    try {
      const nextRailsConfig = { dbType, primaryKeyType };
      fs.writeFileSync(nextRailsConfigPath, JSON.stringify(nextRailsConfig, null, 2));
      console.log('✅ next-rails.config.json file written successfully.');
    } catch (error) {
      console.error(error);
      console.log('Error writing next-rails.config.json file.');
    }
  }

  return { dbType, primaryKeyType };
}


module.exports = {
  writeStringToFile,
  generateCurrentTimestamp,
  generateTypeMapping,
  getNextRailsConfig,
};