const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


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
    execSync('npx --no-install prettier --write ./src');
  });
}

function generateCurrentTimestamp() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.T]/g, '')
    .slice(0, -4); // Current timestamp in the format YYYYMMDDHHMMSS
  return timestamp;
}

module.exports = {
  writeStringToFile,
  generateCurrentTimestamp,
};