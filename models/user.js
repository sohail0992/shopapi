var mySql = require("../config/database");
var bcrypt = require('bcryptjs');

class user{
    constructor() {
        
    }

    findById(id, callback){

        var query = "SELECT id, firstname, lastname, email, phone, password \
                     FROM hiksaudi_js.gc_customers\
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
        var query = "UPDATE hiksaudi_js.gc_customers SET verification_status = " + status + " WHERE id = " + userId; //+ userId;

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
                     FROM hiksaudi_js.gc_customers\
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
        var query = "INSERT into hiksaudi_js.gc_customers" +   
                    "(firstname,  email, phone, password, verification_status, verification_code)" +
                    "VALUES" + "(" + "\"" + userData.name + "\"" + "," + "\"" + userData.email + "\"" + "," + "\"" + userData.mobile + "\"" + "," + "\"" + userData.password + "\"" + "," + "\"" + userData.verificationStatus + "\"" + ","+ userData.verificationCode +")";
        
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
        var query = "SELECT address.AdressID, address.latitude, address.longitude, address.address\
                     FROM hiksaudi_js.gc_address AS address\
                     INNER JOIN hiksaudi_js.gc_customers AS customers\
                     ON customers.id = address.CustomerId\
                     WHERE address.CustomerId =  " + userId;
       
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

    addUserAddress(userId, addressData, callback){
        var query = "INSERT INTO hiksaudi_js.gc_address\
                     (CustomerId, latitude, longitude, address)\
                     VALUES (" + userId + "," + addressData.latitude + "," + addressData.longitude 
                     + "," + "\"" + addressData.addressDesc + "\"" + ")";
        
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

    getUserAddressById(addressId, callback){
        console.log("Inside get user address model123");
        var query = "SELECT address FROM hiksaudi_js.gc_address\
                     WHERE AdressID = " + addressId;
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

    setForgotPassTokenAndTime(userId, token, time, callback){
        console.log(typeof token);
        console.log(typeof time);
        console.log(typeof userId);

        var query = "UPDATE  hiksaudi_js.gc_customers SET resetPasswordToken = " + "\"" + token + "\"" + "," + "resetPasswordDate = " + time + " WHERE id = " + userId;

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
        var query = "UPDATE  hiksaudi_js.gc_customers SET password = " + "\"" + password + "\"" + " WHERE id = " + userId;

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
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    validPassword(password, localPassword){
        return bcrypt.compareSync(password, localPassword); 
    }

}

module.exports = user;
