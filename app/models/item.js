var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var getTags = function (tags) {
  return tags.join(',');
};

var setTags = function (tags) {
  return tags.split(',');
};

var ItemSchema   = new Schema({
	pseudo: {type : String, default : '', trim : true},
	createdAt: { type : Date, default : Date.now },
	tags: {type: [], get: getTags, set: setTags},
	imageURI : {type : String},
	comment : {type : String}
});

module.exports = mongoose.model('Item', ItemSchema);