var mySql = require('../config/database');

class product {

    constructor() {

    }

    findById(id, callback) {
        var query = "SELECT id, name, arabic_name, price_1\
                     FROM saidalia_js.gc_products\
                     WHERE id =  " + id;
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows[0]); //Passing results to callback function
            });
        });
    }

    getSubCatProd(subCategoryId, callback) {

        var query = "SELECT id, name, model, arabic_name, quantity, price_1, images \
                     FROM saidalia_js.gc_products \
                     WHERE secondary_category = " + subCategoryId;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                //console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });
    }

    getProductDetails(productId, callback) {

        var query = "SELECT a.id, a.name, a.model, a.arabic_name, a.description, a.arabic_description, \
	                        a.quantity, a.images, a.price_1, a.arabic_images, b.name as brand_name, \
                            b.arabic_name as brand_arabic_name \
                     FROM saidalia_js.gc_products a, saidalia_js.gc_brands b \
                     WHERE a.brand = b.id AND a.id = " + productId;

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });

    }

    getProductBySearch(productName, callback) {
        var product = "%" + productName + "%";
        var searchWord = JSON.stringify(product);
        var query = `select id,name,model,arabic_name,
                    description,arabic_description,
                    quantity,images,price_1,arabic_images
                    from saidalia_js.gc_products where name like ${searchWord}`
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, rows, fields) {
                connection.release()
                console.log(rows);
                callback(err, rows); //Passing results to callback function
            });
        });

    }
    getOfferImagePromise(offerId) {
        return new Promise(function (resolve) {
            var query = "SELECT products.images\
                     FROM saidalia_js.gc_promotions as promotions\
                     INNER JOIN saidalia_js.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.on_offer_product_id \
                     INNER JOIN saidalia_js.gc_products as products ON promo_prods.product_id = products.id  \
                     WHERE promotions.id = " + offerId;

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
                        for (var i = 0; i < rows.length; ++i) {
                            var productImageObj = rows[i];
                            //console.log("This is product image obj" + productImageObj);
                            //var productImageObj = JSON.parse(productImageObj);
                            //console.log(productImageObj);
                            //console.log(Object.keys(productImageObj)[0]);
                            var imageFirstProp = productImageObj[Object.keys(productImageObj)[0]];
                            imageFirstProp = JSON.parse(imageFirstProp);
                            imageFirstProp = imageFirstProp[Object.keys(imageFirstProp)[0]];
                            //Extract image filename from image first property object
                            var imageLink = imageFirstProp.filename;
                            rows[i] = "http://hikvisionsaudi.com/9/uploads/images/full/" + imageLink
                        }
                        resolve(rows);
                    }
                });
            });
        });

    }

    getOffers(callback) {
        var query = "SELECT promotions.id, timestampdiff(HOUR, promotions.start_date, promotions.end_date) as time_remaining, promotions.offer_name\
                     FROM saidalia_js.gc_promotions as promotions";

        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query, function (err, results) {
                if (err) {
                    throw err;
                }
                else {
                    connection.release();
                    console.log(results);
                    callback(err, results);
                }
            });
        });
    }
    getOfferDetails(offerId, callback){
        var query = "SELECT products.id, products.name, products.model, products.arabic_name, products.description, products.arabic_description,\
        products.quantity, products.images, COALESCE(products.price_1 - ((products.price_1/100) * promotions.reduction_amount)) AS price_1, products.arabic_images, products.price_1 AS actual_price\
                    FROM saidalia_js.gc_promotions as promotions\
                    INNER JOIN saidalia_js.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.coupon_id\
                    INNER JOIN saidalia_js.gc_products as products ON promo_prods.product_id = products.id\
                    WHERE promotions.id = " + offerId;
                    console.log("query",query);
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }

            connection.query(query, function(err, results){
                if(err){
                    throw err;
                }
                else{
                    connection.release();
                    console.log(results);
                    callback(err, results);
                }
            });
        });
    }
}

module.exports = product;
