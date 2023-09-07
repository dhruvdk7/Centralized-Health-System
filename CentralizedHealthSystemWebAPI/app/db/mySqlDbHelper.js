const mysql = require('mysql2');
const dbConfig = require("../config/db.config");

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    database: dbConfig.DB,
    password: dbConfig.PASSWORD,
    waitForConnections: dbConfig.WAIT_FOR_CONNECTION,
    connectionLimit: dbConfig.CONNECTION_LIMIT,
    maxIdle: dbConfig.MAX_IDLE,
    idleTimeout: dbConfig.TIMEOUT,
    queueLimit: dbConfig.QUERY_LIMIT
});

console.log(`DB name ${dbConfig.DB}`);

module.exports = {
    dbConnPool: pool
};

