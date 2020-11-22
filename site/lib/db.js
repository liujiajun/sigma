const pgp = require('pg-promise')();

const user = 'postgres'
const password = 'postgres'
const host = 'localhost'
const port = 5432
const database = 'postgres'

const DB_KEY = Symbol.for("Sigma.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = (globalSymbols.indexOf(DB_KEY) > -1);
if (!hasDb) {
  global[DB_KEY] = pgp(`postgres://${user}:${password}@${host}:${port}/${database}`);
}

const singleton = {};
Object.defineProperty(singleton, "instance", {
  get: function () {
    return global[DB_KEY];
  }
});
Object.freeze(singleton);

module.exports = singleton;
