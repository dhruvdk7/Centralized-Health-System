require("dotenv-safe").config({
  path: "./.config/.env",
  allowEmptyValues: false,
});

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  WAIT_FOR_CONNECTION: true,
  CONNECTION_LIMIT: 50,
  MAX_IDLE: 10,
  TIMEOUT: 60000,
  QUERY_LIMIT: 0,
};
