const { exec } = require('child_process');

exports.generate = ({ name }) => {
  console.log(`Generating migration ${name}...`);
  exec(`npx --no-install knex-next-rails migrate:make ${name}`, (error, stdout, stderr) => {
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
  exec('npx --no-install knex-next-rails migrate:latest', (error, stdout, stderr) => {
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

exports.reset = () => {
  console.log('Resetting database...');
  exec('npx --no-install knex-next-rails db:drop_tables', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }

    console.log('Migrating database...');

    // Trigger migrate after dropping tables
    exec('npx --no-install knex-next-rails migrate:latest', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }

      console.log('Seeding database...');

      // Trigger seed after migrating
      exec('npx --no-install knex-next-rails seed:run', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }

        console.log('Database reset complete!');
      });
    });
  });
};

exports.up = () => {
  console.log('Running next migration...');
  exec('npx --no-install knex-next-rails migrate:up', (error, stdout, stderr) => {
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
  exec('npx --no-install knex-next-rails migrate:down', (error, stdout, stderr) => {
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
  exec('npx --no-install knex-next-rails migrate:status', (error, stdout, stderr) => {
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
