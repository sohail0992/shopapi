var mySql = require('../config/database');
var microtime = require('microtime');

class Order{
    constructor(){ 
        this.addOrderItems = function(cart, orderId, callback){
            var productsInCart = cart.generateArray();
            var orderItemsArray = [];
        
            //Creating array of order items so that it can be added asynchronously
            for(var i = 0; i < productsInCart.length; i++){
                var newItem = [orderId, productsInCart[i].item.id, productsInCart[i].qty, productsInCart[i].item.name, productsInCart[i].item.price_1, productsInCart[i].price];
                orderItemsArray.push(newItem);
            }
            console.log(orderItemsArray);
            console.log("inside add order items function");
            var query = "INSERT INTO hiksaudi_js.gc_order_items (order_id, product_id, quantity, name,  price, total_price) VALUES ?";
            
            mySql.getConnection(function(err, connection){
                if(err){
                    throw err;
                }
                connection.query(query, [orderItemsArray], function(err, rows, fields){
                    connection.release()
                    console.log(rows);
                    console.log(err);
                    callback(err, rows); //Passing results to callback function
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


    addNewOrder(cart, userId, address, callback){
        /*
            The generate array in Cart class would return
            all the products present in the cart.
         */
        console.log("Inside add New Order model");
        var productsInCart = cart.generateArray();

        var newOrderQuery = "INSERT INTO hiksaudi_js.gc_orders (customer_id, order_number, status, total, subtotal, ordered_on, address)\
                             VALUES (" + userId + "," + "\"" + microtime.now() + "\"" + "," + "\"cart\"" + "," + cart.totalPrice + "," + cart.totalPrice + "," + Date.now() + "," + "\"" + address + "\"" + ")";
        /*
            Insert a new order and get the id of the row inserted in order table
            The id would be used to add order items in order items table
         */

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
                    orderItemFunction(cart, result.insertId, (err) => {
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