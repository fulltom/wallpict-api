var mongoose     = require('mongoose');
<<<<<<< HEAD
var Schema       = mongoose.Schema;

||||||| merged common ancestors
var Schema       = mongoose.Schema;


=======
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

>>>>>>> FETCH_HEAD
var ItemSchema   = new Schema({
	createdAt: { type : Date, default : Date.now },
	tags: {type: []},
	imageURI : {type : String},
	comment : {type : String},
	likes : {type : Number},
<<<<<<< HEAD
	_created_by : { type: Schema.Types.ObjectId, ref: 'User' },
||||||| merged common ancestors
	created_by : { type: Number, ref: 'User' }

=======
	created_by : { type: ObjectId, ref: 'User' }

>>>>>>> FETCH_HEAD
});

mongoose.model('Item', ItemSchema);
module.exports = mongoose.model('Item');