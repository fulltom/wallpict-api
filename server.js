// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var multer  = require('multer');
var multiparty  = require('multiparty');

//S3 part
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
var s3 = new AWS.S3();
var bucketParams = {Bucket: 'myBucket'};
s3.createBucket(bucketParams)
var s3Bucket = new AWS.S3( { params: {Bucket: 'wallpictstore'} } )

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(multer({ dest: './uploads/'}))

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
	res.json({ message: 'hooray! welcome to our api!'});
});

// on routes that end in /item
// ----------------------------------------------------
router.route('/item')

	// create a bear (accessed at POST http://localhost:8080/item)
	.post(function(req, res) {

		var item = new Item();		// create a new instance of the Item model

		// var form = new multiparty.Form();
	 //    var destPath;
	 //    form.on('field', function(name, value) {
	 //      if (name === 'path') {
	 //        destPath = value;
	 //      }
	 //    });
	 //    form.on('part', function(part) {
	 //    	console.log(part)
	 //      s3.putObject({
	 //        Bucket: s3Bucket,
	 //        Key: destPath,
	 //        ACL: 'public-read',
	 //        Body: part,
	 //        ContentLength: part.byteCount,
	 //      }, function(err, data) {
	 //      	console.log(data)
	 //        if (err) throw err;
	 //        console.log("done", data);
	 //        res.end("OK");
	 //        console.log("https://s3.amazonaws.com/" + bucket + '/' + destPath);
	 //      });
	 //    });
	 //    form.parse(req);
	    //res.json({ message: 'Ok' });
		// var data = {Key: req.files.image.originalname, Body: req.files.image.path};
		// s3Bucket.putObject(data, function(err, data){
		//     if (err)
		//     { console.log('Error uploading data: ', data);
		//     } else {
		//       console.log('succesfully uploaded the image!');
		//     }
		// });

		// item.pseudo = req.body.pseudo;  // set the items name (comes from the request)
		// item.tags = req.body.tags;
		// item.imageURI = req.body.imageURI;

		// item.save(function(err) {
		// 	if (err)
		// 		res.send(err);

		// 	res.json({ message: 'Item created!' });
		// });
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


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
