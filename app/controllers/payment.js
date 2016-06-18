/**
 * @class Payment
 * This class deals with user's payment and adding/editing new payment methods
 */
var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
	paymentManager = require('managers/paymentmanager'),
	modalManager = require('managers/modalmanager'),
	indicator = require('uielements/indicatorwindow'),
	twilioManager = require('managers/twiliomanager'),
	userManager = require('managers/usermanager'),
	dynamicElement = require('utilities/dynamicElement');



/**
 * @method addNewCard 
 * Opens addCreditCard view so users can enter in bank account information.
 * If error occurs fetching clientToken, alert modal shows and addCreditCard view is closed automatically.
 */
function addNewCard(){
	if(Alloy.Globals.currentUser.attributes.fraudAlert) {
		helpers.alertUser('Account Frozen!', 'Your account has been frozen.  Please contact us for more information!');
		return;
	} else {
		Alloy.Globals.openPage('addCreditCard');	
	}
}

/**
 * @method addNewBank 
 * Checks for a user address which is required by Stripe. If one exists, opens addBankAccount view so users can enter in bank account information.
 */
function addNewBank(){
	//To create a merchant we need an address so we check to see if the user model has an address, 
	//otherwise we send back an alert
	if(Alloy.Globals.currentUser.attributes.fraudAlert) {
		helpers.alertUser('Account Frozen!', 'Your account has been frozen.  Please contact us for more information!');
		return;
	} else if(Alloy.Globals.currentUser.attributes.address) {
		Alloy.Globals.openPage('addBankAccount');
	} else {
		helpers.alertUser('Add Address', 'You must complete your profile and address in \'Edit Profile\' under settings before connecting a bank account');
		return;
	}
}









/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/
 
 /**
 * @private showUserCard
 * @param {Object} cardInfo	CardInfo object containing user's payment information
 *  Dynamically creates XML elements to show the card that a user has entered on Selbi.
 */
 function showUserCard(cardInfo) {
 	var labelFont, iconFont, labelHeight, rowLeft;
 	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        labelFont = 14;
	        iconFont = 14;
	        labelHeight = '35dp';
	        rowLeft = '10dp';
	        break;
	    case 1: //iphoneFive
	        labelFont = 16;
	        iconFont = 16;
	        labelHeight = '45dp';
	        rowLeft = '7dp';
	        break;
	    case 2: //iphoneSix
	        labelFont = 17;
	        iconFont = 17;
	        labelHeight = '45dp';
	        rowLeft = '10dp';
	        break;
	    case 3: //iphoneSixPlus
	        labelFont = 19;
	        iconFont = 19;
	        labelHeight = '50dp';
	        rowLeft = '10dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        labelFont = 17;
	        iconFont = 17;
	        labelHeight = '45dp';
	        break;
	};
 	var viewUserCard = Titanium.UI.createView({
 		layout: 'horizontal',
 		height: labelHeight,
		borderWidth: "1dp",
		borderColor: "#EAEAEA",
 	});
 	var userCardHeader = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "5dp",
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "Card Ending:"
 	});
 	var userCardNumber = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: rowLeft,
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: 'X '+ cardInfo.lastFour
 	});
 	var userCardExp = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: rowLeft,
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: cardInfo.expirationDate
 	});
 	var checkedCardIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		left: "10dp",
		width: Titanium.UI.SIZE,
		color: "#1BA7CD",
		font: {
			fontSize: iconFont
		}
 	});
 	/*var deleteCardIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		right: "15dp",
		width: Titanium.UI.FILL,
		color: "#c10404",
		font: {
			fontSize: iconFont
		}
 	});*/
 	$.fa.add(checkedCardIcon, "fa-check");
 	viewUserCard.add(checkedCardIcon);
 	viewUserCard.add(userCardHeader);
 	viewUserCard.add(userCardNumber);
 	viewUserCard.add(userCardExp);
 	//$.fa.add(deleteCardIcon, "fa-times");
 	//viewUserCard.add(deleteCardIcon);
 	$.paymentDetails.add(viewUserCard);
 	/*deleteCardIcon.addEventListener('click', function() {
 		//delete credit card from Stripe and our db
 		var deleteCardAlert = Titanium.UI.createAlertDialog({
	        	title : 'Delete Card',
	        	buttonNames: ['Confirm', 'Cancel'],
	        	confirm: 0
	    }); 
	    deleteCardAlert.setMessage("Are you sure you want to delete this card?  You'll have to add another card to be able to purchase items on Selbi!" );
 		deleteCardAlert.addEventListener('click', function(e){
		    if (e.index === e.source.confirm){
				var indicatorWindow = indicator.createIndicatorWindow({
					message : "Deleting Credit Card"
				});
				indicatorWindow.openIndicator();
				Ti.API.info('The confirm button was clicked');
				//$.viewAddCard.show();
 				//$.viewAddCard.height = '40dp';
 				paymentManager.deletePayment(function(err, response){
					if(err){
						indicatorWindow.closeIndicator();
						helpers.alertUser('Failed to Delete','Unable to delete payment, please try again or contact us');
						return;
					} else {
						$.paymentDetails.remove(viewUserCard);
						indicatorWindow.closeIndicator();
						return;					
					}			
 				});
			}
		});
 		deleteCardAlert.show();
 		return;
 	});*/
 };




/**
 * @private showUserBank 
 * @param {Object} bankInfo	BankInfo object containing user's payment information
 *  Dynamically creates XML elements to show the bank that a user has entered on Selbi.
 */
function showUserBank(bankInfo) {
	var labelFont, iconFont, labelHeight;
 	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        labelFont = 14;
	        iconFont = 14;
	        labelHeight = '35dp';
	        break;
	    case 1: //iphoneFive
	        labelFont = 16;
	        iconFont = 16;
	        labelHeight = '45dp';
	        break;
	    case 2: //iphoneSix
	        labelFont = 17;
	        iconFont = 17;
	        labelHeight = '45dp';
	        break;
	    case 3: //iphoneSixPlus
	        labelFont = 19;
	        iconFont = 19;
	        labelHeight = '50dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        labelFont = 17;
	        iconFont = 17;
	        labelHeight = '45dp';
	        break;
	};
 	var viewUserBank = Titanium.UI.createView({
 		//backgroundColor: "blue",
 		layout: 'horizontal',
 		height: labelHeight,
		borderWidth: "1dp",
		borderColor: "#EAEAEA",
 	});
 	var userBankHeader = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "5dp",
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "Account Ending:"
 	});
 	var userBankNumber = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "XXXX "+ bankInfo.accountNumberLast4
 	});
 	var checkedBankIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		left: "10dp",
		width: Titanium.UI.SIZE,
		color: "#1BA7CD",
		font: {
			fontSize: iconFont
		}
 	});
 	/*var deleteBankIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		right: "15dp",
		width: Titanium.UI.FILL,
		color: "#c10404",
		font: {
			fontSize: iconFont
		}
 	});*/
 	$.fa.add(checkedBankIcon, "fa-check");
 	viewUserBank.add(checkedBankIcon);
 	viewUserBank.add(userBankHeader);
 	viewUserBank.add(userBankNumber);
 	//$.fa.add(deleteBankIcon, "fa-times");
 	//viewUserBank.add(deleteBankIcon);
 	$.bankingDetails.add(viewUserBank);
 	/*deleteBankIcon.addEventListener('click', function() {
 		//delete bank account from Stripe and our db
 		var deleteBankAlert = Titanium.UI.createAlertDialog({
	        	title : 'Delete Bank Account',
	        	buttonNames: ['Confirm', 'Cancel'],
	        	confirm: 0
	    }); 
	    deleteBankAlert.setMessage("Are you sure you want to delete this bank account?  You'll have to add another account/Venmo to be able to cash out!" );
 		deleteBankAlert.addEventListener('click', function(e){
		    if (e.index === e.source.confirm){
				var indicatorWindow = indicator.createIndicatorWindow({
					message : "Deleting Bank"
				});
				indicatorWindow.openIndicator();
				Ti.API.info('The confirm button was clicked');
 				paymentManager.deleteExternalAccount(function(err, response){
					if(err){
						indicatorWindow.closeIndicator();
						helpers.alertUser('Failed to Delete','Unable to delete bank, please try again or contact us');
						return;
					} else {
						$.bankingDetails.remove(viewUserBank);
						indicatorWindow.closeIndicator();
						return;					
					}			
 				});
			}
		});
 		deleteBankAlert.show();
 		return;
 	});*/
 };






/*----------------------------------------------On page load API calls---------------------------------------------*/


$.activityIndicator.show();

/**
 * @method getPaymentMethods 
 *  On page load, dynamically loads the user's payment methods and calls correlating function to dynamically create XML.
 */
paymentManager.getPaymentMethods(function(err, results){
	console.log('payment stuff ', results);
	if(err) {
		$.paymentView.remove($.bankingDetails);
		$.paymentView.remove($.paymentDetails);
		$.paymentView.remove($.separatorLabel);
		$.paymentView.remove($.viewAddVenmo);
		dynamicElement.defaultLabel('Shoot!, we are unable to load your payment methods right now. If the problem persists please contact us!', function(err, results) {
			$.paymentUndefined.add(results);
		});
	} else {
		if(results.userPaymentMethod.lastFour) {
			showUserCard(results.userPaymentMethod);
		}
		if(results.userMerchant.accountNumberLast4) {
			showUserBank(results.userMerchant);
		}
	}
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
});

//Close addCreditCard page on payment.js load otherwise webview Stripe doesn't properly read the save cc view
//Alloy.Globals.closePage('addCreditCard');
//Alloy.Globals.closePage('addBankAccount');

exports.cleanup = function () {
	Ti.API.info('Cleaning Payments');
	$.off();
	$.destroy();
	Alloy.Globals.removeChildren($.paymentView);
	$.paymentView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};