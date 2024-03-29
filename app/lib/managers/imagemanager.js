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
			profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + currentUser.get('profileImage');
		} else {
			profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.CFG.imageSize.facesDefault;
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
			Ti.API.error("Error: " + result.error.message);
		} else {
		}
		return cb(result.error, result);
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




/**
 * @method deleteImage 
 * Deletes images from cloudinary with in the correct folder path specified by the signature
 * @param {Object} deleteRequest upload request object containg:
 * 		@param {Array} images Array of images to delete from cloudinary.
 * @param {Function} cb callback function
 */
exports.deleteImage = function(deleteRequest, cb) {
	httpClient.execute('/image/deleteimage', 'DELETE', deleteRequest, true, function(err, deletedImageResult){
		if(err) {
            cb(err, null);
		} else {
			cb(null, deletedImageResult);
		}
	});

}; 