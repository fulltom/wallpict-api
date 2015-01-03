// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var busboy = require('connect-busboy');
var moment = require('moment');
var itemCtr = require('./app/controllers/item');
var userCtr = require('./app/controllers/user');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(busboy({ immediate: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.use("/public", express.static(__dirname + '/public'));

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/items'); // connect to our database


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


// Create endpoint handlers for /users
router.route('/users')
  .post(userCtr.postUsers)
  .get(userCtr.getUsers);


// // LIKE ROUTE -------------------------------
// router.route('/item/:item_id/like')
// 	.post(function(req, res) {
// 		Item.update({_id:req.params.item_id}, {$inc:{"likes":1}}, function(err, item) {
// 			if (err)
// 				res.send(err);
// 				res.json({ message: 'Succefully increment like' });
// 		});
// 	})
// 	.put(function(req, res) {
// 		Item.update({_id:req.params.item_id}, {$inc:{"likes":-1}}, function(err, item) {
// 			if (err)
// 				res.send(err);
// 				res.json({ message: 'Succefully decrement like' });
// 		});
// 	})
// 	.get(function(req, res) {
// 		Item.find({_id:req.params.item_id, "likes":{'$exists': true }}, function(err, item) {
// 			if (err)
// 				res.send(err);
// 			res.json(item[0].likes);
// 		});
// 	})

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

//END ROUTES FOR OUR API
// =============================================================================


// ROUTES FOR WEBAPP
// =============================================================================
app.get('/', function(req, res) {
    res.render('index', {moment : moment});
});
app.post('/', function(req, res) {
    res.render('index');
});


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server Started on ' + port);
