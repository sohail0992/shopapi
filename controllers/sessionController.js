var mySql = require("../config/database");

function getMySqlConnPromise (){
    return new Promise(function(resolve, reject){
        mySql.getConnection(function(err, connection){
            if(err)
                reject(err);
            else    
                resolve(connection);
        })
    })
}

exports.getSessionStore = async function(){
    return new Promise(async function(resolve){
        var mySqlConnPromise = getMySqlConnPromise();
        mySqlConnPromise.then(function(connection){
            resolve(connection);
        });
    });
    
}