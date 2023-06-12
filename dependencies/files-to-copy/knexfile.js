/* eslint-disable @typescript-eslint/no-var-requires */
const { loadEnvConfig } = require('@next/env')
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production'
const { DATABASE_URL } = loadEnvConfig('./', dev).combinedEnv

let nextRailsConfig = {};
if (fs.existsSync(path.resolve(__dirname, './next-rails.config.json'))) {
  nextRailsConfig = require('./next-rails.config.json');
}

module.exports = {
  client: nextRailsConfig.dbType || 'pg',
  connection: DATABASE_URL,
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
}
