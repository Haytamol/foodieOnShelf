const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres.swyybgenrdtbzhusmtke",
  password: "foodieOnShelf1234",
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
});

module.exports = pool;
