const { exec } = require('child_process');

exports.generate = ({ name }) => {
  console.log(`Generating migration ${name}...`);
  exec(`npx knex-next-rails migrate:make ${name}`, (error, stdout, stderr) => {
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
  exec('npx knex-next-rails migrate:latest', (error, stdout, stderr) => {
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

    console.log('Updating schema.json...');
    exec('npx knex-next-rails db:schema_dump', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }
      console.log('Migrations complete!');
    });
  });
};

exports.reset = () => {
  console.log('Resetting database...');
  exec('npx knex-next-rails db:drop_tables', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }

    console.log('Migrating database...');

    // Trigger migrate after dropping tables
    exec('npx knex-next-rails migrate:latest', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }

      console.log('Updating schema.json...');
      exec('npx knex-next-rails db:schema_dump', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
      });

      console.log('Seeding database...');

      // Trigger seed after migrating
      exec('npx knex-next-rails seed:run', (error, stdout, stderr) => {
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
  exec('npx knex-next-rails migrate:up', (error, stdout, stderr) => {
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

    console.log('Updating schema.json...');
    exec('npx knex-next-rails@latest db:schema_dump', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }

      console.log('Migration complete!');
    });
  });
};

exports.down = () => {
  console.log('Rolling back last migration...');
  exec('npx knex-next-rails migrate:down', (error, stdout, stderr) => {
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

    console.log('Updating schema.json...');
    exec('npx knex-next-rails@latest db:schema_dump', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }

      console.log('Migration down complete!');
    });
  });
};

exports.status = () => {
  console.log('Checking migration status...');
  exec('npx knex-next-rails migrate:status', (error, stdout, stderr) => {
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

exports.schemaDump = () => {
  console.log('Updating schema.json...');
  exec('npx knex-next-rails@latest db:schema_dump', (error, stdout, stderr) => {
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
