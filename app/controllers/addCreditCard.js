var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
	indicator = require('uielements/indicatorwindow'),
	paymentManager = require('managers/paymentmanager');
var indicatorWindow = null;



function saveCreditCard() {
	//trigger submit cc form on webview
	buttonsOff();
	Ti.App.fireEvent('app:fromTitaniumPaymentSaveCreditCard',{});
	return;
};



function saveSpinner(param) {
	if(param) {
		console.log('hey there! 909 ', param);
		indicatorWindow = indicator.createIndicatorWindow({
			message : "Saving Card"
		});
		indicatorWindow.openIndicator();	
	} else {
		console.log('well this is an issue currently ', param);
		indicatorWindow.closeIndicator();
	}
}


function savingStuff(e){
	console.log('stripe response returned ', e.responseObj);
	if(e.responseObj.error) {
		helpers.alertUser('Card Error',''+e.responseObj.error.message+'');
		saveSpinner(false);
		buttonsOn();
		return;
	} else {
		var createCustomerObj = {
		 	userId: Alloy.Globals.currentUser.attributes.id,
		 	firstName: Alloy.Globals.currentUser.attributes.firstName,
		 	lastName: Alloy.Globals.currentUser.attributes.lastName,
		 	email: Alloy.Globals.currentUser.attributes.email,
		 	paymentStripeCardResponse: e.responseObj
	 	};
		 paymentManager.createCustomerAndPaymentMethod(createCustomerObj, function(err, response) {
		 	console.log('err: ', err);
		 	console.log('response: ', response);
		 	var parseErr = JSON.parse(err);
		 	//add return response here and close view.  Add card to payment method choice
		 	if(err) {
			 	helpers.alertUser('Save Payment Failed', parseErr+' Please try again');
		 		saveSpinner(false);
		 		buttonsOn();
		 		return;
		 	} else {
		 		helpers.alertUser('Saved!','Your credit card has been saved');
		 		buttonsOn();
		 		saveSpinner(false);
		 		Alloy.Globals.openPage('payment');
		 		backButton();
		 		return;	
		 	}
		 });	
	}
};


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	$.webview.removeEventListener('load', loadCreditCard);
	Ti.App.removeEventListener("app:fromWebViewPaymentGetStripeToken", savingStuff);
	Ti.App.removeEventListener("app:fromWebTriggerSaveSpinner", saveSpinner);
	Ti.App.removeEventListener('app:fromWebTriggerButtonsOn', buttonsOn);
	Alloy.Globals.closePage('addCreditCard');
}


/**
 * @private loadCreditCard 
 *  Loads credit card and checks to make sure cleanup wasn't called before loading view.
 */
function loadCreditCard(e) {
	Ti.API.info('load');
	//Check if cleanup is called before loading view
	if($ && $.activityIndicator){
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
	}
	return;
}


/**
 * @method buttonsOn
 * Turns touchEnabled on buttons on when the page is done saving
 */
function buttonsOn() {
	$.backViewButton.touchEnabled = true;
	$.saveCreditCardButton.touchEnabled = true;
};


/**
 * @method buttonsOff
 * Turns touchEnabled on buttons off while the page is saving
 */
function buttonsOff() {
	$.backViewButton.touchEnabled = false;
	$.saveCreditCardButton.touchEnabled = false;
};



/*-----------------------------------------------On page load API calls----------------------------------------------*/

$.activityIndicator.show();

//listening for Stripe token return from submitted cc form
Ti.App.addEventListener("app:fromWebViewPaymentGetStripeToken", savingStuff);
Ti.App.addEventListener("app:fromWebTriggerSaveSpinner", saveSpinner);
Ti.App.addEventListener('app:fromWebTriggerButtonsOn', buttonsOn);


// For Stripe token, need to determine if environment is dev or prod
if(ENV_PRODUCTION) {
	$.webview.url = "/webViews/addCreditCardProd.html";
} else {
	$.webview.url = "/webViews/addCreditCardDev.html";
}

$.addListener($.webview, 'load', loadCreditCard);

exports.cleanup = function () {
	Ti.API.info('Cleaning CreditCardView');
	$.off();
	$.destroy();
	indicatorWindow = null;
	Alloy.Globals.removeChildren($.addCreditCardView);
	$.addCreditCardView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};
