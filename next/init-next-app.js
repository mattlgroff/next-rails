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

  // Copy docker-compose.yml
  console.log('Copying over docker-compose.yml...');
  const srcDockerComposePath = resolve(__dirname, './files-to-copy/docker-compose.yml');
  const destDockerComposePath = join(appPath, 'docker-compose.yml');
  copyFileSync(srcDockerComposePath, destDockerComposePath);

  // Copy Dockerfile.nextjs
  console.log('Copying over Dockerfile.nextjs...');
  const srcDockerfileNextjsPath = resolve(__dirname, './files-to-copy/Dockerfile.nextjs');
  const destDockerfileNextjsPath = join(appPath, 'Dockerfile.nextjs');
  copyFileSync(srcDockerfileNextjsPath, destDockerfileNextjsPath);

  // Copy Dockerfile.postgres
  console.log('Copying over Dockerfile.postgres...');
  const srcDockerfilePostgresPath = resolve(__dirname, './files-to-copy/Dockerfile.postgres');
  const destDockerfilePostgresPath = join(appPath, 'Dockerfile.postgres');
  copyFileSync(srcDockerfilePostgresPath, destDockerfilePostgresPath);

  // Copy env.local to .env.local
  console.log('Copying over and renaming env.local to .env.local...');
  const srcEnvLocalPath = resolve(__dirname, './files-to-copy/env.local');
  const destEnvLocalPath = join(appPath, '.env.local');
  copyFileSync(srcEnvLocalPath, destEnvLocalPath);

  // After Next.js app creation and copying README.md, initialize additional dependencies (Sequelize, Prettier, etc).
  initDependencies(appPath);
};

module.exports = initNextApp;
