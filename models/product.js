var mySql = require('../config/database');
var moment = require('moment');
class product {
  constructor() {}
  findById(id, callback) {
    var query = "SELECT id, name,description,images, arabic_name,arabic_description, price_1\
                     FROM jeddahsp_cement.gc_products\
                     WHERE id =  " + id;
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, rows, fields) {
        connection.release()
        console.log(rows);
        callback(err, rows[0]); //Passing results to callback function
      });
    });
  }

  getSubCatProd(subCategoryId, callback) {
    var query = "SELECT id,slug, name, model, arabic_name, quantity, price_1, images,sku as discount_price \
                     FROM jeddahsp_cement.gc_products \
                     WHERE secondary_category = " + subCategoryId;
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, rows, fields) {
        connection.release()
        //console.log(rows);
        callback(err, rows); //Passing results to callback function
      });
    });
  }

getProuducts(callback) {
    var query = "SELECT * FROM  jeddahsp_cement.gc_products";
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          throw err;
        } else {
          connection.release();
          callback(err, results);
        }
      });
    });
  }


  getProductDetails(productId, callback) {
    var query = "SELECT a.id,a.slug, a.name,a.excerpt as rating,free_shipping as Review_decription, a.model, a.arabic_name, a.description, a.arabic_description, \
                    a.quantity, a.images, a.price_1, a.arabic_images, b.name as brand_name, \
                    b.arabic_name as brand_arabic_name\
                    FROM  gc_products a\
                    Right join gc_brands b on a.brand = b.id \
                    WHERE a.id = " + productId;
    console.log(", jeddahsp_cement.gc_brands b ")
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, rows, fields) {
        connection.release()
        console.log(rows);
        callback(err, rows); //Passing results to callback function
      });
    });
  }
  getReviewOnProduct(productId) {
    return new Promise(function(resolve) {
      var query = `select rating,Review from jeddahsp_cement.gc_review where productId = ${productId}`
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("Promise going to be resolved");
            resolve(rows);
          }
        });
      });
    });
  }
  getCheck(productId) {
    return new Promise(function(resolve) {
      var query = `select setting from jeddahsp_cement.gc_settings where setting_key="allow_os_purchase"`
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("Promise going to be resolved");
            resolve(rows);
          }
        });
      });
    });
  }
  getProductBySearch(productName, callback) {
    var product = "%" + productName + "%";
    var searchWord = JSON.stringify(product);
    var query = `select id,name,model,arabic_name,
                    description,arabic_description,slug,
                    quantity,images,price_1,arabic_images
                    from jeddahsp_cement.gc_products where name like ${searchWord} or arabic_name like ${searchWord} or description like ${searchWord} or slug like ${searchWord} or arabic_description like ${searchWord}`;
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, rows, fields) {
        connection.release()
        //  console.log(rows);
        callback(err, rows); //Passing results to callback function
      });
    });

  }
  getOfferImagePromise(offerId) {
    return new Promise(function(resolve) {
      var query = "SELECT products.images\
                     FROM jeddahsp_cement.gc_promotions as promotions\
                     INNER JOIN jeddahsp_cement.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.on_offer_product_id \
                     INNER JOIN jeddahsp_cement.gc_products as products ON promo_prods.product_id = products.id  \
                     WHERE promotions.id = " + offerId;

      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
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
    var query = `SELECT * FROM jeddahsp_cement.gc_promotions WHERE end_date >= NOW() and enabled_1=1`;
    // console.log("query", query);

    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          throw err;
        } else {
          connection.release();
          //  console.log(results);
          callback(err, results);
        }
      });
    });
  }
  getallofferforSearch(productId) {
    return new Promise(function(resolve) {
      var query = `SELECT * FROM jeddahsp_cement.gc_promotions WHERE end_date >= NOW() and enabled_1=1 `;
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("Promise going to be resolved");
            resolve(rows);
          }
        });
      });
    });
  }
  getAllCategoryWiseData(productId) {
    return new Promise(function(resolve) {
      var query = `SELECT * FROM jeddahsp_cement.gc_promotions WHERE end_date >= NOW() and enabled_1=1 and offer_name = category_wise`;
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("Promise going to be resolved");
            resolve(rows);
          }
        });
      });
    });
  }
  getAllOffersData(Subcategory_id) {
    return new Promise(function(resolve) {
      var query = `SELECT reduction_amount,reduction_type,start_date as days,whole_order_coupon as Hours,max_product_instances as Minutes,max_uses as seconds,end_date FROM jeddahsp_cement.gc_promotions WHERE end_date >= NOW() and enabled_1=1 and secondary_category=${Subcategory_id}`;

      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("Promise going to be resolved", rows);

            if (rows.length != 0) {
              var ehourData = new Date(rows[0].end_date);
              var currentDates = new Date();
              var currentDatesH = currentDates.getHours() + 5;
              var currentDatesM = currentDates.getMinutes();
              var EH = ehourData.getHours()
              var eminutesData = ehourData.getMinutes();
              var remainingHours = EH - currentDatesH;
              var remainingMinutes = eminutesData - currentDatesM;

              var seconds = Math.floor((ehourData - (currentDates)) / 1000);
              var minutes = Math.floor(seconds / 60);
              var hours = Math.floor(minutes / 60);
              var days = Math.floor(hours / 24);

              hours = hours - (days * 24);
              minutes = minutes - (days * 24 * 60) - (hours * 60);
              seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
              console.log("days", days, "Hours", hours, "minutes", minutes, "seconds", seconds);

              console.log("Current Hour", currentDatesH, "Offer date Hours", EH)
              console.log("Current Minute", currentDatesM, "offer date min", remainingHours)
              if (rows[0].reduction_type === 'fixed') {
                for (var i = 0; i < rows.length; i++) {
                  rows[i].Hours = hours;
                  rows[i].Minutes = minutes;
                  rows[i].days = days;
                  rows[i].seconds = seconds;
                }
                console.log("Product Wise Offers", rows[0])
                resolve(rows);
              } else {
                for (var i = 0; i < rows.length; i++) {
                  rows[i].Hours = hours;
                  rows[i].Minutes = minutes;
                  rows[i].days = days;
                  rows[i].seconds = seconds;
                }
                console.log("Product Wise Offers", rows[0])
                resolve(rows);
              }
            } else {
              resolve(rows);
            }
          }
        });
      });
    });
  }

  getProductWiseOffers(end, offerId, reduction_type) {
    return new Promise(function(resolve) {
      var query = "";
      if (reduction_type === 'percent') {
        query = "SELECT products.id,products.slug,products.excerpt as days,products.enable_date as Hours,products.disable_date as Minutes, products.name, products.model as seconds, products.arabic_name, products.description, products.arabic_description,\
                        products.quantity,promotions.reduction_amount as Reduction_Percentage, products.images, COALESCE(products.price_1 - ((products.price_1/100) * promotions.reduction_amount)) AS discount_price, products.arabic_images, products.price_1 AS actual_price\
                        FROM jeddahsp_cement.gc_promotions as promotions\
                        INNER JOIN jeddahsp_cement.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.coupon_id\
                        INNER JOIN jeddahsp_cement.gc_products as products ON promo_prods.product_id = products.id\
                        WHERE promotions.id = " + offerId;
      }
      if (reduction_type === 'fixed') {
        query = "SELECT products.id,products.excerpt as days,products.enable_date as Hours,products.disable_date as Minutes, products.name, products.model as seconds, products.arabic_name, products.description, products.arabic_description,\
                            products.quantity,products.slug,promotions.reduction_amount as Reduction_Percentage, products.images, COALESCE(products.price_1 - promotions.reduction_amount) AS discount_price, products.arabic_images, products.price_1 AS actual_price\
                            FROM jeddahsp_cement.gc_promotions as promotions\
                            INNER JOIN jeddahsp_cement.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.coupon_id\
                            INNER JOIN jeddahsp_cement.gc_products as products ON promo_prods.product_id = products.id\
                            WHERE promotions.id = " + offerId;
      }
      var ehourData = new Date(end);
      var currentDates = new Date();
      var currentDatesH = currentDates.getHours() + 5;
      var currentDatesM = currentDates.getMinutes();
      var EH = ehourData.getHours()
      var eminutesData = ehourData.getMinutes();
      var remainingHours = EH - currentDatesH;
      var remainingMinutes = eminutesData - currentDatesM;

      var seconds = Math.floor((ehourData - (currentDates)) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      hours = hours - (days * 24);
      minutes = minutes - (days * 24 * 60) - (hours * 60);
      seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            if (reduction_type === 'fixed') {
              for (var i = 0; i < rows.length; i++) {
                rows[i].Hours = hours;
                rows[i].Minutes = minutes;
                rows[i].days = days;
                rows[i].seconds = seconds;
                rows[i].Reduction_Percentage = rows[i].Reduction_Percentage
              }
              resolve(rows);
            } else {
              for (var i = 0; i < rows.length; i++) {
                rows[i].Hours = hours;
                rows[i].Minutes = minutes;
                rows[i].days = days;
                rows[i].seconds = seconds;
                rows[i].Reduction_Percentage = rows[i].Reduction_Percentage + "%"
              }
              resolve(rows);
            }

          }
        });
      });
    });
  }
  getCategoryWiseOffers(end, subCategoryId, deductedAmount, reduction_type) {
    return new Promise(function(resolve) {
      var query = "SELECT p.id,p.slug,p.weight as Reduction_Percentage,p.excerpt as days,p.enable_date as Hours,p.disable_date as Minutes, p.name,b.name as brand_name,p.arabic_description,  p.model as seconds,p.description,p.fixed_quantity as discount_price, p.arabic_name, p.quantity,p.arabic_images, p.price_1 AS actual_price, p.images \
                FROM jeddahsp_cement.gc_products p inner join jeddahsp_cement.gc_brands b on b.id = p.brand \
                WHERE secondary_category = " + subCategoryId;
      var ehourData = new Date(end);
      var currentDates = new Date();
      var currentDatesH = currentDates.getHours() + 5
      var currentDatesM = currentDates.getMinutes();
      var EH = ehourData.getHours()
      var eminutesData = ehourData.getMinutes();
      var remainingHours = EH - currentDatesH;
      var remainingMinutes = eminutesData - eminutesData;
      // get total seconds between the times
      var seconds = Math.floor((ehourData - (currentDates)) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      hours = hours - (days * 24);
      minutes = minutes - (days * 24 * 60) - (hours * 60);
      seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("Promise going to be resolved");
            if (reduction_type === 'fixed') {
              for (let j = 0; j < rows.length; j++) {
                rows[j].discount_price = (rows[j].actual_price - deductedAmount);
                rows[j].Hours = hours;
                rows[j].Minutes = minutes;
                rows[j].days = days;
                rows[j].seconds = seconds;
                rows[j].Reduction_Percentage = deductedAmount;
              }
              resolve(rows);
            } else {
              for (let j = 0; j < rows.length; j++) {
                rows[j].discount_price = ((rows[j].actual_price - ((rows[j].actual_price / 100) * deductedAmount)));
                rows[j].Hours = hours;
                rows[j].Minutes = minutes;
                rows[j].days = days;
                rows[j].seconds = seconds;
                rows[j].Reduction_Percentage = deductedAmount + "%";
              }
              resolve(rows);
            }
          }
        });
      });
    });
  }
  getBrandWiseOffer(end, brand_id, deductedAmount, reduction_type) {
    return new Promise(function(resolve) {
      var query = "SELECT p.id,p.slug,p.weight as Reduction_Percentage,p.excerpt as days,p.enable_date as Hours,p.disable_date as Minutes, p.name,b.name as brand_name,p.arabic_description,  p.model as seconds,p.description,p.fixed_quantity as discount_price, p.arabic_name, p.quantity,p.arabic_images, p.price_1 AS actual_price, p.images \
                FROM jeddahsp_cement.gc_products p inner join jeddahsp_cement.gc_brands b on b.id = p.brand \
                WHERE p.brand = " + brand_id;
      var ehourData = new Date(end);
      var currentDates = new Date();
      var currentDatesH = currentDates.getHours() + 5
      var currentDatesM = currentDates.getMinutes();
      var EH = ehourData.getHours()
      var eminutesData = ehourData.getMinutes();
      var remainingHours = EH - currentDatesH;
      var remainingMinutes = eminutesData - eminutesData;
      // get total seconds between the times
      var seconds = Math.floor((ehourData - (currentDates)) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      hours = hours - (days * 24);
      minutes = minutes - (days * 24 * 60) - (hours * 60);
      seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
      mySql.getConnection(function(err, connection) {
        if (err) {
          throw err;
        }
        connection.query(query, function(err, rows) {
          if (err) {
            throw err;
          } else {
            connection.release();
            console.log("reduction_amount", deductedAmount);
            if (reduction_type === 'fixed') {
              for (let j = 0; j < rows.length; j++) {
                rows[j].discount_price = (rows[j].actual_price - deductedAmount);
                rows[j].Hours = hours;
                rows[j].Minutes = minutes;
                rows[j].days = days;
                rows[j].seconds = seconds;
                rows[j].Reduction_Percentage = deductedAmount;
              }
              resolve(rows);
            } else {
              for (let j = 0; j < rows.length; j++) {
                rows[j].discount_price = ((rows[j].actual_price - ((rows[j].actual_price / 100) * deductedAmount)));
                rows[j].Hours = hours;
                rows[j].Minutes = minutes;
                rows[j].days = days;
                rows[j].seconds = seconds;
                rows[j].Reduction_Percentage = deductedAmount + "%";
              }
              resolve(rows);
            }
          }
        });
      });
    });
  }
  getOrderHistory(Id, callback) {
    var query = 'select id,order_status,order_started ,order_number,status ' +
      ' from jeddahsp_cement.gc_orders ' +
      ' where customer_id = "' + Id + '" ';
    console.log("query", query);
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          connection.release();
          console.log(results);
          callback(err, results);
        }
      });
    });
  }

  getOrdersAll(callback) {
    var query = "select id,order_status,order_started ,order_number,status from jeddahsp_cement.gc_orders";
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          connection.release();
          console.log(results);
          callback(err, results);
        }
      });
    });
  }
  getOrderDetailHistory(Id, callback) {
    // var query = 'select o.Type ,o.subtotal,o.total as Grand_total,d.images,o.shipping as ShippingAmount,o.vat as VAT, o.order_number,o.address,o.order_started,d.quantity as product_quantity,d.price as product_price,d.total_price as product_total,d.name,d.description,d.arabic_name,d.arabic_description ' +
    //     '  from jeddahsp_cement.gc_orders o' +
    //     '  inner join jeddahsp_cement.gc_order_items d on o.id= d.order_id' +
    //     '  where o.id = "' + Id + '" ';
    var query = `select o.Type ,o.subtotal,o.total as Grand_total,d.images,o.shipping as ShippingAmount,o.vat as VAT, o.order_number,o.address,o.order_started,d.quantity as product_quantity,d.price as product_price,d.total_price as product_total,d.name,d.description,d.arabic_name,d.arabic_description 
            from jeddahsp_cement.gc_orders o
            inner join jeddahsp_cement.gc_order_items d on o.id= d.order_id
            where o.id = ${Id} and d.product_id != 0`;
    console.log("query", query);
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          connection.release();
          console.log(results);
          callback(err, results);
        }
      });
    });

  }

  getOfferDetails(offerId, callback) {
    var datecheck = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(typeof(datecheck));
    var query = `SELECT products.id, products.name, products.model, products.arabic_name, products.description, products.arabic_description,
                            products.quantity, products.images, COALESCE(products.price_1 - ((products.price_1/100) * promotions.reduction_amount)) AS price_1,
                            products.arabic_images, products.price_1 AS actual_price
                            FROM jeddahsp_cement.gc_promotions as promotions
                            INNER JOIN jeddahsp_cement.gc_promotions_products as promo_prods ON  promotions.id = promo_prods.coupon_id
                            INNER JOIN jeddahsp_cement.gc_products as products ON promo_prods.product_id = products.id
                            WHERE promotions.id = ${offerId} and promotions.end_date >= 2018-05-19`;
    console.log("query", query);
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          throw err;
        } else {
          connection.release();
          console.log(results);
          callback(err, results);
        }
      });
    });
  }

  insertReview(review, productId, rating, callback) {
    //  var query = "INSERT INTO jeddahsp_cement.gc_review (Review,productId) VALUES (" +review+ "," + productId +"")";
    var query = "Insert INTO jeddahsp_cement.gc_review set ?"
    console.log("query", query);
    let data1 = {
      Review: review,
      productId: productId,
      rating: rating
    }
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, data1, function(err, results) {
        if (err) {
          throw err;
        } else {
          connection.release();
          console.log(results);
          callback(err, results);
        }
      });
    });
  }
  checkCoupun(coupun, callback) {
    var query = 'select reduction_amount,reduction_type,code' +
      ' from jeddahsp_cement.gc_coupons ' +
      ' where code = "' + coupun + '" and end_date >=NOW()';
    //  var query = `SELECT code from jeddahsp_cement.gc_coupons where code = coupun 
    //  and end_date >=NOW()`;
    console.log("query", query);
    mySql.getConnection(function(err, connection) {
      if (err) {
        throw err;
      }
      connection.query(query, function(err, results) {
        if (err) {
          throw err;
        } else {
          connection.release();
          //  console.log(results);
          callback(err, results);
        }
      });
    });
  }


}

module.exports = product;