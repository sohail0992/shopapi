var mySql = require("../config/database");

var category = require("../models/category");
var product = require("../models/product");

/*
    This is an asynchronous function that fetch subcategories
    for each parent category. THe fetching of sub categories is synchronous
*/
async function getMainAndSubCat(parentCategories) {
    var mainCatImages = ["/sadaliaCats/Medicines&Treatments.png",
        "/sadaliaCats/Beauty&Care.png",
        "/sadaliaCats/Care.png",
        "/sadaliaCats/Supplement.png",
        "/sadaliaCats/Perfumes.png",
        "/sadaliaCats/ElectricalDevices.png",
    ];
    var mainCatArabicImages = [
        "/sadaliaCatsArabic/Medicines&Treatment.png",
        "/sadaliaCatsArabic/Beauty&Care.png",
        "/sadaliaCatsArabic/Care.png",
        "/sadaliaCatsArabic/Supplement.png",
        "/sadaliaCatsArabic/Perfumes.png",
        "/sadaliaCatsArabic/ElectricalDevices.png",
    ];

    //Return a promise when all subcategories are fetched for parent categories
    return new Promise(async function (resolve) {
        var catMainAndSub = []; //Array to save parent and their sub categories
        let categories1 = new category();   //Category class object
        for (i = 0; i < parentCategories.length; i++) {
            var subCategories = await categories1.getSubCatPromise(parentCategories[i].id); //The execution would wait until subcategories are fetched
            //Populating array with parent and subcategories
            //parentCategories[i].image = "http://hikvisionsaudi.com/9/uploads/images/full/" + mainCatImages[i];
            parentCategories[i].image = mainCatImages[i];
            parentCategories[i].arabic_images = mainCatArabicImages[i];
            catMainAndSub.push({
                "parentCategory": parentCategories[i],
                "childCategories": subCategories
            });
        }
        resolve(catMainAndSub); //Returning parent and subcategories when every thing executes correctly
    });
}
function getOffersWithImages(offers) {
    return new Promise(async function (resolve) {
        var products = new product();

        for (var i = 0; i < offers.length; ++i) {
            //Convert time remaining into minuites and hours
            var timeRemaining = offers[i].time_remaining;
            var hours = Math.floor(timeRemaining / 60);
            var mins = timeRemaining % 60;
            delete offers[i].time_remaining;
            offers[i].hours = hours;
            offers[i].minuites = mins;
            console.log("This offer id " + offers[i].id)

            var imagesArray = await products.getOfferImagePromise(offers[i].id);
            console.log("This is images Array" + imagesArray);
            offers[i].images = imagesArray;
            //console.log(offers[i]);
        }
        resolve(offers);
    });
}
/*
    This controller returns all the parent categories
 */
exports.getCategoryController = function (req, res) {
    var mainCatImages = ["/sadaliaCats/Beauty&Care.png",
        "/sadaliaCats/Care.png",
        "/sadaliaCats/ElectricalDevices.png",
        "/sadaliaCats/Medicines&Treatment.png",
        "/sadaliaCats/Perfumes.png",
        "/sadaliaCats/Supplement.png"];

    var mainCatArabicImages = ["/sadaliaCatsArabic/Beauty&Care.png",
        "/sadaliaCatsArabic/Care.png",
        "/sadaliaCatsArabic/ElectricalDevices.png",
        "/sadaliaCatsArabic/Medicines&Treatment.png",
        "/sadaliaCatsArabic/Perfumes.png",
        "/sadaliaCatsArabic/Supplement.png"];
    res.json({
        mainCatImages: mainCatImages,
        mainCatArabicImages: mainCatArabicImages
    });
}

/*
    This controller takes the parent category id and
    return all the ssub categories that are in the parent
    category
 */
exports.getAllCategoriesController = function (req, res) {
    var categories = new category();

    categories.getCategories(async function (err, result) {
        //Get parent categories
        var parentCategories = result;
        //Now this function will call another async function and await to get the result
        var catAndTheirSubCat = await getMainAndSubCat(parentCategories);   //execution awaiting until all parent and subcategories are fetched
        console.log("Outside loop");
        res.json({
            status: 200,
            data: catAndTheirSubCat
        });
    });

}

/*
    This controller takes the sub category id of a category
    and return all the products that are in the sub category
 */
exports.getSubCatProductsController = function (req, res) {
    var products = new product();
    products.getSubCatProd(req.query.subCategoryId, function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            //console.log(result);
            for (var i = 0; i < result.length; ++i) {
                //Data object contains the list of products
                //Replace [0] with the iterating variable through which you are listing all products
                var productImageObj = result[i].images;
                //Parse the productImageObj
                var productImageObj = JSON.parse(productImageObj);
                //Get the value of first property from image object
                var imageFirstProp = productImageObj[Object.keys(productImageObj)[0]]
                //Extract image filename from image first property object
                var imageLink = imageFirstProp.filename;
                //Concatenate image name with remote repository url
                result[i].images = "http://hikvisionsaudi.com/9/uploads/images/full/" + imageLink;
            }
            res.json({
                status: 200,
                data: result
            });
        }
    });
}

/*
    This controller takes a single product id
    and returns all the details of that product
 */
exports.getProductDetailsController = function (req, res) {
    var products = new product();

    console.log("Product id entered " + req.query.productId);
    products.getProductDetails(req.query.productId, function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            res.json({
                status: 200,
                data: result
            });
        }
    });
}

exports.getProductSearchController = function (req, res) {
    var products = new product();
    console.log("name to search " + req.body.productName);
    products.getProductBySearch(req.body.productName, function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        } else {
            if (result.length != 0) {
                //console.log(result);
                for (var i = 0; i < result.length; ++i) {
                    //Data object contains the list of products
                    //Replace [0] with the iterating variable through which you are listing all products
                    var productImageObj = result[i].images;
                    //Parse the productImageObj
                    var productImageObj = JSON.parse(productImageObj);
                    //Get the value of first property from image object
                    var imageFirstProp = productImageObj[Object.keys(productImageObj)[0]]
                    //Extract image filename from image first property object
                    var imageLink = imageFirstProp.filename;
                    //Concatenate image name with remote repository url
                    result[i].images = "http://hikvisionsaudi.com/9/uploads/images/full/" + imageLink;
                    // for Arabic

                    var productImageObj = result[i].arabic_images;
                    //Parse the productImageObj
                    var productImageObj = JSON.parse(productImageObj);
                    //Get the value of first property from image object
                    var imageFirstProp = productImageObj[Object.keys(productImageObj)[0]]
                    //Extract image filename from image first property object
                    var imageLink = imageFirstProp.arabic_filename;
                    //Concatenate image name with remote repository url
                    result[i].arabic_images = "http://hikvisionsaudi.com/9/uploads/images/full/" + imageLink;


                }
                res.json({
                    status: 200,
                    data: result
                });
            }
            else {
                res.json({
                    status: 200,
                    message: "No Matching Product Found"
                });

            }

        }
    });
}
exports.getOffers = function (req, res) {
    var products = new product();

    console.log("inside offers controller");
    products.getOffers(async function (err, result) {
        if (err) {
            res.json({
                status: 500,
                message: err
            });
        }
        else {
            //Fetch images for offers
            console.log("Inside else");
            var offerWithImagesProm = await getOffersWithImages(result);
            res.json({
                status: 200,
                message: offerWithImagesProm
            });
        }
    })
}
exports.getOfferDetailsController = function(req, res){
    console.log("inside controller");
    var offerId = req.query.offerId;
    var products = new product();
    products.getOfferDetails(offerId, function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            console.log("after",result);
            res.json({
                status:200,
                message: result
            })
        }
    })

}

