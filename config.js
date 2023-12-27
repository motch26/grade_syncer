require("dotenv").config({ path: "./.env" });
const mysql = require("mysql2/promise");
const logger = require("./logger");
const startLocalConnection = async () => {
  try {
    const conn = await mysql.createPool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    logger.verbose("Local Database Connected.");
    return conn;
  } catch (error) {
    logger.error(`[startLocalConnection] ERRDB. - ${error.message}`);
  }
};

const endConnection = async (conn) => {
  await conn.end();
};

const startCloudConnection = async () => {
  try {
    const conn = await mysql.createPool({
      host: process.env.CLOUD_DB_HOST,
      database: process.env.CLOUD_DB_NAME,
      user: process.env.CLOUD_DB_USER,
      password: process.env.CLOUD_DB_PASSWORD,
    });
    logger.verbose("Cloud Database Connected.");
    return conn;
  } catch (error) {
    logger.error(`[startCloudConnection] ERRDB. - ${error.message}`);
  }
};
module.exports = {
  startCloudConnection,
  startLocalConnection,
  endConnection,
};
