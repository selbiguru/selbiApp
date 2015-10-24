
/**
 * @class ListingManager
 * ListingManager class to perform operations related to the listings 
 */

var httpManager = require('managers/httpmanager');
var imageManager = require('managers/imagemanager');



/***************************************************GET CALLS***************************************************************/


/**
 * @method getListing
 * Obtain the listing details for a given listing identifier
 * @param {String} listingId Listing identifier
 * @param {Function} cb Callback function
 */
exports.getListing = function(listingId, cb){
	httpManager.execute('/listing/'+listingId, 'GET', null, true, function(err, listingResult){
		cb(err, listingResult);
	});
};

/**
 * @method getUserListings
 * Obtains all the listings for a give user
 * @param {String} userId User Identifier
 * @param {Function} cb Callback function
 */
exports.getUserListings = function(userId, cb){
	httpManager.execute('/userlistings/'+ userId, 'GET', null, true, function(err, listingsResult){
		cb(err, listingsResult);
	});
};





/***************************************************POST CALLS***************************************************************/


/**
 * @method createListing
 * Create a listing for a given user and upload the images
 * @param {Object} listingData Object containing the four following key/values:
 * 	{String} title Title of the given listing
 * 	{String} description Description for the listing
 *	{String} price Price for the listing
 * 	{BOOLEAN} privateListing Sets private status for the listing
 * @param {Function} cb Callback function
 */
exports.createListing = function(listingData, cb){
	
	var listingRequest = {
		"title": listingData.title,
		"description": listingData.description,
		"price": listingData.price,
		"isPrivate": listingData.privateListing,
		"isPreview": false,
		"isPublished": true,
		"userId": Ti.App.Properties.getString('userId')
	};
	console.log("this is the object we are sending through..maybe errors here? ", listingRequest);
	httpManager.execute('/listing', 'POST', listingRequest, true, function(err, createListingResult){
		console.log("WHY IS THIS AN ERR ", err);
		console.log("success one time ", createListingResult);
		if(err) {
			var a = Titanium.UI.createAlertDialog({
                title : 'Listing'
            });
            a.setMessage("Failed to create your listing, please try again later!");
            a.show();
            if(cb) cb(new Error(err.message), null);
		} else {
			if(cb) cb(null, createListingResult);
		}
	});
};

/**
 * @method uploadImagesForListing 
 * Uploads listing images to cloudinary to the listings folder
 * @param {String} listingId Listing Identifier
 * @param {Array} imageCollection Collection of image Blobs
 * @param {Function} cb	Callback function
 */
exports.uploadImagesForListing = function(listingId, imageCollection, cb){
	var initialCount = 0, uploadedUrls=[];
	
	function uploadCompleteCallback(err, result){
		initialCount++;
		if(!err && result.public_id)
		uploadedUrls.push(result.public_id);
		if(initialCount === imageCollection.length) {
			return cb(null, uploadedUrls);
		}
	}
	for (var i=0; i < imageCollection.length; i++) {
		var randomNumer = Math.floor(Math.random()*11);
		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.tempDirectory, randomNumer +'-upload.jpg');
		f.write(imageCollection[i]); 		
		var uploadImageRequest = {
			image: Titanium.Filesystem.tempDirectory + randomNumer + '-upload.jpg',
			referenceId: listingId,
			userId: Ti.App.Properties.getString('userId')
		};		
		imageManager.uploadImage(uploadImageRequest, uploadCompleteCallback);
	}	
};






/***************************************************PUT CALLS***************************************************************/



/**
 * @method updateListing
 * Updates the listing by listing id
 * @param {Object} listingRequest Listing Request object
 * @param {Function} cb Callback function
 */
exports.updateListing = function(listingRequest, cb){
	
	httpManager.execute('/listing/'+ listingRequest.id, 'PUT', listingRequest, true, function(err, updateListingResult){
		if(err) {
			var a = Titanium.UI.createAlertDialog({
                title : 'Listing'
            });
            a.setMessage("Failed to update your listing, please try again later!");
            a.show();
            if(cb) cb(new Error(err.message), null);
		} else {
			if(cb) cb(null, updateListingResult);
		}
	});
};






/***************************************************DELETE CALLS***************************************************************/