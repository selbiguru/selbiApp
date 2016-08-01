var args = arguments[0] || {};
var utils = require('utilities/validate');
var addressManager = require('managers/addressmanager');
var paymentManager = require('managers/paymentmanager');
var notificationManager = require('managers/notificationmanager');
var helpers = require('utilities/helpers'),
	geoLocation = require('utilities/geoLocation'),
	html2as = require('nl.fokkezb.html2as'),
	indicator = require('uielements/indicatorwindow');
var currentUser = null;
var buttonFontSize;
switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
		buttonFontSize = '13dp';
        break;
    case 1: //iphoneFive
        buttonFontSize = '14dp';
        break;
    case 2: //iphoneSix
        buttonFontSize = '16dp';
        break;
    case 3: //iphoneSixPlus
        buttonFontSize = '18dp';
        break;
    case 4: //android currently same as iphoneSix
        buttonFontSize = '16dp';
        break;
};



/**
 * @method getGoogleMaps
 * Opens addressgooglemap and gets geoLocation position if available
 */
function getGoogleMaps(e){
	geoLocation.getCurrentPosition(function(e){
		Alloy.Globals.openPage('addressgooglemap',[e]);
	});
};



/**
 * @method confirmPurchase
 * Alert box confirmation for the purchase.
 */
function confirmPurchase() {
	helpers.confirmAction('Confirm!', 'Confirm to complete the purchase.', function(err, response){
		response.show();
		$.addListener(response,'click', function(e){
			if (e.index === 0){
				response=null;
				return;
			} else {
				response=null;
				buyItem();
			}
		});
	});
}



/**
 * @method buyItem
 * Buys the listed item.
 */
function buyItem(){
	buttonsOff();
	var createOrderObj = {
		sellerId: args.user.id,
		buyerId: Ti.App.Properties.getString('userId'),
		listingId: args.id
	};
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Purchasing"
	});

	indicatorWindow.openIndicator();
	paymentManager.createOrder(createOrderObj, function(err, results){
		if(err) {
			var parseErr = JSON.parse(err);
			indicatorWindow.closeIndicator();
			buttonsOn();
			helpers.alertUser('Failed', ''+parseErr.message+'');
		} else {
			updateUser();
			indicatorWindow.closeIndicator();
			buttonsOn();
			helpers.alertUser('Purchased!','You purchased an item on Selbi');
			Alloy.Globals.openPage('friendslistings', ['friendslistings', Ti.App.Properties.getString('userId')]);
			backButton();
		}
	});
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


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	Alloy.Globals.closePage('viewlisting');
	Alloy.Globals.closePage('checkout');
}


/**
 * @method buttonsOn
 * Turns touchEnabled on buttons on after purchase is complete
 */
function buttonsOn() {
	$.confirmButtonBottom.touchEnabled = true;
	$.confirmButtonTop.touchEnabled = true;
	$.cancelCheckout.touchEnabled = true;
};


/**
 * @method buttonsOff
 * Turns touchEnabled on buttons off while purchase is pending
 */
function buttonsOff() {
	$.confirmButtonBottom.touchEnabled = false;
	$.confirmButtonTop.touchEnabled = false;
	$.cancelCheckout.touchEnabled = false;
};


/**
 * @private closeCheckout 
 *  Closes the current view to reveal the previous still opened view.
 */
function closeCheckout() {
	Alloy.Globals.closePage('checkout');
}

/*-------------------------------------------------Event Listeners---------------------------------------------------*/
//Closes addressgooglemap and verifyaddress Views on 'cancel' click
$.cancelCheckoutButton.addEventListener('click', closeCheckout);



/*-------------------------------------------------Dynamic Elements---------------------------------------------------*/

function pickupOnlyText(shippingLocation, fontSize) {
	html2as(
		"This item is for <font size='"+fontSize+"' face='Nunito-Bold'>‘Pick-up Only’</font> near <font size='"+fontSize+"' face='Nunito-Bold'>"+shippingLocation+"</font>.  After confirming your order you will receive the Seller’s email and be able to contact them to organize picking up your new purchase!",
	    function(err, as) {
	        if (err) {
	            console.error(err);
	        } else {
	           $.pickupOnlyLabel.attributedString = as;
	        }
	    }
	);	
}




/*-------------------------------------------------On Page Load---------------------------------------------------*/


(function init() {
	$.checkoutItemImage.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].listingView + Alloy.CFG.cloudinary.bucket + args.imageUrls[0];
	$.checkoutItemTitle.setText(args.title);
	$.checkoutItemPrice.setText(parseFloat(args.price).formatMoney(2));
	$.checkoutSubtotal.setText(parseFloat(args.price).formatMoney(2));
	$.checkoutTotal.setText(parseFloat(args.price).formatMoney(2));
	if(args.isPickupOnly) {
		var pickupLocation = args.user.userAddress.city +' '+ args.user.userAddress.state;
		$.shippingView.hide();
		$.shippingView.height = '0dp';
		$.shippingOrPickupLabel.setText('Pick-up Only:');
		pickupOnlyText(pickupLocation, buttonFontSize);
	} else {
		$.pickupOnlyLabel.hide();
		$.pickupOnlyLabel.height = '0dp';
	}
})();


//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		currentUser = data;
	},
	error: function(data){		
	}
});


exports.cleanup = function () {
	$.removeListener();
	$.off();
	$.destroy();
	$.cancelCheckoutButton.removeEventListener('click',closeCheckout);
    $.confirmButtonTop.removeEventListener('click',confirmPurchase);
    $.confirmButtonBottom.removeEventListener('click',confirmPurchase);
	Alloy.Globals.removeChildren($.checkoutView);
	$.checkoutView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};



