'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/userController');
var User = require('../models/user');

var Product = require('../models/product');


/* GET users listing. */
router.get('/register', function(req, res) {
    res.render('signup', {});
});

router.post('/register', function(req, res, next) {
    req.checkBody("first_name", "Enter a valid user name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.checkBody("last_name", "Enter a valid user name").matches(/^[a-zA-Z\s]*$/).notEmpty();
    req.assert("mobile", "Enter a valid mobile no").matches(/^[0-9]*$/);
    req.assert("email", "Enter a valid email").isEmail().notEmpty();
    req.checkBody("company_name", "Enter Valid company name").matches(/^[a-zA-Z\s]*$/)
    req.checkBody("password", "Enter a valid password").notEmpty();
        // req.checkBody("c_password", "Enter a valid password").notEmpty();
        // if (req.body.password != req.body.c_password) {
        //     return res.json({
        //         status: 422,
        //         message: "Password didn't match",
        //         errors: error
        //     });
        // }
    var error = req.validationErrors(true);
    var errorValues = Object.keys(error);
    // console.log("error length " + errorValues.length);
    if (errorValues.length > 0) {
        console.log("inside if");
        return res.json({
            status: 422,
            message: "Validation errors",
            errors: error
        });
    } else {
        passport.authenticate('local-register', function(err, user, info) {
            if (err) {
                return res.json({
                    status: 500,
                    message: err
                });
            }
            if (!user) {
                return res.json({
                    status: 500,
                    message: info.message
                });
            }

            req.logIn(user, function(err) {
                if (err) {
                    return res.json({
                        status: 500,
                        message: err
                    });
                }
                return res.json({
                    status: 200,
                    message: "User successfully logged in",
                    user: user
                })
            });
        })(req, res, next);
    }

});

/*
router.post('/register', passport.authenticate('local-register',{
    successRedirect: '/users/verification',
    failureRedirect: '/users/verification',
    failureFlash: false
}));
*/
router.get('/signin', function(req, res) {
    res.render('signin', {});
});

router.post('/signin', function(req, res, next) {
    req.assert("password", "Password field cannot be empty").notEmpty();
    req.assert("email", "Enter a valid email").isEmail().notEmpty();
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
    } else {
        passport.authenticate('local-signin', function(err, user, info) {
            console.log("Authentication");
            if (err) {
                console.log("Inside first if");
                return res.json({
                    status: 500,
                    message: err
                });
            }

            if (!user) {
                console.log("Inside second if");
                return res.json({
                    status: 500,
                    message: info.message
                });
            }

            req.logIn(user, function(err1) {
                if (err1) {
                    console.log("Inside error");
                    return res.json({
                        status: 500,
                        message: err1
                    });
                }
                return res.json({
                    status: 200,
                    message: "Successful login",
                    user: req.user
                })
            });
        })(req, res, next);
    }

});

router.get('/logout', function(req, res) {
    req.logout();
    res.json({
        status: 200,
        message: "User logged out successfully"
    });
});

router.get('/addresses', isLoggedIn, function(req, res) {
    userController.getUserAddressController(req, res);
});

router.post('/addresses', isLoggedIn, function(req, res) {
    userController.addUserAddressController(req, res);
});

router.post('/addCityCountryaddresses', isLoggedIn, function(req, res) {
    userController.addUserCityCountry(req, res);
});

router.post('/accountUpdate', isLoggedIn, function(req, res) {
    userController.EditAccountInformation(req, res);
});

router.get('/forgot', function(req, res) {
    res.render('forgetPasswordMain', {});
});

router.post('/forgot', function(req, res) {
    userController.forgotPassController(req, res);
});

router.get('/reset/:id/:token', function(req, res) {
    var user = new User();
    console.log(req.params,'par')
    user.findById(req.params.id, function(err, resultUser) {
        if (err)
            throw err;
        if (!Array.isArray(resultUser) || !resultUser.length) {
            return res.json({
                status: 500,
                message: "No User found against this id"
            })
        }
        if (resultUser[0].resetPasswordToken != req.params.token) {
            res.json({
                status: 500,
                message: "Incorrect Token Entered"
            });
        } else if (resultUser[0].resetPasswordDate < Date.now()) {
            res.json({
                status: 500,
                message: "Token has been expired"
            })
        } else {
            console.log('userController')
            res.redirect("/users/reset-password/" + resultUser[0].id + "/" + resultUser[0].resetPasswordToken);
        }
    });
});

router.get('/reset-password/:id/:token', function(req, res) {
    var user = new User();
    // console.log('hey',id)
    console.log('no',req.params)
    user.findById(req.params.id, function(err, resultUser) {
        if (err)
            throw err;
       if (!Array.isArray(resultUser) || !resultUser.length) {
        return res.json({
            status: 500,
            message: "No User found against this id"
        })
       }
       if (resultUser[0].resetPasswordToken != req.params.token) {
            res.json({
                status: 500,
                message: "Incorrect Token Entered"
            });
        } else if (resultUser[0].resetPasswordDate < Date.now()) {
            res.json({
                status: 500,
                message: "Token has been expired"
            })
        } else {
            res.redirect("/users/reset-password/" + resultUser[0].id + "/" + resultUser[0].resetPasswordToken);
        }
    });
});


//jeddahsp_mirza
//Learn@99

router.post('/reset-password/:id/:token', function(req, res) {
    var user = new User();
    if ((req.body.password == null) || (req.body.confirmPassword == null)) {
        res.json({
            status: 500,
            message: "Password fields cannot be empty"
        })
    }
    user.findById(id, function(err, userResult) {
        if (err)
            throw err;
        var passwordHash = user.generatePasswordHash(req.body.password);
        user.setUserPassword(userResult[0].id, passwordHash, function(err, result) {
            if (err)
                throw err;
            res.redirect("/users/sign")
        })
    });
});

router.post('/update_password', function(req, res) {
    var user = new User();
    if ((req.body.email == null) || (req.body.oldpass == null) || (req.body.newpass == null)) {
        res.json({
            status: 500,
            message: "Required fields are email , oldpass and newpass"
        })
    }
    var email = req.body.email;
    var newpass = req.body.newpass;
    var oldpass = req.body.oldpass;
    user.findByEmail(email, function(err, userResult) {
        if (err)
            throw err;
        if (!Array.isArray(userResult) || !userResult.length) {
            return res.json({
                status: 500,
                message: "No User found against this emial"
            })
              // array does not exist, is not an array, or is empty
        }

        console.log(userResult, 'user')
        var oldPasswordHash = user.generatePasswordHash(oldpass);
        // console.log(oldPasswordHash, 'pass')
        if (oldPasswordHash === userResult[0].password) {
            var newPasswordHash = user.generatePasswordHash(newpass);
            user.setUserPassword(userResult[0].id, newPasswordHash, function(err, result) {
                if (err)
                    throw err;
                res.json({
                    status: 200,
                    message: "Password updated successfully"
                })
            })
            console.log('done')
        } else {
            res.json({
                status: 500,
                message: "Old Pass is Incorrect"
            })

        }

    });
});

router.get('/verification', function(req, res) {
    res.render('verification', {});
});

router.post('/verification', verificationMiddleWare, function(req, res, next) {
    console.log(req.body)
    return
    console.log("Inside verification post");
    passport.authenticate('local-signin', function(err, user, info) {
        console.log("Inside passport authenticate callback");
        if (err) {
            return res.json({
                status: 500,
                message: err
            });
        }
        if (!user) {
            return res.json({
                status: 500,
                message: info.message
            });
        }

        req.logIn(user, function(err) {
            if (err) {
                return res.json({
                    status: 500,
                    message: err
                });
            }
            return res.json({
                status: 200,
                message: "User successfully logged in"
            })
        });
    })(req, res, next);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("user", req.user.id);
        next();
    } else {
        console.log("no user id found not logged in user", req.user);
        res.json({
            status: 200,
            message: "User must be logged in"
        });
    }
}

function verificationMiddleWare(req, res, next) {
    if(!req.body.email || ! req.body.password || !req.body.code) {
        return res.status(500).send("Make sure to provide all paramerter email,password and code")
    }
    var email = req.body.email;
    var password = req.body.password;
    var verificationCode = req.body.code;

    var user = new User();
    user.findByEmail(email, function(err, userResult) {
        console.log("The email entered " + email);
        if (err) {
            res.json({
                status: 500,
                message: "Incorrect User Email"
            });
        }

        if (!Array.isArray(userResult) || !userResult.length) {
            return res.json({
                status: 500,
                message: "No User found against this email"
            })
        }

        if (user.validPassword(req.body.password, userResult[0].password)) {
            console.log("The user feteched " + userResult[0].id);
            console.log("Verification Code " + verificationCode);
            console.log("User database code " + userResult[0].verification_code);
            if (userResult[0].verification_code == verificationCode) {
                console.log("Verification code is correct");
                console.log("Verification Status" + userResult[0].verification_status);
                user.updateVerificationStatus(userResult[0].id, true, function(err, result) {
                    //After the verification status is set true
                    //Use the signin strategy for user login
                    if (err)
                        throw err;
                    console.log("Verification status updated");
                    return res.json({
                        status: 200,
                        message: "verfied login"
                    });
                });

            }
        } else {
            res.json({
                status: 500,
                message: "Incorrect Password"
            });
        }

    });
}

function isVerified(req, res, next) {
    var user = new User();
    user.findByEmail(req.body.email, function(err, user) {
        console.log("user retrieved in middleware");
        if (user[0].verification_status == true) {
            next();
        } else {
            res.json({
                status: 500,
                message: "User Not Verified"
            });
        }
    });
}

module.exports = router;