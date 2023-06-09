const { join, resolve } = require('path');
const { execSync } = require('child_process');
const { readFileSync, copyFileSync, writeFileSync } = require('fs');

const initDependencies = (appPath) => {
  console.log('🚀 Installing additional dependencies...');

  // Install knex and PostgreSQL driver packages.
  const installCommand = 'npm install --save knex pg';
  execSync(installCommand, { cwd: appPath, stdio: 'inherit' });

  // Install Prettier, ESLint, Lint Staged, and Husky packages.
  const installDevCommand =
    'npm install --save-dev prettier prettier-plugin-tailwindcss eslint-config-prettier eslint-plugin-prettier @types/pg @typescript-eslint/eslint-plugin next-rails';
  execSync(installDevCommand, { cwd: appPath, stdio: 'inherit' });

  // TODO: Add husky and lint-staged and configure them as well

  console.log('📁 Copying over the ESLint configuration...');
  const srcEslintConfigPath = resolve(__dirname, './files-to-copy/.eslintrc.json');
  const destEslintConfigPath = join(appPath, '.eslintrc.json');
  copyFileSync(srcEslintConfigPath, destEslintConfigPath);

  console.log('📝 Copying over the Prettier configuration...');
  const srcPrettierConfigPath = resolve(__dirname, './files-to-copy/.prettierrc.js');
  const destPrettierConfigPath = join(appPath, '.prettierrc.js');
  copyFileSync(srcPrettierConfigPath, destPrettierConfigPath);

  console.log('⚙️ Copying over the Knex configuration...');
  const srcKnexConfigPath = resolve(__dirname, './files-to-copy/knexfile.js');
  const destKnexConfigPath = join(appPath, 'knexfile.js');
  copyFileSync(srcKnexConfigPath, destKnexConfigPath);

  console.log('📂 Creating src/db for knex...');
  const knexDirPath = join(appPath, 'src/db');
  execSync(`mkdir -p ${knexDirPath}`, { stdio: 'inherit' });

  console.log('📂 Creating src/db/migrations for knex...');
  const knexMigrationsDirPath = join(knexDirPath, 'migrations');
  execSync(`mkdir -p ${knexMigrationsDirPath}`, { stdio: 'inherit' });

  console.log('📂 Creating src/db/seeds for knex...');
  const knexSeedsDirPath = join(knexDirPath, 'seeds');
  execSync(`mkdir -p ${knexSeedsDirPath}`, { stdio: 'inherit' });

  console.log('📂 Creating src/db/models for knex...');
  const knexModelsDirPath = join(knexDirPath, 'models');
  execSync(`mkdir -p ${knexModelsDirPath}`, { stdio: 'inherit' });

  console.log('📋 Copying over the Knex index.js to src/db/index.js...');
  const srcKnexIndexPath = resolve(__dirname, './files-to-copy/index.js');
  const destKnexIndexPath = join(knexDirPath, 'index.js');
  copyFileSync(srcKnexIndexPath, destKnexIndexPath);

  console.log('🖌️ Copying over the globals.css default for TailwindCSS...');
  const srcGlobalsCssPath = resolve(__dirname, './files-to-copy/globals.css');
  const destGlobalsCssPath = join(appPath, 'src/styles/globals.css');
  copyFileSync(srcGlobalsCssPath, destGlobalsCssPath);

  console.log('🔧 Updating the start script in package.json...');
  const packageJsonPath = join(appPath, 'package.json');

  // Read package.json
  const data = readFileSync(packageJsonPath, { encoding: 'utf8' });

  // Parse the JSON
  const packageJson = JSON.parse(data);

  // Update the "start" script
  packageJson.scripts.start = 'npx next-rails db:migrate && next start';

  // Convert it back to a string
  const updatedPackageJson = JSON.stringify(packageJson, null, 2);

  // Write it back to package.json
  writeFileSync(packageJsonPath, updatedPackageJson, { encoding: 'utf8' });

  console.log('🚂 Done! Consider running `next-rails generate scaffold` to generate your first model.`');
};

module.exports = initDependencies;
