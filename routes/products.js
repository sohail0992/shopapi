var express = require('express');
var router = express.Router();

var productsController = require('../controllers/productController');

router.get('/category', function(req, res){
    console.log("product controller executed");
    productsController.getSubCatProductsController(req, res);
});

router.get('/product-details', function(req, res){
    console.log("Inside product details route");
    productsController.getProductDetailsController(req, res);
});

router.get('/offers', (req, res) => {
    console.log("Inside offers");
    productsController.getOffers(req, res);
});

router.post('/SearchProduct',(req,res)=>{
    console.log("In Route \n",req.body.productName);
    productsController.getProductSearchController(req,res);
})

router.get('/offers-details', function(req, res){
    productsController.getOfferDetailsController(req, res);
});
module.exports = router;
