const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "baka",
    host: "localhost",
    port: 5432,
    database: "foodieonshelf"
})

module.exports = pool;