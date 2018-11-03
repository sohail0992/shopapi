var express = require('express');
var router = express.Router();
var connection = require('../config/database');
var cloudinary = require('../config/cloudinary');
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

var imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/payment-slip', upload.single('image'), function(req, res) {
    if (!(req.body)) {
        res.status(404).end('someting wrong');
        return;
    }
    if (req.file) {
        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
            if (err) {
                res.status(404).end(err.message);
                return;

            } else {
                if(req.body.payment_id){
                    var sql = "Update jeddahsp_cement.gc_payments Set payment_slip_image=?,payment_slip_id=? Where payment_id=?"
                    connection.query(sql, [result.secure_url,result.public_id,req.body.payment_id], function(error, rows) {
                        if (error) res.end(JSON.stringify(error))
                       return res.send({
                            status: 200,
                            cloudinaryInfo : result,
                            mysqlInfo : JSON.stringify(rows)
                        });
                    })
                }else{
                    res.json({
                        status : 200,
                        cloudinaryResponse : result,
                        message : "You can fetcht this image using /fetch api by providing url from response.The record in db not stored because you haven't provided the payment_id"
                    })
                }
              
            }
        });
    }else{
        res.status(500).end("Choose image to upload")
    }
});

router.put('/fetch', function(req, res) {
    if (!(req.body.url)) {
        res.status(404).end('Provide URL Please');
        return;
    }
    var image =  cloudinary.image(req.body.url, {type: "fetch"})
    if(image){
        res.send({
            status:200,
            img: image
        })
    }else{
        res.send(500).end("No image found")
    }
})

router.post('/upload', upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            return res.status(500).end(err);
        } else {
            res.json(result)
        }

    });
});

module.exports = router;