var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var Log   = new Schema({
	userAgent: {type : String},
	logIn : {type : String},
	logOut : {type : String},
	ip : {type : String},
	country : {type : String}
});

mongoose.model('Log', ItemSchema);
module.exports = mongoose.model('Log');