var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');
var paymentManager = require('managers/paymentmanager');
var ImageFactory = require('ti.imagefactory');
var notificationManager = require('managers/notificationmanager');
var ImageUtils = require('utilities/imageutils');
var helpers = require('utilities/helpers');
var indicator = require('uielements/indicatorwindow');
var	previewListing,
	views = [],
	itemData,
	images,
	previewImageCollection = [];
var ccEligible = false,
	bankEligible = false,
	saveListingButton = null,
	editListingButton = null, 
	dynamicElement = require('utilities/dynamicElement');
$.activityIndicator.show();



function initialize() {
	if(args.itemId){
		//Show correct 'buy' buttons with correct event listeners
		previewListing = false;
		$.titleViewListingLabel.text = 'View Listing';
		listingManager.getListing(args.itemId, function(err, listing){
			if(err) {
				helpers.alertUser('Listing','Unable to get the listing');
			} else {
				//Check if cleanup is called before loading viewListing
				if($ && $.activityIndicator){
					itemData = listing;
					populateViewListing(listing);
					createPurchasingButtons();
					$.activityIndicator.hide();
					$.activityIndicator.height = '0dp';
				}
			}
			return;
		});
	} else {
		//Show correct buttons dynamically created with correct event listeners
		previewListing = true;
		//Check if cleanup is called before loading viewListing
		if($ && $.activityIndicator){
			$.titleViewListingLabel.text = 'Preview Listing';
			createPreviewButtons();
			populateViewListing(args);
			$.activityIndicator.hide();
			$.activityIndicator.height = '0dp';
		}
	}
}


/**
 * @method openListing 
 * Opens mylisting view and shows the user that was clicked on and all of their items
 * @param {Object} listingId Object containing listingId, userId, and friend (invitation) for the item
 */
function openListing(listingIDs){
	Alloy.Globals.openPage('mylistings', [
		listingIDs.userName, listingIDs.userId, listingIDs.friends
	]);
};
	
/**
 * @method populateViewListing
 * Populates the viewlisting page with the appropriate data.
 * The data comes from either the listing page (other users viewing) or
 * it comes from the createlisting page (part of the preview listing process)
 */	
function populateViewListing(listingData) {
	var profileImageUrl = '',
		price, firstName, lastName;	
	previewListing ? firstName = Alloy.Globals.currentUser.attributes.firstName : firstName = listingData.user.firstName;
	previewListing ? lastName = Alloy.Globals.currentUser.attributes.lastName : lastName = listingData.user.lastName;
	previewListing ? images = listingData.images : images = listingData.imageUrls;
	$.viewListingProductTitle.setText(listingData.title);
	$.viewListingProductPrice.setText(parseFloat(listingData.price).formatMoney(2));
	$.viewListingReferenceNumber.setText('Ref# '+listingData.id);
	$.viewListingProductDescription.setText(listingData.description);
	$.sellerName.setText(firstName +' '+ lastName);
	if(!previewListing){
		profileImageUrl = listingData.user.profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + listingData.user.profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.CFG.imageSize.facesDefault;
		$.overlayListingHeader.data = {
			userId: listingData.user.id,	
			userName: listingData.user.firstName + ' ' + listingData.user.lastName,
			friends: listingData.invitation
		};
	} else if(Alloy.Globals.currentUser.attributes.profileImage) {
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage;
	} else {
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.CFG.imageSize.facesDefault;
	}
	$.sellerImage.image = profileImageUrl;
	
	var spinnerImages = [];
	for(var i=0;i<19;i++){
		spinnerImages.push('spinner/frame_'+i+'.gif');
	}
	var loadingView = Ti.UI.createWebView({
	     html : '<html><head></head><body><center><img src="loading_spinner.gif"/></center></body></html>',
		 width : Ti.UI.SIZE,
		 height : Ti.UI.SIZE,
		 backgroundColor: '#FAFAFA'
	});
	views.push(loadingView);
	
	var loadedImg = 0;
	for(var img in images) {
		var carouselImage = ImageUtils.Utils.RemoteImage({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			preventDefaultImage: true,
			image: previewListing ? previewImageResize(images[img].resizedImage) : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].listingView + Alloy.CFG.cloudinary.bucket + images[img]
		});
		
		if(previewListing) {
			previewImageCollection.push(images[img].resizedImage);
		};
		
		$.addListener(carouselImage,'load', function(){
			  loadedImg++;
			  if(loadedImg==images.length){
			  	loadingView = null;
			    views.splice(0, 1);
			  	$.imageGallery.views = views;
			  }
		});
		
		views.push(carouselImage);
		carouselImage = null;
	}
	$.imageGallery.views = views;
	if(listingData.isSold) {
		$.imageGallery.borderColor = '#1BA7CD';
		$.imageGallery.borderWidth = '5dp';	
		$.viewListingProductTitle.color = '#1BA7CD';
	} else {
		$.viewListingReferenceNumber.hide();
		$.viewListingReferenceNumber.height = '0dp';
	}
};



/**
 * @method saveListing
 * Saves the listing, images, and makes the listing published.
 * Also saves the users chose of public or private listing for the item.
 * Turns off buttons until function is complete
 * @param {Object} editListingButton
 * @param {Object} saveListingButton
 */
function saveListing(editListingButton, saveListingButton) {
	editListingButton.touchEnabled = false;
	saveListingButton.touchEnabled = false;
	$.backViewButton.touchEnabled = false;
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving"
	});

	indicatorWindow.openIndicator();
	listingManager.createListing(args, function(err, saveResult) {
		if (saveResult) {
			indicatorWindow.uploadImage(saveResult, previewImageCollection);	
		} else {
			indicatorWindow.closeIndicator();
			indicatorWindow = null;
			editListingButton.touchEnabled = true;
			saveListingButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Failed to create your listing. Please try again');
		}
	});
}


/**
 * @method buyItem
 * Buys the listed item.
 * @param {Object} actionButton Button clicked on
 */
function buyItem(actionButton){
	actionButton.touchEnabled = false;
	$.backViewButton.touchEnabled = false;
	var createOrderObj = {
		sellerId: args.userId,
		buyerId: Ti.App.Properties.getString('userId'),
		listingId: args.itemId
	};
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Purchasing"
	});

	indicatorWindow.openIndicator();
	paymentManager.createOrder(createOrderObj, function(err, results){
		if(err) {
			var parseErr = JSON.parse(err);
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Failed', ''+parseErr.message+'');
		} else {
			updateUser();
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Purchased!','You purchased an item on Selbi');
			Alloy.Globals.openPage('friendslistings', ['friendslistings', Ti.App.Properties.getString('userId')]);
			backButton();
		}
	});
};

/**
 * @method deleteItem
 * Deletes the listed item from the users listings.
 * @param {Object} actionButton Button clicked on
 */
function deleteItem(actionButton){
	actionButton.touchEnabled = false;
	$.backViewButton.touchEnabled = false;
	var deleteListingObj = {
		id: args.itemId,
		images: itemData.imageUrls
	};
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Deleting"
	});
	
	indicatorWindow.openIndicator();
	listingManager.deleteListing(deleteListingObj, function(err, deleteResult) {
		if (err) {
			indicatorWindow.closeIndicator();
			indicatorWindow = null;
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Failed to delete your listing. Please try again');
		} else {
			indicatorWindow.closeIndicator();
			indicatorWindow = null;
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Listing deleted successfully');
			Alloy.Globals.openPage('mylistings', ['mylistings', Ti.App.Properties.getString('userId')]);
			backButton();
		}
	});
}


/**
 * @method archiveItem
 * Archives the listed item.
 * @param {Object} actionButton Button clicked on
 */
function archiveItem(actionButton){
	actionButton.touchEnabled = false;
	$.backViewButton.touchEnabled = false;
	var archiveListingObj = {
		isArchived: true,
		images: itemData.imageUrls
	};
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Archiving"
	});
	
	indicatorWindow.openIndicator();
	listingManager.archiveListing(args.itemId, archiveListingObj, function(err, archiveResult) {
		if (err) {
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Failed to archive your listing. Please try again');
		} else {
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Listing archived successfully');
			Alloy.Globals.openPage('mylistings', ['mylistings', Ti.App.Properties.getString('userId')]);
			backButton();
		}
	});
}


/**
 * @method previewImageResize
 * Resizes image based on iPhone for preview listing's images.
 */
function previewImageResize(image) {
	var heightPreview, heightRatio, widthRatio, widthPreview;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
		    heightPreview = 215;
		    heightRatio = 263;
		    widthRatio = 288;
		    widthPreview = 272;
	        break;
	    case 1: //iphoneFive
	    	heightPreview = 263;
	    	heightRatio = 263;
	    	widthRatio = 288;
	    	widthPreview = 288;
	        break;
	    case 2: //iphoneSix
	    	heightPreview = 326;
	    	heightRatio = 640;
	    	widthRatio = 700;
	    	widthPreview = 356;
	        break;
	    case 3: //iphoneSixPlus
	    	heightPreview = 360;
	    	heightRatio = 640;
	    	widthRatio = 700;
	    	widthPreview = 393;
	        break;
	    case 4: //android currently same as iphoneSix
	    	heightPreview = 326;
	    	heightRatio = 640;
	    	widthRatio = 700;
	    	widthPreview = 356;
	        break;
	};
	return ImageFactory.imageAsCropped(resizeKeepAspectRatioNewWidth(image, image.width, image.height, widthRatio), {width: widthRatio, height: heightRatio});
}






/**
 * @method resizeKeepAspectRatioNewWidth
 * This method used with ImageFactory to resize the image with same ratio but new width
 */
function resizeKeepAspectRatioNewWidth(blob, imageWidth, imageHeight, newWidth) {
    // only run this function if suitable values have been entered
    if (imageWidth <= 0 || imageHeight <= 0 || newWidth <= 0)
        return blob;

    var ratio = imageWidth / imageHeight;

    var w = newWidth;
    var h = newWidth / ratio;

    return ImageFactory.imageAsResized(blob, { width:w, height:h });
}



/**
 * @method resizeKeepAspectRatioNewHeight
 * This method used with ImageFactory to resize the image with same ratio but new height
 */
function resizeKeepAspectRatioNewHeight(blob, imageWidth, imageHeight, newHeight) {
    // only run this function if suitable values have been entered
    if (imageWidth <= 0 || imageHeight <= 0 || newHeight <= 0)
        return blob;

    var ratio = imageWidth / imageHeight;

    var w = newHeight * ratio;
    var h = newHeight;


    return ImageFactory.imageAsResized(blob, { width:w, height:h });
}




 /**
 * @private openUserListing 
 *  Shows all listings for user clicked on while viewing specific listing of said user.
 */
function openUserListing(e) {
	if(e.source.data ) {
		Alloy.Globals.closePage('mylistings');
		openListing(e.source.data);
		backButton();
	} else {
		return;
	}
};


 /**
 * @private updateUser 
 *  Updates user notification count to show accurate number of notifcations on the menu
 */
function updateUser(){
	//Load the user model
	Alloy.Models.user.fetch({
		success: function(data){
			var currentUser = data;
			notificationManager.countNotifications(function(err, notificationCount){
				currentUser.set({'notificationCount': notificationCount});
				currentUser.save();
			});
		},
		error: function(data){
			helpers.alertUser('Get User','Failed to get the current user');
		}
	});
};








/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

 /**
 * @private createPreviewButtons 
 *  Dynamically creates XML elements to show the buttons when viewlisting is for preview listing.
 */
function createPreviewButtons() {
	var buttonHeight, buttonFontSize;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
			buttonHeight = '40dp';
			buttonFontSize = '14dp';
	        break;
	    case 1: //iphoneFive
	        buttonHeight = '45dp';
	        buttonFontSize = '16dp';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '55dp';
	        buttonFontSize = '18dp';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '55dp';
	        buttonFontSize = '20dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '55dp';
	        buttonFontSize = '18dp';
	        break;
	};

	editListingButton = Ti.UI.createButton({
		width: '49%',
		height: buttonHeight,
		bottom: '20dp',
		left: '0dp',
		textAlign: 'center',
		color: '#9B9B9B',
		borderColor: "#9B9B9B",
		font: {
			fontSize: buttonFontSize,
			fontFamily: "Nunito-Light"
		},
		title: 'Edit Listing'
	});
	
	saveListingButton = Ti.UI.createButton({
		width: '49%',
		height: buttonHeight,
		bottom: '20dp',
		right: '0dp',
		textAlign: 'center',
		backgroundColor: '#1BA7CD',
		color: '#FFF',
		font: {
			fontSize: buttonFontSize,
			fontFamily: "Nunito-Light"
		},
		title: 'Looks Good'
	});


	$.viewListingButtonView.add(editListingButton);
	$.viewListingButtonView.add(saveListingButton);
	
	$.addListener(editListingButton,'click', backButton);
	$.addListener(saveListingButton,'click', function(e) {
		if(Alloy.Globals.currentUser.attributes.fraudAlert) {
			helpers.alertUser('Account Frozen!', 'Your account has been frozen.  Please contact us for more information!');
			return;
		} else if(bankEligible) {
			saveListing(editListingButton, saveListingButton);	
		} else {
			helpers.alertUser('Info Needed','Before you can list items you need to add BOTH a Bank Account in \'Payment\' and an Address in \'Edit Profile\' under \'Settings\' if you haven\'t done so already');
		}
	});
	return;
}


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	Alloy.Globals.closePage('viewlisting');
}


/**
 * @private createPurchasingButtons 
 *  Dynamically creates XML elements to show the buttons when viewlisting is for purchasing a listing.
 */
function createPurchasingButtons() {
	var buttonHeight, buttonFontSize, buttonWidth, backgroundColor;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
			buttonHeight = '40dp';
			buttonFontSize = '14dp';
			buttonWidth = 133;
			backgroundColor = '#1BA7CD';
	        break;
	    case 1: //iphoneFive
	        buttonHeight = '45dp';
	        buttonFontSize = '16dp';
	        buttonWidth = 141;
	        backgroundColor = '#1BA7CD';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '55dp';
	        buttonFontSize = '18dp';
	        buttonWidth = 175;
	        backgroundColor = '#1BA7CD';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '55dp';
	        buttonFontSize = '20dp';
	        buttonWidth = 193;
	        backgroundColor = '#1BA7CD';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '55dp';
	        buttonFontSize = '18dp';
	        buttonWidth = 175;
	        backgroundColor = '#1BA7CD';
	        break;
	};
	var purchaseListing = buyItem;
	var deleteListing = deleteItem;
	var archiveListing = archiveItem;
	if(args.userId === Ti.App.Properties.getString('userId') && itemData.isSold ) {
		createActionButton(buttonHeight, buttonWidth, buttonFontSize, '#127089', 'Archive Listing', true, 'Are you sure you want to Archive this listing!', archiveListing);
	} else if(args.userId === Ti.App.Properties.getString('userId')) {
		createActionButton(buttonHeight, buttonWidth, buttonFontSize, '#c10404', 'Delete Listing', true, 'Are you sure you want to Delete this listing!', deleteListing);
	} else {
		createActionButton(buttonHeight, buttonWidth, buttonFontSize, backgroundColor, 'Buy Item', ccEligible, 'Are you sure you want to Purchase this item!', purchaseListing);
	}
	return;
}




/**
 * @private createActionButton
 * Create an action button that on 'click' calls an API route to either purchase, archive, or delete and item
 * @param {String} height Height of button
 * @param {Number} width Width of button 
 * @param {String} fontSize FontSize of text
 * @param {String} background BackgroundColor hex you want the button
 * @param {String} text Text string you want on the button
 * @param {Boolean} ccEligible Boolean to know if the user has a CC saved and can thus purchase items
 * @param {String} alert Text string for the confirmation alert box
 * @param {Function} apiSupport APISupport is the function passed in that determines the proper API route to hit
 */
function createActionButton(height, width, fontSize, background, text, ccEligible, alert, apiSupport){
	var actionButton = Ti.UI.createButton({
		bottom:'20dp',
		right: '0dp',
		height: height,
		width: width,
		title: text,
		backgroundColor: background,
		color: '#FFF',
		font: {
			fontSize: fontSize,
			fontFamily: "Nunito-Light"
		},
		layout: 'composite'
	});

	$.viewListingButtonView.add(actionButton);

	$.addListener(actionButton, 'click', function(e){
		if(Alloy.Globals.currentUser.attributes.fraudAlert) {
			helpers.alertUser('Account Frozen!', 'Your account has been frozen.  Please contact us for more information!');
			return;
		} else if(ccEligible) {
			helpers.confirmAction('Confirm!', alert, function(err, response){
				response.show();
				$.addListener(response,'click', function(e){
					if (e.index === 0){
						response=null;
						return;
					} else {
						response=null;
						apiSupport(actionButton);
					}
				});
			});	
		} else {
			helpers.alertUser('Info Needed','Before you can purchase items you need to add BOTH a credit card in \'Payment\' and address in \'Edit Profile\' under \'Settings\' if you haven\'t done so already');
		}
	});
	return actionButton;
}






/*----------------------------------------------On page load API calls---------------------------------------------*/



paymentManager.getPaymentMethods(function(err, results){
	if(err) {
		$.viewListingView.remove($.viewListingScrollView);
		$.viewListingView.remove($.viewListingButtonView);
		dynamicElement.defaultLabel('Shoot, we are having trouble loading this page. Fortunately, we are already working on a solution!', function(err, results) {
			$.viewListingUndefined.add(results);
		});
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
		return;
	} else if(results.userPaymentMethod.lastFour && Alloy.Globals.currentUser.attributes.address) {
		ccEligible = true;
	}
	if(results.userMerchant.accountNumberLast4 && Alloy.Globals.currentUser.attributes.address) {
		bankEligible = true;
	}
	//Check if cleanup is called before loading viewListing
	if($ && $.activityIndicator){
		initialize();
	}
});



exports.cleanup = function () {
	$.removeListener();
	$.off();
	$.destroy();
    $.backViewButton.removeEventListener('click',backButton);
	Alloy.Globals.removeChildren($.viewListingView);
	$.viewListingView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};



/*-----------------------------------------------Event Listeners------------------------------------------------*/

