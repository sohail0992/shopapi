var mySql = require("../config/database");

class category{
    constructor() {

    }

    getSubCatPromise(parentCategory){
        return new Promise(function(resolve){
            var query = "SELECT id, name, arabic_name\
                     FROM jeddahsp_cement.gc_categories \
                     WHERE parent_id = " + parentCategory;
            
            mySql.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, function(err, rows, fields){
                    connection.release();
                    resolve(rows); //Passing results to callback function
                });
            })
        });
    }
        /*
        This Function will return categories
        that does'nt have any parent id
    */
   getCategories(callback) {
    var query = "SELECT id, name, arabic_name, image,arabic_image as arabic_images\
                 FROM jeddahsp_cement.gc_categories\
                 WHERE parent_id = 0 ";
    mySql.getConnection(function(err, connection){
        if(err){
            throw err;
        }
        connection.query(query, function(err, rows, fields){
            connection.release()
            callback(err, rows); //Passing results to callback function
        });
    })
    

}
    getCity(parentCategory){
        return new Promise(function(resolve){
            var query = "SELECT name,tax\
                     FROM jeddahsp_cement.gc_country_zones \
                     WHERE country_id = " + parentCategory;
            
            mySql.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, function(err, rows, fields){
                    connection.release();
                    resolve(rows); //Passing results to callback function
                });
            })
        });
    }
    /*
        This Function will return categories
        that does'nt have any parent id
    */
    getCountries(callback) {
        var query = "SELECT id,name,tax\
                     FROM jeddahsp_cement.gc_countries\
                     WHERE enabled = 1";

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                callback(err, rows); //Passing results to callback function
            });
        })
    }

    /*
        This function will retrieve categories having a 
        parent id. These categories are known as sub categories
    */
   
    getSubCategories(parentCategory, callback) {
        var query = "SELECT id, name, arabic_name\
                     FROM jeddahsp_cement.gc_categories \
                     WHERE parent_id = " + parentCategory;

        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(query, function(err, rows, fields){
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });
    }
}

module.exports = category;
