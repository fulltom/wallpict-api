var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
	createdAt: { type : Date, default : Date.now },
	tags: {type: []},
	imageURI : {type : String},
	comment : {type : String},
	likes : {type : Number},
	_created_by : { type: Schema.Types.ObjectId, ref: 'User' }

mongoose.model('Item', ItemSchema);
module.exports = mongoose.model('Item');