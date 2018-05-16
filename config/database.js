const mySql = require('mysql');

//Providing parameter of user and database to establish connection

var pool = mySql.createPool({
    connectionLimit: 30,
    host: "192.185.155.25",
    user: "hiksaudi_hassam",
    password: "MujeeB789",
    database: "hiksaudi_js",
    port:"3306"

});


module.exports = pool;
