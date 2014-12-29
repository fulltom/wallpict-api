// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var awsUpload = require('./aws-streaming');
var busboy = require('connect-busboy');
var moment = require('moment');


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
var Item     = require('./app/models/item');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	next();
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'welcome to our api!'});
});

// on routes that end in /item
// ----------------------------------------------------
router.route('/item')
	// create a bear (accessed at POST http://localhost:8080/item)
	.post(function(req, res) {
		return awsUpload(req, function(err) {
	      //res.json({ message: 'Item created in db' });
	      res.redirect('/')
	    });
	})

	// get all the items with pagination (accessed at GET http://localhost:8080/api/items?page=1)
	.get(function(req, res) {
		var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
		var limit = req.param('limit') || 5
	Item
		.find()
		.limit(limit)
		.skip(limit * page)
		.sort({createdAt: 'desc'})
		.exec(function (err, items) {
		  Item.count().exec(function (err, count) {
		    res.json('items', {
		        items: items
		      , page: page
		      , pages: Math.floor(count / limit)
		    })
		  })
		})
	});

// on routes that end in /item/:item_id
// ----------------------------------------------------
router.route('/item/:item_id')

	// get the bear with that id
	.get(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {
			if (err)
				res.send(err);
			res.json(item);
		});
	})

	// update the item with this id
	.put(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {

			if (err)
				res.send(err);

			item.pseudo = req.body.pseudo;
			item.tags = req.body.tags;
			item.imageURI = req.body.imageURI;

			item.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Item updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Item.remove({
			_id: req.params.item_id
		}, function(err, item) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// LIKE ROUTE -------------------------------
router.route('/item/:item_id/like')
	.post(function(req, res) {
		Item.update({_id:req.params.item_id}, {$inc:{"likes":1}}, function(err, item) {
			if (err)
				res.send(err);
				res.json({ message: 'Succefully increment like' });
		});
	})
	.put(function(req, res) {
		Item.update({_id:req.params.item_id}, {$inc:{"likes":-1}}, function(err, item) {
			if (err)
				res.send(err);
				res.json({ message: 'Succefully decrement like' });
		});
	})

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);


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
console.log('Magic happens on port ' + port);
