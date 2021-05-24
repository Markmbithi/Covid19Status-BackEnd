const sql = require('mssql');
const config = require('../config');
const logger = require('../logger');

const poolCovidPromise = new sql.ConnectionPool(config.sqlconfig)
  .connect()
  .then(pool => {
    logger.info('Connected to COVID MSSQL');
    return pool;
  })
  .catch(err => logger.error(`Database Connection Failed! Error: ${err}`));

module.exports = {
  sql, poolCovidPromise
};