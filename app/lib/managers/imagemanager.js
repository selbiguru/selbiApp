/**
 * @class ImageManager
 * ImageManager class to perform image manipulation related operations
 */

var cloudinary = require('cloudinary/cloudinary'),
	userManager = require('managers/usermanager'),
	helpers = require('utilities/helpers'),
    httpClient = require('managers/httpmanager');

/**
 * @private getSignedRequest 
 * Obtain a signed request from the server side to help with cloudinary requests
 * @param {String} id identifier
 * @param {Function} cb callback function
 */
function getSignedRequest(id, cb) {
	httpClient.execute('/image/sign/'+ id, 'GET', null, true, cb);
}

/**
 * @method getMenuProfileImage
 * Obtaine the profile image to be used on the menu of the logged in user
 */
exports.getMenuProfileImage = function(cb) {
	userManager.getCurrentUser(function(err, currentUser){
		var profileImageUrl = "";
		if(currentUser && currentUser.get('profileImage')){
			profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + currentUser.get('profileImage');
		} else {
			helpers.alertUser('Image','Failed to get user profile image, please try again later!');
			profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
		}
		cb(null, profileImageUrl);		
	});	
};

/**
 * @method uploadImage 
 * Uploads image to cloudinary with in the correct folder path specified by the signature
 * @param {Object} uploadRequest upload request object
 * @param {Function} cb callback function
 */
exports.uploadImage = function(uploadRequest, cb) {
	
	/**
	 * @private uploadCallback
	 * Callback handler for upload complete request. 
	 * @param {Object} result
	 */
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
			getSignedRequest(uploadRequest.referenceId, function(err, signedRequest) {
				if (signedRequest) {
					cloudinary.uploader.upload(imageFile, uploadCallback, signedRequest.params);
				}
			});
		}
	}
}; 