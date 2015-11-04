var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
	indicator = require('uielements/indicatorwindow'),
	paymentManager = require('managers/paymentmanager');

function saveCreditCard() {
	//get the nonce from the webView and pass it to our server in paymentManager
	//get user object or user id and
	Ti.App.fireEvent('app:fromTitaniumPaymentSaveCreditCard',{});
	
	Ti.App.addEventListener("app:fromWebViewPaymentGetNonceFromBraintree", savingStuff);
	return;
};

function savingStuff(e){
	//add check for error from webview
	Ti.App.removeEventListener("app:fromWebViewPaymentGetNonceFromBraintree", savingStuff);
	if(e.message) {
		helpers.alertUser(''+e.message.type+'',''+e.message.message+'');
		return;
	} else {
		var createCustomerObj = {
		 	userId: Alloy.Globals.currentUser.attributes.id,
		 	firstName: Alloy.Globals.currentUser.attributes.firstName,
		 	lastName: Alloy.Globals.currentUser.attributes.lastName,
		 	paymentMethodNonce: e.nonceObject.nonce
	 	};
		 var indicatorWindow = indicator.createIndicatorWindow({
			message : "Saving Card"
		 });
		 indicatorWindow.openIndicator();
		 paymentManager.createCustomerAndPaymentMethod(createCustomerObj, function(err, response) {
		 	//add return response here and close view.  Add card to payment method choice
		 	if(err) {
		 		indicatorWindow.closeIndicator();
		 		helpers.alertUser('Save Payment Failed','Unable to save your credit card, please try again later!');
		 		return;
		 	} else {
		 		indicatorWindow.closeIndicator();
		 		helpers.alertUser('Saved!','Your credit card has been saved!');
		 		Alloy.Globals.closePage('addCreditCard');
		 		return;	
		 	}
		 });	
	}
};
