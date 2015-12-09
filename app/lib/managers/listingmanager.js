
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
	httpManager.execute('/userlistings/listing/'+listingId, 'GET', null, true, function(err, listingResult){
		console.log('@@@@@@@!!!!! ', listingResult);
		cb(err, listingResult);
	});
};

/**
 * @method getUserListings
 * Obtains all the listings for a given user
 * @param {String} userId User Identifier
 * @param {Object} queryObj Object containing the following information:
 * 		@param {Boolean} friend Indicates whether you are friends with the person you are getting items for
 * 		@param {Boolean} myself Indicates whether you are getting items for yourself
 * @param {Function} cb Callback function
 */
exports.getUserListings = function(userId, queryObj, cb){
	httpManager.execute('/userlistings/'+ userId, 'PUT', queryObj, true, function(err, listingsResult){
		cb(err, listingsResult);
	});
};




/**
 * @method getFriendsListings
 * Obtains all friends listings for a given user
 * @param {String} userId User Identifier
 * @param {Function} cb Callback function
 */
exports.getFriendsListings = function(userId, cb){
	httpManager.execute('/userlistings/friendlistings/'+ userId, 'GET', null, true, function(err, friendListingsResult){
		if(err) {
            cb(err, null);
		} else {
			cb(null, friendListingsResult);
		}
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
		"isPrivate": listingData.privateSwitch,
		"isPreview": false,
		"isPublished": true,
		"isSold": false,
		"userId": Ti.App.Properties.getString('userId')
	};
	httpManager.execute('/userlistings/create', 'POST', listingRequest, true, function(err, createListingResult){
		if(err) {
            cb(err, null);
		} else {
			cb(null, createListingResult);
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
	
	httpManager.execute('/userlistings/update/'+ listingRequest.id, 'PUT', listingRequest, true, function(err, updateListingResult){
		if(err) {
            cb(err, null);
		} else {
			cb(null, updateListingResult);
		}
	});
};






/***************************************************DELETE CALLS***********************************************************/


/**
 * @method deleteListing
 * Deletes the listing by listing id
 * @param {Object} listingRequest Listing Request object
 * @param {Function} cb Callback function
 */
exports.deleteListing = function(listingRequest, cb){
	
	httpManager.execute('/listing/'+ listingRequest.id, 'DELETE', null, true, function(err, deletedListingResult){
		if(err) {
            cb(err, null);
		} else {
			cb(null, deletedListingResult);
		}
	});
};