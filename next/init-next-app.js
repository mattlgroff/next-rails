const { execSync } = require('child_process');
const { join, resolve } = require('path');
const { existsSync, copyFileSync } = require('fs');
const initDependencies = require('../dependencies/init-dependencies');

const initNextApp = (appDir) => {
  // Get the full path of the directory
  const appPath = join(process.cwd(), appDir);

  // Check if the directory already exists, if it does, exit
  if (existsSync(appPath)) {
    console.log(`Directory ${appPath} already exists.`);
    process.exit(1);
  }

  // TODO: Add support for passing in arguments to create-next-app, for now it's whatever is in defaultArguments
  const defaultArguments = ['--ts', '--eslint', '--no-app', '--use-npm', '--src-dir', '--import-alias "@deps/*"', '--tailwind'];

  // Run create-next-app with the arguments passed in from the command line and defaultArguments
  const initCommand = `npx --no-install create-next-app ${appDir} ${defaultArguments.join(' ')}`;

  console.log(`Creating Next.js app with the following command: ${initCommand}`);
  execSync(`echo | ${initCommand}`, { stdio: 'inherit' }); // echo | is a hack to get around a bug in create-next-app where is still prompts for the /app directory

  // Copy the README.md
  console.log('Copying over the new README...');
  const srcReadmePath = resolve(__dirname, './files-to-copy/README.md');
  const destReadmePath = join(appPath, 'README.md');
  copyFileSync(srcReadmePath, destReadmePath);

  // After Next.js app creation and copying README.md, initialize additional dependencies (Sequelize, Prettier, etc).
  initDependencies(appPath);
};

module.exports = initNextApp;
