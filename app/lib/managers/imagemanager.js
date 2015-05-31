var cloudinary = require('cloudinary/cloudinary'),
    httpClient = require('managers/httpmanager');

function getSignedRequest(cb) {
    httpClient.execute('/image/sign', 'GET', null, true, cb);
}

function uploadCallback(result) {
    if (result.error) {
        Ti.API.error("Error: " + result.error);
    } else {
        Ti.API.info("Uploaded file with public_id: " + result.public_id);
    }
}

exports.uploadImage = function(fileName) {
	var imageFile = Ti.Filesystem.getFile(fileName);
    if (imageFile) 
    {
        getSignedRequest(function(err, signedRequest) {
        	Ti.API.info(signedRequest);
            if (signedRequest) {
                cloudinary.uploader.upload(imageFile, uploadCallback, signedRequest.params);
            }
        });
    }
};