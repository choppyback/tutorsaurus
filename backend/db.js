const Pool = require("pg").Pool;

const pool = new Pool({
  host: process.env.PSQL_HOST || "localhost",
  user: process.env.PSQL_USER || "postgres",
  password: process.env.PSQL_PASSWORD || "password",
  port: process.env.PSQL_PORT || 5432,
  database: process.env.PSQL_DATABASE || "tutorsaurus",
  /*ssl: {
    rejectUnauthorized: false,
  },*/
});

module.exports = pool;
