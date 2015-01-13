// BASE SETUP
// =============================================================================

// Call the packages we need
var express        = require('express');
var bodyParser     = require('body-parser');
var app            = express();
var morgan         = require('morgan');
var busboy         = require('connect-busboy');
var moment         = require('moment');
var passport       = require('passport');
var expressSession = require('express-session');
//var config = require('./config/cookie.json');
var cookieParser       = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(expressSession);

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wallpict'); // connect to our database

// call controllers
var itemCtr = require('./app/controllers/item');
//var userCtr = require('./app/controllers/user');

// Configuring app
app.use(morgan('dev')); // log requests to the console
app.use(busboy({ immediate: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressSession({
	saveUninitialized: true,
    cookie: {  httpOnly: true, maxAge: 1000*60*2 } ,
    secret: "viadeo",
    store:new MongoStore({
            db: 'wallpict',
            collection: 'session',
            auto_reconnect:true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/public", express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');


var port     = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	next();
});


//Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'welcome to our api!'});
});

// Create endpoint handlers for /items
router.route('/items')
	.post(itemCtr.postItems)
	.get(itemCtr.getItems);

// Create endpoint handlers for /items/:items_id
router.route('/items/:item_id')
	.get(itemCtr.getItem)
	.put(itemCtr.putItem)
	.delete(itemCtr.deleteItem);

//REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

//END ROUTES FOR OUR API
// =============================================================================

// Initialize Passport
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./app/passport/init');
initPassport(passport);

var routes = require('./app/routes/index')(passport);
app.use('/', routes);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server Started on ' + port);
