// Initialize aws client
// =====================
var config = require('./config/config.json');
var moment = require('moment');
var crypto = require('crypto');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
AWS.config.update({region: 'eu-central-1'});
var s3 = new AWS.S3();

var Item     = require('./app/models/item');

// S3 upload service - stream buffers to S3
// ========================================
var s3UploadService = function(req, next) {
	req.files = {};
	req.field = {};
	var item = new Item();    // create a new instance of the Item model

	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		if (!filename) {
			// If filename is not truthy it means there's no file
			return;
		}
		// Create the initial array containing the stream's chunks
		file.fileRead = [];

		file.on('data', function(chunk) {
			// Push chunks into the fileRead array
			this.fileRead.push(chunk);
		});

		file.on('error', function(err) {
			console.log('Error while buffering the stream: ', err);
		});

		file.on('end', function() {
			// Concat the chunks into a Buffer
			var finalBuffer = Buffer.concat(this.fileRead);

			req.files[fieldname] = {
				buffer: finalBuffer,
				size: finalBuffer.length,
				filename: filename,
				mimetype: mimetype
			};

			//var datePrefix = moment().format('YYYY[/]MM');
			var key = crypto.randomBytes(10).toString('hex');
			var hashFilename = key + '-' + filename;

			//var pathToArtwork = '/artworks/' + datePrefix + '/' + hashFilename;

			pathToArtwork = hashFilename;

			var headers = {
				'Content-Length': req.files[fieldname].size,
				'Content-Type': req.files[fieldname].mimetype,
				'x-amz-acl': 'public-read'
			};

			var params = {
				Bucket: "wallpictstore",
				Key: pathToArtwork,
				Body: req.files[fieldname].buffer, // thats where im probably wrong
				ContentType: req.files[fieldname].mimetype,
				ContentLength : req.files[fieldname].size,
				ACL: 'public-read'
			};
				s3.upload(params, function(err, res) {
					if(err) {
		                console.log('Upload error - ' + err);
		                return err;
		            } else {
		                console.log('uploaded file[' + params.Key + ']');
		            }
				});
				item.imageURI = 'https://'+params.Bucket+'.s3.eu-central-1.amazonaws.com/'+params.Key
		});
	});
	req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
		req.field[fieldname] = val;

	});
	req.busboy.on('error', function(err) {
		console.error('Error while parsing the form: ', err);
		next(err);
	});

	req.busboy.on('finish', function(url) {
		item.tags = req.field['tags'].split(",");
		item.comment = req.field['comment'];
		item.populate('_created_by', 'username').save(function(err) {
		   if (err) {
		      return res.json(500, {
		        error: 'Cannot save the post'
		      });
		    }
		    next()

		});

	});
	// Start the parsing
	req.pipe(req.busboy);
};

module.exports = s3UploadService;