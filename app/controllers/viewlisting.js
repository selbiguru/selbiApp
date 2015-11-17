var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');
var paymentManager = require('managers/paymentmanager');
var ImageUtils = require('utilities/imageutils');
var helpers = require('utilities/helpers');
var indicator = require('uielements/indicatorwindow');
var	previewListing,
	views = [];

$.activityIndicator.show();

if(args.itemId){
	//show correct 'buy' buttons with correct event listeners
	previewListing = false;
	createPurchasingButtons();
	$.titleViewListingLabel.text = 'View Listing';
	$.backListingView.show();
	listingManager.getListing(args.itemId, function(err, listing){
		if(err) {
			helpers.alertUser('Listing','Unable to get the listing!');
		} else {
			populateViewListing(listing);
		}
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
		return;
	});
} else {
	//show correct buttons dynamically created with correct event listeners
	previewListing = true;
	$.titleViewListingLabel.text = 'Preview Listing';
	$.backListingView.hide();
	createPreviewButtons();
	populateViewListing(args);
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
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
						if(err) {
							//helpers.alertUser('Listing','Failed to update your listing, please try again later!');
							Ti.API.warn("Failed to update listing, please try again later!" + saveResult.id);
						}
						indicatorWindow.closeIndicator();
						helpers.alertUser('Listing','Listing created successfully');
						Alloy.Globals.openPage('createlisting');	
					});
				} else {
					indicatorWindow.closeIndicator();
					helpers.alertUser('Listing','Listing created successfully');
					Alloy.Globals.openPage('createlisting');
				}
			});
		} else {
			indicatorWindow.closeIndicator();
			helpers.alertUser('Listing','Failed to create your listing. Please try again!');
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

/**
 * @method buyItem
 * Buys the listed item.
 */
function buyItem(){
	console.log("HITTING buy item YAYYYY!!!!");
	paymentManager.createOrder(object, function(err, results){
		if(err) {
			helpers.alertUser('Failed','Failed to purchase item, please try again!');
		} else {
			console.log("congrats bought this shit");
			backButton();
			Alloy.Globals.openPage('friendslistings', ['friendslistings', Ti.App.Properties.getString('userId')]);
		}
	});
};

/**
 * @method deleteItem
 * Deletes the listed item form the users listings.
 */
function deleteItem(){
	console.log("HITTING delete item YAYYYY!!!!");
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving"
	});

	indicatorWindow.openIndicator();
	listingManager.deleteListing(args.itemId, function(err, saveResult) {
		if (saveResult) {
			listingManager.uploadImagesForListing(saveResult.id, imageCollection, function(err, imgUrls) {
				if (imgUrls && imgUrls.length > 0) {
					delete saveResult.rev;
					saveResult.imageUrls = imgUrls;
					listingManager.updateListing(saveResult, function(err, updateResult) {
						if(err) {
							//helpers.alertUser('Listing','Failed to update your listing, please try again later!');
							Ti.API.warn("Failed to update listing, please try again later!" + saveResult.id);
						}
						indicatorWindow.closeIndicator();
						helpers.alertUser('Listing','Listing created successfully');
						Alloy.Globals.openPage('createlisting');	
					});
				} else {
					indicatorWindow.closeIndicator();
					helpers.alertUser('Listing','Listing created successfully');
					Alloy.Globals.openPage('createlisting');
				}
			});
		} else {
			indicatorWindow.closeIndicator();
			helpers.alertUser('Listing','Failed to create your listing. Please try again!');
		}
	});
}



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
	        buttonHeight = '40dp';
	        buttonFontSize = '16dp';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '50dp';
	        buttonFontSize = '18dp';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '50dp';
	        buttonFontSize = '20dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '50dp';
	        buttonFontSize = '18dp';
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
			fontSize: buttonFontSize,
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
			fontSize: buttonFontSize,
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
	        buttonHeight = '40dp';
	        buttonFontSize = '16dp';
	        buttonWidth = 141;
	        backgroundColor = '#1BA7CD';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '50dp';
	        buttonFontSize = '18dp';
	        buttonWidth = 175;
	        backgroundColor = '#1BA7CD';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '50dp';
	        buttonFontSize = '20dp';
	        buttonWidth = 193;
	        backgroundColor = '#1BA7CD';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '50dp';
	        buttonFontSize = '18dp';
	        buttonWidth = 175;
	        backgroundColor = '#1BA7CD';
	        break;
	};
	var purchaseListing = buyItem;
	var deleteListing = deleteItem;
	console.log("argsid ", args.userId, "tiID ",Ti.App.Properties.getString('userId'));
	if(args.userId === Ti.App.Properties.getString('userId')) {
		//createSlideButton(buttonHeight, buttonWidth, buttonFontSize, '#c10404', 'Slide to Delete', deleteListing);
		createSlideButton(buttonHeight, buttonWidth, buttonFontSize, backgroundColor, 'Slide to Buy', purchaseListing);
	} else {
		createSlideButton(buttonHeight, buttonWidth, buttonFontSize, backgroundColor, 'Slide to Buy', purchaseListing);
	}
	return;
}




/**
 * @private createSlideButton
 * Create a sliding button that on 'touchend' calls an API route
 * @param {String} height Height of button
 * @param {Number} width Width of button 
 * @param {String} fontSize FontSize of text
 * @param {String} background BackgroundColor hex you want the button
 * @param {String} text Text string you want on the button
 * @param {Function} apiSupport APISupport is the function passed in that determines the proper API route to hit
 */
function createSlideButton(height, width, fontSize, background, text, apiSupport){
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
			poop();
		}
		//springback
		sliderButton.setLeft(0);
		sliderButton.animate({center:{x:(sliderView.getLeft()+sliderButton.getWidth()/2),y:0}, duration: 500});
	});
	return sliderButton;
}


/**
 * @private createDeleteButton
 * Dynamically creates a delete listing button to delete a user listing from the Database
 */
function createDeleteButton() {
	var buttonHeight, buttonFontSize;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
			buttonHeight = '40dp';
			buttonFontSize = '14dp';
	        break;
	    case 1: //iphoneFive
	        buttonHeight = '40dp';
	        buttonFontSize = '16dp';
	        break;
	    case 2: //iphoneSix
	        buttonHeight = '50dp';
	        buttonFontSize = '18dp';
	        break;
	    case 3: //iphoneSixPlus
	        buttonHeight = '50dp';
	        buttonFontSize = '20dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        buttonHeight = '50dp';
	        buttonFontSize = '18dp';
	        break;
	};

	var deleteListingButton = Ti.UI.createButton({
		width: '49%',
		height: buttonHeight,
		bottom: '20dp',
		left: '0dp',
		textAlign: 'center',
		backgroundColor: '#c10404',
		color: '#fff',
		borderColor: "#9B9B9B",
		font: {
			fontSize: buttonFontSize,
			fontFamily: "Nunito-Light"
		},
		title: 'Delete Listing'
	});

	$.viewListingButtonView.add(deleteListingButton);
	
	deleteListingButton.addEventListener('click', function(e) {
		//deleteListingButton();
		console.log("INSIDE DELETE!!!!!!!!");
	});
	return;
}