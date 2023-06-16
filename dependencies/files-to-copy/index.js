import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile.js';

const db = knex(config);

Model.knex(db);
/**
 * Global is used here to ensure the connection
 * is cached across hot-reloads in development
 *
 * see https://github.com/vercel/next.js/discussions/12229#discussioncomment-83372
 */
let cached = global.pg;
if (!cached) cached = global.pg = {};

export function getCachedDbInstanceIfExist() {
    if (!cached.instance) cached.instance = db;
    return cached.instance;
}

// Deprecated, moving to Objection. Still supporting for now until all knex queries are converted to Objection.
export function getKnex() {
  if (!cached.instance) cached.instance = knex(config)
  return cached.instance
}