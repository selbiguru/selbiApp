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
	bankEligible = false;
var saveListingButton = null;
var editListingButton = null; 
$.activityIndicator.show();



function initialize() {
	if(args.itemId){
		//show correct 'buy' buttons with correct event listeners
		previewListing = false;
		$.titleViewListingLabel.text = 'View Listing';
		//$.backListingView.show();
		listingManager.getListing(args.itemId, function(err, listing){
			if(err) {
				helpers.alertUser('Listing','Unable to get the listing!');
			} else {
				itemData = listing;
				populateViewListing(listing);
				createPurchasingButtons();
			}
			$.activityIndicator.hide();
			$.activityIndicator.height = '0dp';
			return;
		});
	} else {
		//show correct buttons dynamically created with correct event listeners
		previewListing = true;
		$.titleViewListingLabel.text = 'Preview Listing';
		createPreviewButtons();
		populateViewListing(args);
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
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
	$.viewListingProductDescription.setText(listingData.description);
	$.sellerName.setText(firstName +' '+ lastName);
	if(!previewListing){
		profileImageUrl = listingData.user.profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + listingData.user.profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
		$.overlayListingHeader.data = {
			userId: listingData.user.id,	
			userName: listingData.user.firstName + ' ' + listingData.user.lastName,
			friends: listingData.invitation
		};
	} else if(Alloy.Globals.currentUser.attributes.profileImage) {
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage;
	} else {
		profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
	}
	$.sellerImage.image = profileImageUrl;
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
		
		views.push(carouselImage);
		carouselImage = null;
	}
	$.imageGallery.views = views;	
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
			listingManager.uploadImagesForListing(saveResult.id, previewImageCollection, function(err, imgUrls) {
				if (imgUrls && imgUrls.length > 0) {
					delete saveResult.rev;
					saveResult.imageUrls = imgUrls;
					listingManager.updateListing(saveResult, function(err, updateResult) {
						if(err) {
							//helpers.alertUser('Listing','Failed to update your listing, please try again later!');
							Ti.API.warn("Failed to update listing, please try again later!" + saveResult.id);
						}
						indicatorWindow.closeIndicator();
						editListingButton.touchEnabled = true;
						saveListingButton.touchEnabled = true;
						$.backViewButton.touchEnabled = true;
						helpers.alertUser('Listing','Listing created successfully');
						backButton();
						Alloy.Globals.openPage('createlisting');	
					});
				} else {
					indicatorWindow.closeIndicator();
					editListingButton.touchEnabled = true;
					saveListingButton.touchEnabled = true;
					$.backViewButton.touchEnabled = true;
					helpers.alertUser('Listing','Listing created successfully');
					backButton();
					Alloy.Globals.openPage('createlisting');
				}
			});
		} else {
			indicatorWindow.closeIndicator();
			editListingButton.touchEnabled = true;
			saveListingButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Failed to create your listing. Please try again!');
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
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Failed','Failed to purchase item, please try again!');
		} else {
			updateUser();
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Purchased!','You purchased an item on Selbi!');
			backButton();
			Alloy.Globals.openPage('friendslistings', ['friendslistings', Ti.App.Properties.getString('userId')]);
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
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Failed to delete your listing. Please try again!');
		} else {
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Listing deleted successfully');
			backButton();
			Alloy.Globals.openPage('mylistings', ['mylistings', Ti.App.Properties.getString('userId')]);
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
			helpers.alertUser('Listing','Failed to archive your listing. Please try again!');
		} else {
			indicatorWindow.closeIndicator();
			actionButton.touchEnabled = true;
			$.backViewButton.touchEnabled = true;
			helpers.alertUser('Listing','Listing archived successfully');
			backButton();
			Alloy.Globals.openPage('mylistings', ['mylistings', Ti.App.Properties.getString('userId')]);
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
	    	heightRatio = 595;
	    	widthRatio = 650;
	    	widthPreview = 356;
	        break;
	    case 3: //iphoneSixPlus
	    	heightPreview = 360;
	    	heightRatio = 732;
	    	widthRatio = 595;
	    	widthPreview = 393;
	        break;
	    case 4: //android currently same as iphoneSix
	    	heightPreview = 326;
	    	heightRatio = 595;
	    	widthRatio = 650;
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

    Ti.API.info('ratio: ' + ratio);
    Ti.API.info('w: ' + w);
    Ti.API.info('h: ' + h);

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

    Ti.API.info('ratio: ' + ratio);
    Ti.API.info('w: ' + w);
    Ti.API.info('h: ' + h);

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
			helpers.alertUser('Get User','Failed to get the current user!');
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
	
	editListingButton.addEventListener('click', backButton);
	editListingButton.touchEnabled = false;
	saveListingButton.addEventListener('click', function(e) {
		if(bankEligible) {
			saveListing(editListingButton, saveListingButton);	
		} else {
			helpers.alertUser('No go!','Before you can list items you need to add BOTH a Bank Account in \'Payment\' and an Address in \'Edit Profile\' under Settings if you haven\'t done so already!');
		}
	});
	return;
}


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	$.off();
	$.destroy();
	if(args.itemId) {
		$.viewListingButtonView.remove($.viewListingButtonView.children[0]);
		$.viewListingButtonView.children[0] = null;	
	} else {
		$.viewListingButtonView.remove(editListingButton);
		$.viewListingButtonView.remove(saveListingButton);
		editListingButton = null;
		saveListingButton = null;
	}
	
	for(i in views) {
		$.imageGallery.remove(views[i]);
	}
	views = [];
	itemData = null;
	images = null;
	previewImageCollection = [];
	$.sellerImage.image = null;
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

	actionButton.addEventListener('click', function(e){
		if(ccEligible) {
			helpers.confirmAction('Confirm!', alert, function(err, response){
				response.show();
				response.addEventListener('click', function(e){
					if (e.index === 0){
						return;
					} else {
						apiSupport(e);
					}
				});
			});	
		} else {
			helpers.alertUser('No go!','Before you can purchase items you need to add a credit card in \'Payment\' and address in \'Edit Profile\' under Settings!');
		}
	});
	return actionButton;
}






/*----------------------------------------------On page load API calls---------------------------------------------*/



paymentManager.getPaymentMethods(function(err, results){
	if(results.userPaymentMethod.lastFour && Alloy.Globals.currentUser.attributes.address) {
		ccEligible = true;
	}
	if(results.userMerchant.accountNumberLast4 && Alloy.Globals.currentUser.attributes.address) {
		bankEligible = true;
	}
	initialize();
});



exports.cleanup = function () {
	Ti.API.info('Cleaning viewlisting');
	$.removeListener();
    $.backViewButton.removeEventListener('click',backButton);
	Alloy.Globals.removeChildren($.viewListingView);
	$.viewListingView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};



/*-----------------------------------------------Event Listeners------------------------------------------------*/

/**
 * Event listener for click of user of listing to open and show all of the users listed items
 */
//$.overlayListingHeader.addEventListener('click', openUserListing);















//SAVE FOR LATER USE
/*
 * /**
 * @private createSlideButton
 * Create a sliding button that on 'touchend' calls an API route
 * @param {String} height Height of button
 * @param {Number} width Width of button 
 * @param {String} fontSize FontSize of text
 * @param {String} background BackgroundColor hex you want the button
 * @param {String} text Text string you want on the button
 * @param {Boolean} ccEligible Boolean to know if the user has a CC saved and can thus purchase items
 * @param {Function} apiSupport APISupport is the function passed in that determines the proper API route to hit
 */
/*function createSlideButton(height, width, fontSize, background, text, ccEligible, apiSupport){
	var sliderView = Ti.UI.createView({
		bottom:'20dp',
		right: '0dp',
		height: height,
		width: width,
		backgroundColor: '#EAEAEA',
		layout: 'composite'
	});
	var sliderButton = Ti.UI.createView({
		top: '0dp',
		height: height,
		width: width,
		backgroundColor: background,
		left: 0
	});
	var sliderText = Ti.UI.createLabel({
		text: text + '...',
		textAlign: 'center',
		color: '#FFF',
		font: {
			fontSize: fontSize,
			fontFamily: "Nunito-Light"
		},
	});

	$.viewListingButtonView.add(sliderView);
	sliderView.add(sliderButton);
	sliderView.add(sliderText);
	
	sliderButton.addEventListener('touchmove', function(e){
		var moveX = e.x +sliderButton.animatedCenter.x - sliderButton.getWidth()/2;
		if (moveX + sliderButton.getWidth()/2 >= sliderView.getLeft() +sliderView.getWidth()) {
			//button right-edge stop
			moveX = sliderView.getLeft() + sliderView.getWidth() - (sliderButton.getWidth()/2);
		} else if (moveX - sliderButton.getWidth()/2 <= sliderView.getLeft()){
			//button left-edge stop
			moveX = sliderView.getLeft() + (sliderButton.getWidth()/2);
		}
		//sliderButton.animate({center:{x:240, y:0}, duration: 1});
		sliderButton.animate({center:{x:moveX, y:0}, duration: 500});
		sliderButton.setLeft(moveX);
	});

	sliderButton.addEventListener('touchend', function(e){
		var endX = sliderButton.animatedCenter.x + (sliderButton.getWidth()/2);
		if (endX > parseInt(sliderView.getWidth())+ width) {
			//button released at right-edge stop
			//IN HERE ADD PURCHASING CALL
			if(ccEligible) {
				apiSupport(e);	
			} else {
				helpers.alertUser('No go!','Before you can purchase items you need to add a credit card in \'Payment\' and address in \'Edit Profile\' under Settings!');
			}
		}
		//springback
		sliderButton.setLeft(0);
		sliderButton.animate({center:{x:(sliderView.getLeft()+sliderButton.getWidth()/2),y:0}, duration: 500});
	});
	return sliderButton;
}*/