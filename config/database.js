const mySql = require('mysql');

//Providing parameter of user and database to establish connection

var pool = mySql.createPool({
    connectionLimit: 30,
    host: "localhost",
    user: "super",
    password: "sohail",
    database: "cement",
    port:"3307"
});

module.exports = pool;
 