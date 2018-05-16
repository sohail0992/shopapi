'use strict';
var express = require('express');
var router = express.Router();
var Mail = require('../models/mail');

var productsController = require('../controllers/productController');

router.get('/', function(req, res){
    productsController.getCategoryController(req, res);
});

router.get('/categories', function(req, res){
    productsController.getAllCategoriesController(req, res);    
})

module.exports = router;
