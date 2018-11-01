const mySql = require('mysql');

//Providing parameter of user and database to establish connection

// var pool = mySql.createPool({
//     connectionLimit: 30,
//     host: "localhost",
//     user: "super",
//     password: "sohail",
//     database: "cement",
//     port:"3307"
// });


var pool = mySql.createPool({
    connectionLimit: 30,
    host: "192.185.191.157",
    user: "jeddahsp_cement",
    password: "fireon52",
    database: "jeddahsp_cement",
    port:"3306"
});
module.exports = pool;
 