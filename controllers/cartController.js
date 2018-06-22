var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var Order = require('../models/order');

exports.addToCartController = function (req, res) {
    console.log("Inside add to cart controller");
    //req.assert("");

    var productId = req.query.id;
    var quantity = Number(req.query.quantity);
    var price=Number(req.query.price);
    if (!(/^[0-9]+$/.test(quantity))) {
        return res.json({
            status: 500,
            message: "Invalid quantity"
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

    product.findById(productId, function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {

            if (req.query.quantity == null) {
                try{
                    cart.addProductToCart(prod, productId,price);
                }
               catch(e){
                   if(e==1){
                    res.json({
                        status: 200,
                        message: "Product Already Exist, Kindly Check Your Cart",
                    })
                   }
                   if(e==2){
                    req.session.cart = cart;
                    console.log("Following items in session cart");
                    console.log(req.session.cart);
                    res.json({
                        status: 200,
                        message: "Product added successfully",
                        cartProducts: cart.generateArray(),
                    })
                   }
               }
            } else {
                try{
                    cart.addProductToCart(prod, productId, req.query.quantity,price);
                }
                catch(e){
                    if(e==1){
                        res.json({
                            status: 200,
                            message: "Product Already Exist, Kindly Check Your Cart",
                        })
                       }
                       if(e==2){
                        req.session.cart = cart;
                        console.log("Following items in session cart");
                        console.log(req.session.cart);
                        res.json({
                            status: 200,
                            message: "Product added successfully",
                            cartProducts: cart.generateArray(),
                        })
                       }
                }
           }
           
        }
    })
}
exports.addOfferToCartController = function (req, res) {
    console.log("Inside add to cart controller");
    var productId = Number(req.query.id);
    var quantity = Number(req.query.quantity);
    var number = Number(req.query.discount_price);
    if (!(/^[0-9]+$/.test(quantity))) {
        return res.json({
            status: 500,
            message: "Invalid quantity"
        })
    }

    /*
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart 
    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = new Product();

    product.findById(productId, function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            if (req.query.quantity == null) {
                cart.addOfferToCart(prod, productId);
            } else {
                console.log("discount", number);
                try{
                    cart.addOfferToCart(prod, productId, req.query.quantity, req.query.discount_price);
                }catch(e){
                    if(e==1){
                        res.json({
                            status: 200,
                            message: "Product Already Exist, Kindly Check Your Cart",
                        })
                    }
                    if(e==2){
                        req.session.cart = cart;
                        console.log("Following items in session cart");
                        console.log(req.session.cart);
                        res.json({
                            status: 200,
                            message: "Product added successfully",
                            cartProducts: cart.generateArray(),
            
                        })
                    }
                }
                }
        }
    })
}
exports.shoppingCartController = async function (req, res) {
    console.log("inside cart controller");
    if (!req.session.cart) {
        res.json({
            status: 200,
            message: "Empty Cart",
            cartProducts: { products: null }
        });
        return;
    }
    var user = new User();
    var ID = req.query.shippingId;
    var countryId = 0;
    var CountryRate = 0;
    var CityRate = 0;
    var COD = 0
    if (ID) {
        country = await user.getUserCountry(ID);
        CountryRate = await user.GetCountryAmount(country[0].country_id);
        CityRate = await user.getCityAmount(country[0].city);
        COD = CountryRate[0].tax + CityRate[0].tax;
        COD += 0
    }
    var cart = new Cart(req.session.cart);
    var flatRate = await cart.getFlatRate();
    var temp = await cart.getVatPrice();
    var Shipping = await cart.getShippingRate();
    var FlatRateConverstion = 0;
    var shippingRate = Number(Shipping.setting)
    var temp2 = Number(temp.setting);
    cart.totalPrice += COD;
    var cart_total = cart.totalPrice + ((cart.totalPrice / 100) * temp2);
    if (shippingRate > cart_total) {
        FlatRateConverstion = Number(flatRate.setting);
        cart_total += FlatRateConverstion;
        cart.totalPrice += FlatRateConverstion;
    }

    res.json({
        status: 200,
        cartProducts: cart.generateArray(),
        totalQty: cart.totalQty,
        totalPrice: cart_total,
        VAT: temp.setting + "%",
        FlatRate: FlatRateConverstion,
        SubTotal: cart.totalPrice,
        COD: COD,
    });
    return;
}
exports.finalCheckoutController = function (req, res) {
    var addressId = req.body.addressId;
    var shippingId = req.body.shippingId;
    var checkType = req.body.type;
    var Country = req.query.country;
    var user = new User();
    var order = new Order();
    console.log("executed 1");
    if (req.session.cart == null) {
        return res.json({
            status: 500,
            message: "Cannot proceed with empty cart"
        });
    }
    var user = new User();
    var ID = req.body.shippingId;
    var countryId = 0;
    var CountryRate = 0;
    var CityRate = 0;
    var COD = 0

    var cart = new Cart(req.session.cart);
    user.getUserAddressById(addressId, async function (err, addressRow) {
        console.log("address", addressRow);
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        }
        else {
            // var shippingAddress=await user.addUserShippingAddress(shippingId);
            if (ID) {
                country = await user.getUserCountry(ID);
                CountryRate = await user.GetCountryAmount(country[0].country_id);
                CityRate = await user.getCityAmount(country[0].city);
                COD = CountryRate[0].tax + CityRate[0].tax;
                COD += 0
            }
            var flatRate = await cart.getFlatRate();
            var temp = await cart.getVatPrice();
            var Shipping = await cart.getShippingRate();
            var FlatRateConverstion = 0;
            var shippingRate = Number(Shipping.setting)
            var temp2 = Number(temp.setting);
            var vat_difference = 0;
            cart.totalPrice += COD;
            var cart_total = cart.totalPrice + ((cart.totalPrice / 100) * temp2);
            vat_difference = cart_total - cart.totalPrice;
            if (shippingRate > cart_total) {
                FlatRateConverstion = Number(flatRate.setting);
                cart_total += FlatRateConverstion;
                cart.totalPrice += FlatRateConverstion;
                vat_difference = cart_total - cart.totalPrice;
            }
            // var temp = await cart.getVatPrice();
            // var Shipping = await cart.getShippingRate();
            // var shippingRate = Number(Shipping.setting) 
            // var temp2 = Number(temp.setting);
            // cart.totalPrice = cart.totalPrice + shippingRate;
            // cart.totalPrice+=COD;
            // var cart_total = cart.totalPrice + ((cart.totalPrice / 100) * temp2);
            order.addNewOrder(COD, FlatRateConverstion, vat_difference, cart_total, cart, req.user.id, addressId, checkType, temp2, FlatRateConverstion, addressRow[0].address1, shippingId, async function (err) {
                if (err) {
                    res.json({
                        status: 500,
                        message: err
                    })
                } else {

                    // var paymentData = await order.setPaymentTable(cart,req.user.id,addressId,checkType)
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

exports.editShoppingCartController = function (req, res) {
    console.log("Inside Edit to cart controller");
    //req.assert("");
    /*
    
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart

    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var product = new Product();
    var productId = Number(req.query.productId);
    var qty = Number(req.query.quantity);
    // var price=Number(req.query.price)
    product.findById(productId, async function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            req.session.cart = cart;

            cart.editProductfromCart(productId, qty, cart);
            console.log("Following items in session cart");
            console.log(req.session.cart);
            res.json({
                status: 200,
                message: "Product Edit successfully",
                data: req.session.cart,
            })
        }
    })
}
exports.deleteShoppingCartController = function (req, res) {
    console.log("Inside delete to cart controller");

    //req.assert("");
    /*
    
      If cart is already present in session then pass that old cart
      into the new Cart obj. Else create a new cart and pass it to 
      the new Cart

    */
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var product = new Product();
    var productId = Number(req.query.productId);
    var price_1 = req.query.price_1;
    product.findById(productId, function (err, prod) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            req.session.cart = cart;
            cart.deleteProductfromCart(productId, price_1, req.session.cart);
            console.log("Following items in session cart");
            console.log(req.session.cart);
            res.json({
                status: 200,
                message: "Product deleted successfully",
                data: req.session.cart,
            })
        }
    })
}


exports.checkCoupunController = function (req, res) {
    console.log("inside controller");
    var coupun = req.query.coupun;
    var cart = req.session.cart;
    var products = new Product();
    products.checkCoupun(coupun, cart, function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            if (result != 0) { 
                if (result[0].reduction_type == 'fixed') {
                    if (result[0].reduction_amount > cart.totalPrice) {
                        res.json({
                            status: 200,
                            message: "Coupun Amount Exceed, No Coupun Apply",
                        })
                    } else {
                        cart.totalPrice  = cart.totalPrice -  result[0].reduction_amount;
                        res.json({
                            status: 200,
                            message: "Coupun matched fixed",
                            data: result[0].reduction_amount, 
                        })
                    }
                }
                if (result[0].reduction_type == 'percent') {
                    cart.totalPrice  = cart.totalPrice - ((cart.totalPrice / 100) * result[0].reduction_amount);
                    res.json({
                        status: 200,
                        message: "Coupun matched percent",
                        data: result[0].reduction_amount,
                    })
                }
            } else {
                res.json({
                    status: 200,
                    message: "Coupun did not matched Please try again with different Coupon"
                })
            }
        }
    })
}