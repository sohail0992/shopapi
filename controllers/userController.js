var User = require('../models/user');
var Mail = require('../models/mail');
var crypto = require('crypto');

exports.getRegisterController = function(req, res){
    res.render('signup', {});
}

exports.getUserAddressController = function(req, res){
    var user = new User();
    console.log("User id in address",req.user.id)
    user.getUserAddresses(req.user.id, function(err, rows){
        console.log("Get address callback");
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            res.json({
                status: 200,
                data: rows
            });
        }
    }) 
}

exports.addUserAddressController =async function(req, res){
    var user = new User();
    var name = JSON.stringify(req.body.city);
    console.log("city",req.body.city);
    let cityId= await user.getCityId(name);
    console.log("c",cityId,cityId[0].id);
    var addressData = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        addressDesc: req.body.adressDesc,
        locName:JSON.stringify(req.body.locationName),
        city:JSON.stringify(req.body.city),
        country:JSON.stringify(req.body.country),
        country_id:req.body.country_id,
        zone_id:JSON.stringify(cityId[0].id),
    }
    user.addUserAddress(req.user.id, addressData, function(err, result){
        if(err){
            res.json({
                status: 500,  
                message: err
            });
        } else {
            res.json({
                status: 200,
                message: "Address added successfully"
            });
        }
    })
}

exports.addUserCityCountry =async function(req, res){
    var user = new User();
    var name = JSON.stringify(req.body.city);
    console.log("city",req.body.city);
    let cityId= await user.getCityId(name);
    console.log("c",cityId,cityId[0].id);
    var addressData = {
        address1: req.body.adressDesc,
        city:JSON.stringify(req.body.city),
        country:JSON.stringify(req.body.country)
    }
    user.addCityCountry(req.user.id, addressData, function(err, result){
        if(err){
            res.json({
                status: 500,  
                message: err
            });
        } else {
            res.json({
                status: 200,
                message: "Address added successfully"
            });
        }
    })
}

exports.EditAccountInformation = function(req, res){
    var user = new User();
    var addressData = {
        firstname: req.body.firstname,
        email: req.body.email,
        phone: req.body.phone
    }
    
    console.log("Printing req.user.id" + req.user.id);
    user.editInfo(req.user.id, addressData, function(err, result){
        if(err){
            res.json({
                status: 500,
                message: err
            });
        } else {
            res.json({
                status: 200,
                message: "Account Info Updated successfully",
                data:result,
            });
        }
    })
}


exports.forgotPassController = function(req, res){
    if(!req.body.email) {
        return res.status(500).send("Please Provide email");
    }
    var user = new User();
    var userEmail = req.body.email;
    var mail = new Mail();
    var mailSubject = "";
    var mailText = "";
    //Fetch the user using email
    user.findByEmail(userEmail, function(err, userResult){
            if(err){
               return res.json({
                    status: 500,
                    message: err
                });
            }
            if (!Array.isArray(userResult) || !userResult.length) {
                return res.json({
                    status: 500,
                    message: "No User found against this email"
                })
            }
            //Generate Reset Password Token
            var resetPassToken = null;
            crypto.randomBytes(20, function(err, buff){
                resetPassToken = buff.toString('hex');
                var tokenExpirationTime = Date.now() + 3600000;

                user.setForgotPassTokenAndTime(userResult[0].id, resetPassToken, tokenExpirationTime, function(err, result){
                    if(err){
                        return console.log(err);
                    }
                    console.log("Sending mail")
                    mailSubject+= "Password Reset Request";
                    mailText += "You are recieving this email because you (or someone else) has requested the reset of the password for" + 
                                "your account. Please Use the following link, or paste it in your browser to set new password \n" +
                                "http://" + req.headers.host + "/reset/" + userResult[0].id + "/" + resetPassToken + "\n\n" +
                                "If you did'nt request this, please ignore this email and password";
                    
                    //Instantiating Mail object
                    var mail = new Mail();
                    //Initializing mail transporter
                    var transporter = mail.getTransporter("gmail", "cementapp93@gmail.com", "PasswordPassword");
                    //Sending mail using the instantiated transporter
                    mail.sendMail(userResult[0].email, "sadaliahiksaudi@gmail.com", "Cement Verification Code", mailText, transporter);
                    //Set the authentication to false since user has to verify it registration
                    console.log("Mail has been send");
                    res.json({
                        status: 200,
                        message: "Check you email " + userResult[0].email + " for password reset link"
                    })
                });

            });

                //Set token expiration time one hour after current timea
            
    });

}

