var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
	indicator = require('uielements/indicatorwindow'),
	paymentManager = require('managers/paymentmanager');
var array = [];


Ti.App.addEventListener("app:BrainTreeHostLoad", addingArray);


function addingArray(e) {
	console.log('+++++++++++++++',e);
	Ti.App.removeEventListener("app:BrainTreeHostLoad", addingArray);
	if(e.braintree) {
		array.push(e.braintree);
	}
};

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
		helpers.alertUser(''+e.message.type+'','Unable to validate your Credit Card');
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
		 		if(err === 'false') {
			 		helpers.alertUser('Payment Nonce','Unable to find a payment nonce. Please contact us so we can remedy the situation!');
		 		} else {
			 		helpers.alertUser('Save Payment Failed','Unable to save your credit card, please try again!');
		 		}
		 		indicatorWindow.closeIndicator();
		 		return;
		 	} else if(!response.cardStatus) {
		 		indicatorWindow.closeIndicator();
		 		helpers.alertUser('Declined','Your Credit Card was declined, please try another card!');
		 		return;
		 	} else {
		 		indicatorWindow.closeIndicator();
		 		helpers.alertUser('Saved!','Your credit card has been saved!');
		 		Alloy.Globals.closePage('addCreditCard');
		 		Alloy.Globals.openPage('payment');
		 		return;	
		 	}
		 });	
	}
};





/*-----------------------------------------------On page load API calls----------------------------------------------*/

$.activityIndicator.show();

$.webview.addEventListener('beforeload', function(){
    Ti.API.info('beforeload');
});

$.webview.addEventListener('load', function(e) {
    Ti.API.info('load');
    paymentManager.getClientToken(function(err, response){
		if(err || array.length <= 0){
	    	helpers.alertUser('Oops!','Something went wrong.  Please try again!');
	    	Alloy.Globals.closePage('addCreditCard');
		} else {
	    	Ti.App.fireEvent('app:fromTitaniumPaymentGetTokenFromServer', { token: response });
		}
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
		return;
	});	
});