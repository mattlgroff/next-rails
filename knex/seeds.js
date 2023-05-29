const { exec } = require('child_process');

exports.generate = ({ name }) => {
  console.log(`Generating seed ${name}...`);
  exec(`npx --no-install knex seed:make ${name}`, (error, stdout, stderr) => {
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

exports.seed = () => {
  console.log('Running seed...');
  exec('npx --no-install knex seed:run', (error, stdout, stderr) => {
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
