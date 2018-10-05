var mySql = require("../config/database");
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var sha1 = require('sha1');
class user{
    constructor() {
        
    }

    findById(id, callback){

        var query = "SELECT id, firstname, lastname, email, phone, password \
                     FROM saidalia_js.gc_customers\
                     WHERE id = " + "\"" + id + "\"";

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }
 
    updateVerificationStatus(userId, status, callback){
        var query = "UPDATE saidalia_js.gc_customers SET verification_status = " + status + " WHERE id = " + userId; //+ userId;

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    findByEmail(email, callback){

        var query = "SELECT id, firstname, lastname, email, phone, password, verification_code, verification_status \
                     FROM saidalia_js.gc_customers\
                     WHERE email = " + "\"" + email + "\"";

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    getPrintName() {
        console.log("Hello");
    }

    setNewUser(userData, callback){
        console.log("inside set new user");
        console.log(userData);
        var query = "INSERT into saidalia_js.gc_customers" +   
                    "(active,confirmed,firstname,  email, phone, password, verification_status, verification_code)" +
                    "VALUES" + "(" + "\"" + userData.active + "\"" + "," + "\"" + userData.confirmed + "\"" + ","+ "\"" + userData.name + "\"" + "," + "\"" + userData.email + "\"" + "," + "\"" + userData.mobile + "\"" + "," + "\"" + userData.password + "\"" + "," + "\"" + userData.verificationStatus + "\"" + ","+ userData.verificationCode +")";
        
        var findbyemail = this.findByEmail;

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                if(err){
                    callback(err, rows);
                }
                else{
                    findbyemail(userData.email, function(err, result){
                        callback(err, result);
                    });    
                }

            });
        })

    }
    getUserAddresses(userId, callback){
        var query = "SELECT address.id, address.latitude, address.longitude, address.address1,address.addressDesc\
                     FROM saidalia_js.gc_customers_address_bank AS address\
                     INNER JOIN saidalia_js.gc_customers AS customers\
                     ON customers.id = address.customer_id\
                     WHERE address.customer_id =  " + userId;
       
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    } 
    getCityId(name){
        return new Promise(function (resolve) {
            var query = `SELECT id from saidalia_js.gc_country_zones  WHERE name = ${name}`;
            mySql.getConnection(function (err, connection){
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");
                        resolve(rows);
                    }
                });
            });
        });
    }
    // getCityId(name, callback){
    //     mySql.getConnection(function(err, connection){
    //         if(err){
    //             throw err;
    //         }
    //         connection.query(query, function(err, rows){
    //             connection.release()
    //             callback(err, rows); //Passing results to callback function
    //         });
    //     });
    // } 
    addUserAddress(userId, addressData, callback){
        var query = "INSERT INTO saidalia_js.gc_customers_address_bank\
                     (country_id,zone_id,city,country,customer_id, latitude, longitude,addressDesc,address1)\
                     VALUES (" + addressData.country_id + "," + addressData.zone_id + "," + addressData.city + ","+ addressData.country + ","+ userId + "," + addressData.latitude + "," + addressData.longitude 
                     + "," +addressData.locName + "," + "\"" + addressData.addressDesc + "\"" + ")";
         
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });   
    }
    addUserShippingAddress(shippingId) {
        return new Promise(function (resolve) {
            var query = "SELECT address1 FROM saidalia_js.gc_customers_address_bank\
            WHERE id = " + shippingId;
             mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved");
                        resolve(rows);
                    }
                });
            });
        });
    }
    editInfo(userId,addressData,callback){
       console.log("agaya");
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query('update saidalia_js.gc_customers set ? where id = ?', [addressData,userId], function(err, rows){
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });   
    }
    getUserAddressById(addressId, callback){
        console.log("Inside get user address model123");
        var query = "SELECT address1 FROM saidalia_js.gc_customers_address_bank\
                     WHERE id = " + addressId;
        console.log("Above query executed");

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }
    getUserCountry(addressId) {
        return new Promise(function (resolve) {
            var query = "SELECT city,country_id FROM saidalia_js.gc_customers_address_bank\
            WHERE id = " + addressId;
             mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved",rows);
                        resolve(rows);
                    }
                });
            });
        });
    }
GetCountryAmount(addressId) {
        return new Promise(function (resolve) {
            var query = "SELECT tax FROM saidalia_js.gc_countries\
            WHERE id = " + addressId;
             mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("Promise going to be resolved",rows);
                        resolve(rows);
                    }
                });
            });
        });
    }
    getCityAmount(name) {
        return new Promise(function (resolve) {
            console.log(name);
            name=JSON.stringify(name);
            var query = "SELECT tax FROM saidalia_js.gc_country_zones\
            WHERE name = " + name;
             mySql.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                connection.query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.release();
                        console.log("City Rate Promise going to be resolved",rows);
                        resolve(rows);
                    }
                });
            });
        });
    }
    setForgotPassTokenAndTime(userId, token, time, callback){
        console.log(typeof token);
        console.log(typeof time);
        console.log(typeof userId);

        var query = "UPDATE  saidalia_js.gc_customers SET resetPasswordToken = " + "\"" + token + "\"" + "," + "resetPasswordDate = " + time + " WHERE id = " + userId;

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    setUserPassword(id, password, callback){
        var query = "UPDATE  saidalia_js.gc_customers SET password = " + "\"" + password + "\"" + " WHERE id = " + userId;

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    generatePasswordHash(password){
        console.log("password",password);
        //var sha1 = crypto.createHash('sha1').update(password).digest("hex");
        var sha =sha1(password)
        console.log("sha1",sha);
       // return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        return sha;
    }

    validPassword(password, localPassword){
      //  console.log("password",password,"localPassword",localPassword);
       // var sha1 = crypto.createHash('sha1').update(password).digest("hex");
       var sha =sha1(password) 
       if(sha==localPassword){
            return true;
        }else{
            return false;
        }
      //  return bcrypt.compareSync(password,localPassword); 
    }
}
module.exports = user;
