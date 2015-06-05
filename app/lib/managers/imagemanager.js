var cloudinary = require('cloudinary/cloudinary'),
    httpClient = require('managers/httpmanager');

function getSignedRequest(id, cb) {
	httpClient.execute('/image/sign/'+ id, 'GET', null, true, cb);
}



exports.uploadImage = function(uploadRequest, cb) {
	
	function uploadCallback(result) {
		if (result.error) {
			Ti.API.error("Error: " + result.error);
		} else {
			Ti.API.info("Uploaded file with public_id: " + result.public_id);
		}
		cb(result.error, result);
	}
	if (uploadRequest.image) {
		var imageFile = Ti.Filesystem.getFile(uploadRequest.image);
		if (imageFile) {
			getSignedRequest(uploadRequest.listingId, function(err, signedRequest) {
				if (signedRequest) {
					cloudinary.uploader.upload(imageFile, uploadCallback, signedRequest.params);
				}
			});
		}
	}
}; 