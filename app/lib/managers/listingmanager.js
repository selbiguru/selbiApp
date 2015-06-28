var httpManager = require('managers/httpmanager');
var imageManager = require('managers/imagemanager');

exports.getListing = function(listingId, cb){
	httpManager.execute('/listing/'+listingId, 'GET', null, true, function(err, listingResult){
		cb(err, listingResult);
	});
};

exports.createListing = function(title, description, price, cb){
	
	var listingRequest = {
		"title": title,
		"description": description,
		"price": price,
		"isPreview": true,
		"isPublished": false,
		"userId": Ti.App.Properties.getString('userId')
	};
	
	httpManager.execute('/listing', 'POST', listingRequest, true, function(err, createListingResult){
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
			listingId: listingId,
			userId: Ti.App.Properties.getString('userId')
		};		
		imageManager.uploadImage(uploadImageRequest, uploadCompleteCallback);
	}	
};

exports.updateListing = function(listingRequest, cb){
	
	httpManager.execute('/listing/'+ listingRequest.id, 'PUT', listingRequest, true, function(err, updateListingResult){
		if(err) {
			var a = Titanium.UI.createAlertDialog({
                title : 'Listing'
            });
            a.setMessage("Failed to create your listing, please try again later!");
            a.show();
            if(cb) cb(new Error(err.message), null);
		} else {
			if(cb) cb(null, updateListingResult);
		}
	});
};
