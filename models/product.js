var mySql = require('../config/database');
var moment = require('moment');
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
                    b.arabic_name as brand_arabic_name,r.rating,r.Review as review_discricption\
                    FROM  gc_products a\
                    left join gc_review r on r.productId = a.id \
                    left join gc_brands b on a.brand = b.id \
                    WHERE a.id = " + productId;
console.log(", saidalia_js.gc_brands b ")
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
                            rows[i] = "http://www.saidaliah.com/uploads/images/full/" + imageLink
                        }
                        resolve(rows);
                    }
                });
            });
        });
    }
    getAllOffers(callback) {
        var query = `SELECT * FROM saidalia_js.gc_promotions WHERE end_date >= NOW()`;
        // console.log("query", query);

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
                    //  console.log(results);
                    callback(err, results);
                }
            });
        });
    }

    getProductWiseOffers(end, offerId) {
        return new Promise(function (resolve) {
            var query = "SELECT products.id,products.enable_date as Hours,products.disable_date as Minutes, products.name, products.model, products.arabic_name, products.description, products.arabic_description,\
                        products.quantity, products.images, COALESCE(products.price_1 - ((products.price_1/100) * promotions.reduction_amount)) AS price_1, products.arabic_images, products.price_1 AS actual_price\
                        FROM saidalia_js.gc_promotions as promotions\
                        INNER JOIN saidalia_js.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.coupon_id\
                        INNER JOIN saidalia_js.gc_products as products ON promo_prods.product_id = products.id\
                        WHERE promotions.id = " + offerId;


            var ehourData = new Date(end);
            var currentDates = new Date();
            var currentDatesH = currentDates.getHours()
            var currentDatesM = currentDates.getMinutes();
            console.log("date", ehourData, "date", end)
            var EH = ehourData.getHours()
            var eminutesData = ehourData.getMinutes();
            var remainingHours = EH - currentDatesH;
            var remainingMinutes = eminutesData - currentDatesM;
            console.log("date", ehourData, "date", currentDates)
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
                        for (var i = 0; i < rows.length; i++) {
                            rows[i].Hours = remainingHours;
                            rows[i].Minutes = remainingMinutes;
                        }
                        resolve(rows);
                    }
                });
            });
        });
    }
    getCategoryWiseOffers(end, subCategoryId, deductedAmount) {
        return new Promise(function (resolve) {
            var query = "SELECT p.id,p.enable_date as Hours,p.disable_date as Minutes, p.name,b.name as brand_name,p.arabic_description, p.model,p.description,p.fixed_quantity as discount_price, p.arabic_name, p.quantity, p.price_1, p.images \
                FROM saidalia_js.gc_products p inner join saidalia_js.gc_brands b on b.id = p.brand \
                WHERE secondary_category = " + subCategoryId;
            var ehourData = new Date(end);
            var currentDates = new Date();
            var currentDatesH = currentDates.getHours()
            var currentDatesM = currentDates.getMinutes();
            console.log("date", ehourData, "date", end)
            var EH = ehourData.getHours()
            var eminutesData = ehourData.getMinutes();
            var remainingHours = EH - currentDatesH;
            var remainingMinutes = eminutesData - currentDatesM;
            console.log("date", ehourData, "date", currentDates)
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
                        for (let j = 0; j < rows.length; j++) {
                            rows[j].discount_price = ((rows[j].price_1 - ((rows[j].price_1 / 100) * deductedAmount)));
                            rows[j].Hours = remainingHours;
                            rows[j].Minutes = remainingMinutes;
                        }
                        resolve(rows);
                    }
                });
            });
        });
    }
    getOfferDetails(offerId, callback) {
        var datecheck = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(typeof (datecheck));
        var query = `SELECT products.id, products.name, products.model, products.arabic_name, products.description, products.arabic_description,
                            products.quantity, products.images, COALESCE(products.price_1 - ((products.price_1/100) * promotions.reduction_amount)) AS price_1,
                            products.arabic_images, products.price_1 AS actual_price
                            FROM saidalia_js.gc_promotions as promotions
                            INNER JOIN saidalia_js.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.coupon_id
                            INNER JOIN saidalia_js.gc_products as products ON promo_prods.product_id = products.id
                            WHERE promotions.id = ${offerId} and promotions.end_date >= 2018-05-19`;
        console.log("query", query);
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

    insertReview(review, productId,rating, callback) {
      //  var query = "INSERT INTO saidalia_js.gc_review (Review,productId) VALUES (" +review+ "," + productId +"")";
       var query ="Insert INTO saidalia_js.gc_review set ?" 
                     console.log("query",query);
                     let data1={
                        Review:review,
                        productId:productId,
                        rating:rating
                     }
        mySql.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(query,data1 ,function (err, results) {
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

}

module.exports = product;
