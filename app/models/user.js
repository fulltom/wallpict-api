var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	username: String,
	password: String,
	email: String,

});
<<<<<<< HEAD

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
||||||| merged common ancestors
=======

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
>>>>>>> FETCH_HEAD
