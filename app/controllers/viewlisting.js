var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');
var ImageUtils = require('utilities/imageutils');
var indicator = require('uielements/indicatorwindow');
var	previewListing,
	views = [];


if(args.id){
	//show correct 'buy' buttons with correctg event listeners
	previewListing = false;
	createPurchasingButtons();
	$.titleViewListingLabel.text = 'View Listing';
	listingManager.getListing(args.id, function(err, listing){
		if(!err && listing) {
			populateViewListing(listing);
		}
	});
} else {
	//show correct buttons dynamically created with correctg event listeners
	previewListing = true;
	$.titleViewListingLabel.text = 'Preview Listing';
	createPreviewButtons();
	populateViewListing(args);
}


	
/**
 * @method populateViewListing
 * Populates the viewlisting page with the appropriate data.
 * The data comes from either the listing page (other users viewing) or
 * it comes from the createlisting page (part of the preview listing process)
 */	
function populateViewListing(listingData) {
	var profileImageUrl = '',
		price, firstName, lastName, images;	
	previewListing ? firstName = Alloy.Globals.currentUser.attributes.firstName : firstName = listingData.user.firstName;
	previewListing ? lastName = Alloy.Globals.currentUser.attributes.lastName : lastName = listingData.user.lastName;
	previewListing ? images = listingData.images : images = listingData.imageUrls;
	previewListing ? price = listingData.price : price = listingData.price.formatMoney(2);
	
	$.viewListingProductTitle.setText(listingData.title);
	$.viewListingProductPrice.setText(parseFloat(listingData.price).formatMoney(2));
	$.viewListingProductDescription.setText(listingData.description);
	$.sellerName.setText(firstName +' '+ lastName);
	if(!previewListing){
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + listingData.user.profileImage;
	} else if(Alloy.Globals.currentUser.attributes.profileImage) {
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage;
	} else {
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
	}
	$.sellerImage.image = profileImageUrl;
	for(var img in images) {
		var container =  Titanium.UI.createView({
			top: '0dp',
			left: '0dp',
		  	borderRadius: '0dp',
		  	backgroundColor: "#E5E5E5"	  
		});
		var carouselImage = ImageUtils.Utils.RemoteImage({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			image: previewListing ? images[img] : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.listingView + Alloy.CFG.cloudinary.bucket + images[img]
		});
		
		views.push(carouselImage);
	}
	$.imageGallery.views = views;	
};




/**
 * @method saveListing
 * Saves the listing, images, and makes the listing published.
 * Also saves the users chose of public or private listing for the item.
 */
function saveListing() {
	var a = Titanium.UI.createAlertDialog({
		title : 'Listing'
	});

	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving"
	});

	indicatorWindow.openIndicator();
	listingManager.createListing(args, function(err, saveResult) {
		if (saveResult) {
			listingManager.uploadImagesForListing(saveResult.id, imageCollection, function(err, imgUrls) {
				if (imgUrls && imgUrls.length > 0) {
					delete saveResult.rev;
					saveResult.imageUrls = imgUrls;
					listingManager.updateListing(saveResult, function(err, updateResult) {
						indicatorWindow.closeIndicator();
						a.setMessage("Listing created successfully");
						a.show();
						Alloy.Globals.openPage('createlisting');
					});
				} else {
					indicatorWindow.closeIndicator();
					a.setMessage("Listing created successfully");
					a.show();
					Alloy.Globals.openPage('createlisting');
				}
			});
		} else {
			indicatorWindow.closeIndicator();
			a.setMessage("Failed to create listing. Please try again!");
			a.show();
		}
	});
}

/**
 * @method editListing
 * Closes the preview page to reveal the createlisting view to be further updated by the user
 */
function editListing() {
	Alloy.Globals.closePage('viewlisting');
};





/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

 /**
 * @private createPreviewButtons 
 *  Dynamically creates XML elements to show the buttons when viewlisting is for preview listing.
 */
function createPreviewButtons() {
	var buttonHeight;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
			buttonHeight = '40dp';
	        break;
	    case 1: //iphoneFive
	        buttonHeight = '40dp';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '50dp';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '50dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '50dp';
	        break;
	};

	var editListingButton = Ti.UI.createButton({
		width: '49%',
		height: buttonHeight,
		bottom: '20dp',
		left: '0dp',
		textAlign: 'center',
		color: '#9B9B9B',
		borderColor: "#9B9B9B",
		font: {
			fontSize: '16dp',
			fontFamily: "Nunito-Light"
		},
		title: 'Edit Listing'
	});
	
	var saveListingButton = Ti.UI.createButton({
		width: '49%',
		height: buttonHeight,
		bottom: '20dp',
		right: '0dp',
		textAlign: 'center',
		backgroundColor: '#1BA7CD',
		color: '#fff',
		font: {
			fontSize: '16dp',
			fontFamily: "Nunito-Light"
		},
		title: 'Looks Good'
	});


	$.viewListingButtonView.add(editListingButton);
	$.viewListingButtonView.add(saveListingButton);
	
	editListingButton.addEventListener('click', function(e) {
		editListing();
	});
	
	saveListingButton.addEventListener('click', function(e) {
		saveListing();
	});
	return;
}




/**
 * @private createPurchasingButtons 
 *  Dynamically creates XML elements to show the buttons when viewlisting is for purchasing a listing.
 */
function createPurchasingButtons() {
	var buttonHeight;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
			buttonHeight = '40dp';
	        break;
	    case 1: //iphoneFive
	        buttonHeight = '40dp';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '50dp';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '50dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '50dp';
	        break;
	};
	
	var purchaseListingButton = Ti.UI.createButton({
		width: '49%',
		height: buttonHeight,
		bottom: '20dp',
		right: '0dp',
		textAlign: 'center',
		backgroundColor: '#1BA7CD',
		color: '#fff',
		font: {
			fontSize: '16dp',
			fontFamily: "Nunito-Light"
		},
		title: 'Slide to Buy'
	});


	$.viewListingButtonView.add(purchaseListingButton);
	
	purchaseListingButton.addEventListener('click', function(e) {
		//to update with purchasing call
		return;
	});
	return;
}

