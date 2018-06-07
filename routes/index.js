'use strict';
var express = require('express');
var router = express.Router();
var Mail = require('../models/mail');

var productsController = require('../controllers/productController');

router.get('/',isLoggedIn, function(req, res){
    productsController.getCategoryController(req, res);
});

router.get('/categories', function(req, res){
    productsController.getAllCategoriesController(req, res);    
})

router.get('/Countries', function(req, res){
    productsController.getAllCountriesAndSities(req, res);    
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("user",req.user.id);
        next();
    }
    else{
        console.log("no user id found not logged in user",req.user);
        res.status(401).json({status:401, message: 'Please LoggedIn First to ' });
    }
}
module.exports = router;
