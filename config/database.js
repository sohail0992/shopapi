const mySql = require('mysql');

//Providing parameter of user and database to establish connection

var pool = mySql.createPool({
    connectionLimit: 30,
    host: "192.185.81.246",
    user: "saidalia_mirza1",
    password: "Learnfor@99",
    database: "saidalia_js",
    port:"3306"
});

module.exports = pool;
 