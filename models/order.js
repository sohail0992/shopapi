var mySql = require('../config/database');
var microtime = require('microtime');

class Order{
    constructor(){ 
        this.addOrderItems = function(cart_total,cart, orderedId,type,micTime, callback){
             var productsInCart = cart.generateArray();
            console.log(cart,'productsInCart');
            var orderItemsArray = [];
            //Creating array of order items so that it can be added asynchronously
            for(var i = 0; i < productsInCart.length; i++){
                if(productsInCart[i].item.id>=100){
                    productsInCart[i].item.id=productsInCart[i].item.id-100;
                    var newItem = [orderedId, productsInCart[i].item.id, productsInCart[i].qty, productsInCart[i].item.name,productsInCart[i].item.arabic_name,productsInCart[i].item.description,productsInCart[i].item.arabic_description, productsInCart[i].item.price_1, productsInCart[i].price];
                    orderItemsArray.push(newItem);
                }else{
                    var newItem = [orderedId, productsInCart[i].item.id, productsInCart[i].qty, productsInCart[i].item.name,productsInCart[i].item.arabic_name,productsInCart[i].item.description,productsInCart[i].item.arabic_description, productsInCart[i].item.price_1, productsInCart[i].price];
                    orderItemsArray.push(newItem);
                }
            }
            let paymentData={
                order_id:orderedId,
                status:"Pending",
                amount:cart_total,
                description:type,
                payment_module:type
            }
            let transaction={
                order_number:micTime,
                order_id:orderedId,
                created_at:Date.now(),
            }
          //  console.log(orderItemsArray);
           // console.log("inside add order items function");
            var query = "INSERT INTO saidalia_js.gc_order_items (order_id, product_id, quantity, name,arabic_name,description,arabic_description,price, total_price) VALUES ?";
            var paymentQuery ="INSERT INTO saidalia_js.gc_payments set ?";
            var transactions= "insert into saidalia_js.gc_transactions set ?";
            mySql.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, [orderItemsArray],async function(err, rows1, fields1){
                    connection.query(paymentQuery, paymentData,async function(err, rows2, fields2){
                     console.log("rows2 ",rows2);
                        var data={
                            transaction_id:rows2.insertId,
                        }
                        connection.query(transactions, transaction,async function(err, rows3, fields3){
                            connection.query(`update saidalia_js.gc_orders set ? where id =?`, [data,orderedId], function(err, rows, fields3){
                                connection.release()
                                console.log("rowsrows",rows);
                                console.log(err);
                                callback(err, rows); //Passing results to callback function
                            });
                        });
                    });
                  //  callback(err, rows); //Passing results to callback function
                });
            });
            
            /* 
                Since we have to add multiple order items
                Therefore we have to take care of the transanctions in case if 
                any of the order item is not added we have to rollback the entire transaction
            */
           /*
           mySql.getConnection(function(err, connection){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log("inside get connection function");
                connection.beginTransaction(function(err){
                    if(err){
                        callback(err);
                    }
                    connection.query(query, [orderItemsArray], function(err, result){
                        //If any item failed to be inserted transaction would be rolledback
                        if(err){
                            connection.rollback(function(){
                                callback(err);
                            });
                        }
                        //If all items are inserted transaction would be committed
                        connection.commit(function(err){
                            if(err){
                                connection.rollback(function(){
                                    callback(err);
                                })
                            }
                            connection.end();
//                            mySql.end();
                            callback(null);
                        });
                    });
                })
            });*/
            
        }
    
    }
    // setPaymentTable(cart,user_id,address_id,checkType){
    //     return new Promise(function(resolve){
    //         // var query = "SELECT id, name, arabic_name\
    //         //          FROM saidalia_js.gc_categories \
    //         //          WHERE parent_id = " + parentCategory;
    //         var productsInCart = cart.generateArray();
    //         let values={
    //             order_id
    //         }
    //         var query = `insert into saidalia_js.gc_payment set ?` 
    //         mySql.getConnection(function(err, connection){
    //             if(err){
    //                 throw err;
    //             }
    //             connection.query(query, function(err, rows, fields){
    //                 connection.release();
    //                 resolve(rows); //Passing results to callback function
    //             });
    //         })
    //     });
    // }

    addNewOrder(cart_total,cart, userId, addressId,cargoType,temp2,shippingRate,addressRow,shippingId,callback){
        /*
            The generate array in Cart class would return
            all the products present in the cart.
         */
        console.log("Inside add New Order model");
        var productsInCart = cart.generateArray();
        addressRow=JSON.stringify(addressRow);
        cargoType=JSON.stringify(cargoType);
        var micTime= microtime.now();
        var newOrderQuery = "INSERT INTO saidalia_js.gc_orders (shipping_address_id,Type,shipping,vat,customer_id, order_number, order_status, total, subtotal, ordered_on, billing_address_id,address)\
                             VALUES ("+ shippingId + ","+ cargoType + ","+ shippingRate + "," + temp2 + "," + userId + "," + micTime + "," + "'Pending'" + "," + cart_total + "," + cart.totalPrice + "," + Date.now() + "," + addressId + "," + addressRow + ")";
        /*
            Insert a new order and get the id of the row inserted in order table
            The id would be used to add order items in order items table
         */
        console.log("address",newOrderQuery);
        var orderItemFunction = this.addOrderItems;
        
        mySql.getConnection(function(err, connection){
            if(err){
                throw err;
            }
            connection.query(newOrderQuery, function(err, result){
                connection.release()
                if(err){
                    callback(err);
                } else {
                    orderItemFunction(cart_total,cart, result.insertId,cargoType,micTime, (err) => {
                        if(err)
                            callback(err);
                        else 
                            callback(null);
                    });
                }
            });
        });
   }
}

module.exports = Order;