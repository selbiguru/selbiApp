var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager');

function saveCreditCard() {
	//get the nonce from the webView and pass it to our server in paymentManager
	//get user object or user id and
	Ti.App.fireEvent('app:fromTitaniumPaymentSaveCreditCard',{});
	
	Ti.App.addEventListener("app:fromWebViewPaymentGetNonceFromBraintree", function(e) {
  		 //add check for error from webview
  		 var createCustomerObj = {
  		 	userId: Alloy.Globals.currentUser.attributes.id,
  		 	firstName: Alloy.Globals.currentUser.attributes.firstName,
  		 	lastName: Alloy.Globals.currentUser.attributes.lastName,
  		 	paymentMethodNonce: e.nonceObject.nonce
  		 	};
  		 console.log("THIS IS MY CARD", createCustomerObj);
  		 paymentManager.createCustomerAndPaymentMethod(createCustomerObj, function(err, response) {
  		 	//add return response here and close view.  Add card to payment method choice
  		 	return;
  		 });
  		 
  		
	 });
	return;
}
