// Load required packages
var User = require('../models/user');

// // Create endpoint /api/users for POST
// exports.postUsers = function(req, res) {
//   req.field = {};
//   req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
//     req.field[fieldname] = val;
//   });
//   req.busboy.on('finish', function(url) {
//     var user = new User({
//       username: req.field['username'],
//       password: req.field['password']
//     });
//     user.save(function(err) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'New user added !' });
//       next()
//     });
//   });
//   req.pipe(req.busboy);
// };

// // Create endpoint /api/users for GET
// exports.getUsers = function(req, res) {
//   User.find(function(err, users) {
//     if (err)
//       res.send(err);
//     res.json(users);
//   });
// };