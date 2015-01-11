var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ItemSchema   = new Schema({
	pseudo: {type : String, default : '', trim : true},
	createdAt: { type : Date, default : Date.now },
	tags: {type: []},
	imageURI : {type : String},
	comment : {type : String},
	likes : {type : Number}

});

mongoose.model('Item', ItemSchema);
module.exports = mongoose.model('Item');