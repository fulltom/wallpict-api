// Load required packages
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('User',{
	username: String,
	password: String,
	email: String
});
