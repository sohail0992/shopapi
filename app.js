﻿'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var hbs = require('express-handlebars');
var passport = require('passport');
var socket = require('socket.io');
var http = require('http');
var mySql = require("./config/database");
var mySqlStore = require('express-mysql-session')(expressSession);

//Controller Files
var updateProductScoket = require('./controllers/socketController');

var routes = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');
var cart = require('./routes/cart');

var app = express();

//Initializing session store
//var connection = await sessionController.getSessionStore();
var sessionStore = new mySqlStore({}, mySql)

//Using passport strategy
require('./config/passport');

// view engine setup
app.engine('hbs', hbs({ extname: ".hbs", defaultLayout: "layout", layoutsDir: __dirname + "/views/layouts/" }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: "824AE1",
  saveUninitialized: false,
  resave: false,
 cookie: { expires: new Date(253402300000000)},
  store:new mySqlStore({}, mySql)
}));
app.use(passport.initialize());
app.use(passport.session());

/* 
	Middleware to check if request is authenticated
    Making session available to be accessed in response
*/

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  var value=  req.session.save();
  console.log("Session", req.session); 
  console.log("Session ID", value);
  next();
});


app.use('/', routes);
app.use('/products', products);
app.use('/users', users);
app.use('/cart', cart);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// app.set('port', process.env.PORT || 3000);

// var server = app.listen(app.get('port'), function () {
//     debug('Express server listening on port ' + server.address().port);
// });

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.timeout = 600000;
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



var io = socket(server);
updateProductScoket.updateProductRealTime(io);