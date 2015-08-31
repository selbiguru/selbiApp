/**
 * @class Payment
 * This class deals with user's payment and adding/editing new payment methods
 */
var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager');

function addNewCard(){
    paymentManager.getClientToken(function(err, response){
    	//Ti.App.fireEvent('app:fromTitaniumPaymentGetTokenFromServer', { message: 'event fired from Titanium, handled in WebView' });
		return;
	});
	Alloy.Globals.openPage('addCreditCard');
}
function addNewBank(){
	//Add new bank page to add routing number and account number.
	//Need to connect to Braintree if this option is selected
	Alloy.Globals.openPage('addBankAccount');
}
function addVenmo(){
	//Selecting Venmo will not leave this page but instead send info to braintree
	//via this js file.  Then a checkmark will appear to show they selected this option.
	//Need to connect to Braintree if this option is selected.
	//If selected, Braintree uses phone number, which we will have,
	//to send funds to venmo when somone purchases from this vendor
	return true;
}

// Set the Venmo button image
$.imageAddVenmo.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.venmoWhite;

