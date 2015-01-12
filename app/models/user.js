var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	username: String,
	password: String,
	email: String,

});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');