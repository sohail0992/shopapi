var express = require('express');
var router = express.Router();

var productsController = require('../controllers/productController');

router.get('/category', function (req, res) {
    console.log("product controller executed");
    productsController.getSubCatProductsController(req, res);
});

router.get('/getAllProducts',function(req,res){
    productsController.getAll(req,res);
})
 
router.get('/product-details', function (req, res) {
    console.log("Inside product details route");
    productsController.getProductDetailsController(req, res);
});

router.get('/offers', (req, res) => {
    console.log("Inside offers");
    productsController.getOffers(req, res);
});
router.post('/SearchProduct', (req, res) => {
    console.log("In Route \n", req.body.productName);
    productsController.getProductSearchController(req, res);
})
router.post('/SearchProductIOS', (req, res) => {
    console.log("In Route \n", req.body.productName);
    productsController.getProductSearchControllerIOS(req, res);
})
router.get('/offers-details', function (req, res) {
    productsController.getOfferDetailsController(req, res);
});
router.get('/myOrder', function (req, res) {
    productsController.getMyOrderdetails(req,res);
}); 

router.get('/allOrders', function (req, res) {
    productsController.getAllOrders(req,res);
});

router.get('/myOrderDetails', function (req, res) {
    productsController.getMyOrderdetailsproductwise(req,res);
});
router.post('/product-review', function (req, res) {
    console.log("Inside product review route");
    req.assert("review", "Write any review to submit").notEmpty();
    req.assert("productId", "Enter a Product Id").notEmpty();
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    console.log("error length " + errorValues.length);
    if (errorValues.length > 0) {
        console.log("inside if");
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    }
    else {
        productsController.setProductReiview(req, res);
    }
});


module.exports = router;
