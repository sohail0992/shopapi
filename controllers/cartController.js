var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var Order = require('../models/order');

exports.addToCartController = function(req, res){
    console.log("Inside add to cart controller");
    
    //req.assert("");
    
    var productId = req.query.id;
    var quantity = Number(req.query.quantity);
    if( !(/^[0-9]+$/.test(quantity)) ){
        return res.json({
            status: 500,
            message:"Invalid quantity"
        })
    }
    console.log("The value of product id is" + productId);
    /*
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart 
    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    var product = new Product();

    product.findById(productId, function(err, prod){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            


            if(req.query.quantity == null){
                cart.addProductToCart(prod, productId);
            } else {
                cart.addProductToCart(prod, productId, req.query.quantity);
            }
            req.session.cart = cart;
            
            console.log("Following items in session cart");
            console.log(req.session.cart);

            res.json({
                status: 200,
                message: "Product added successfully"
            })
        }
    })    
}
exports.addOfferToCartController = function(req, res){
    console.log("Inside add to cart controller");
    var productId = req.query.id;
    var quantity = Number(req.query.quantity);
    var number = Number(req.query.discount_price);
    if( !(/^[0-9]+$/.test(quantity))){
        return res.json({
            status: 500,
            message:"Invalid quantity"
        })
    }
    console.log("The value of product id is" + productId);
    console.log("Discount price " + req.query.discount_price + typeof(number));
    /*
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart 
    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = new Product();

    product.findById(productId, function(err, prod){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            if(req.query.quantity == null){
                cart.addOfferToCart(prod, productId);
            } else {
                console.log("discount",number);
                cart.addOfferToCart(prod, productId, req.query.quantity,req.query.discount_price);
            }
            req.session.cart = cart;
            console.log("Following items in session cart");
            console.log(req.session.cart);
            res.json({
                status: 200,
                message: "Product added successfully"
            })
        }
    })    
}
exports.shoppingCartController = function(req, res){
    console.log("inside cart controller");
    if(!req.session.cart){
        res.json({
            status: 200,
            cartProducts: {products: null}
       });
       return;
    }
    
    var cart = new Cart(req.session.cart);
    res.json({
        status: 200,
        cartProducts: cart.generateArray(),
        totalQty: cart.totalQty,
        totalPrice: cart.totalPrice
    });
    return;
}

exports.finalCheckoutController = function(req, res){
    var addressId = req.body.addressId;
    var user = new User();    
    var order = new Order();
    console.log("executed 1");
    if(req.session.cart == null) {
        return res.json({
                    status: 500,
                    message: "Cannot proceed with empty cart"
                });
    }
    var cart = new Cart(req.session.cart);
    user.getUserAddressById(addressId, function(err, addressRow){
        console.log("address",addressRow);
        if(err){
            res.json({
                status: 500,
                message: err
            });
        }
        else{
            order.addNewOrder(cart, req.user.id, addressRow[0].address, function(err){
                if(err){
                    res.json({
                        status: 500,
                        message: err
                    })
                } else {
                    req.session.cart = null;
                    res.json({
                        status: 200,
                        message: "order placed successfully"
                    })
                }
                    
            });
        }
    });
}

exports.checkCoupunController = function(req, res){
    // var product = new product();
    // console.log("Product id entered " + req.query.productId);
    // product.checkCoupun(req.query.productId, function (err, result) {
    //     if (err) {
    //         res.json({
    //             status: 500,
    //             message: err
    //         });
    //     } else {
    //         res.json({
    //             status: 200,
    //             data: result
    //         });
    //     }
    // });
}