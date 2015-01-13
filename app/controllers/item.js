var Item = require('../models/item');
var awsUpload = require('../../aws-streaming');

// Create endpoint /api/beers for POSTS
exports.postItems = function(req, res) {
	return awsUpload(req, function(err) {
      //res.json({ message: 'Item created in db' });
      res.redirect('/')
    });
};

// Create endpoint api/items?page=1 for GET
exports.getItems = function(req, res) {
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	var limit = req.param('limit') || 5
	Item
	.find()
	.populate('_created_by', 'username')
	.limit(limit)
	.populate('created_by')
	.skip(limit * page)
	.sort({createdAt: 'desc'})
	.exec(function (err, items) {
		 console.log('The creator is %s', items);
	  Item.count().exec(function (err, count) {
	    res.json('items', {
	        items: items
	      , page: page
	      , pages: Math.floor(count / limit)
	    })
	  })
	})
};

// Create endpoint /api/items/:item_id for GET
exports.getItem = function(req, res) {
	Item.findById(req.params.item_id, function(err, item) {
		if (err)
			res.send(err);
		res.json(item);
	});
};

// Create endpoint /api/items/:item_id for PUT
exports.putItem = function(req, res) {
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
}

exports.deleteItem = function(req, res) {
	Item.remove({
		_id: req.params.item_id
	}, function(err, item) {
		if (err)
			res.send(err);

		res.json({ message: 'Successfully deleted' });
	});
};