const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres.swyybgenrdtbzhusmtke",
  password: "foodieOnShelf1234",
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
});

pool.connect((err, client, release) => {
  if (err) {
    // Handle connection error
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Connected to the database!");
    // Do something with the client
    // ...

    // Release the client back to the pool
    release();
  }
});

module.exports = pool;
