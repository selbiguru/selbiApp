var cloudinary = require('cloudinary/cloudinary'),
    httpClient = require('managers/httpmanager');

function getSignedRequest(id, cb) {
	httpClient.execute('/image/sign/'+ id, 'GET', null, true, cb);
}

exports.getMenuProfileImage = function() {
	// Todo: fetch actual profileImage
	return Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
};

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