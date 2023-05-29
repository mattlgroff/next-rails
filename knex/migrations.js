const { exec } = require('child_process');

exports.generate = ({ name }) => {
  console.log(`Generating migration ${name}...`);
  exec(`npx --no-install knex migrate:make ${name}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
};

exports.migrate = () => {
  console.log('Running migrations...');
  exec('npx --no-install knex migrate:latest', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
};

exports.up = () => {
  console.log('Running next migration...');
  exec('npx --no-install knex migrate:up', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
};

exports.down = () => {
  console.log('Rolling back last migration...');
  exec('npx --no-install knex migrate:down', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
};

exports.status = () => {
  console.log('Checking migration status...');
  exec('npx --no-install knex migrate:status', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
};
