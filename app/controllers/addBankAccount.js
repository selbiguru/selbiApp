var args = arguments[0] || {};

var utils = require('utilities/validate'),
	helpers = require('utilities/helpers'),
	paymentManager = require('managers/paymentmanager'),
	indicator = require('uielements/indicatorwindow'),
	modalManager = require('managers/modalmanager'),
	userManager = require('managers/usermanager');


/**
 * @method addBankInfo 
 * Opens Birthday modal if user has not yet entered their birthday
 * Braintree requires birthday when creating a subMerchant Account
 */
function addBankInfo() {
		if($.accountNumber.value != "" && $.routingNumber.value != "") {
			var validateFieldObject = {
				accountNumber: [helpers.trim($.accountNumber.value, true), {required: true,
	       		numeric: true, label:'Account Number field'}],
				routingNumber: [helpers.trim($.routingNumber.value, true), {required: true,
	       		numeric: true, label:'Routing Number field'}]
			};
			
			var validateBankAccount = utils.validate(validateFieldObject);
			for (i in validateBankAccount) {
				if(validateBankAccount[i].message){
					helpers.alertUser('Invalid Banking Fields','Both Routing and Account fields must be only numbers!');
				    return;
				}
			}
		} else {
			helpers.alertUser('Invalid Banking Fields','Both Routing and Account fields must be filled out!');
		    return;
		}
		
		if(!Alloy.Globals.currentUser.attributes.dateOfBirth || Alloy.Globals.currentUser.attributes.dateOfBirth === false) {
			modalManager.getBirthdayModal(function(err, results){
				results.modalSaveButton.addEventListener('click', function() {
					var textFieldObject = {
						"id": Ti.App.Properties.getString('userId'), //Id of the user 
						"dateOfBirth": results.datePicker.value.toISOString()
					};
					var animateWindowClose = Titanium.UI.create2DMatrix();
				    animateWindowClose = animateWindowClose.scale(0);
				    userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
				    	if(err) {
				    		helpers.alertUser('Update User','Failed to save your birthday, please try again later!');
				    		return;
				    	} else {
				    		results.modalWindow.close({transform:animateWindowClose, duration:300});
					    	sendBankBraintree();
					    	return;
				    	}
				    });
		    	
				    results.modalWindow.close({transform:animateWindowClose, duration:300});
				});
			});
		} else {
			sendBankBraintree();
			return;
		}
	return;
}


/**
 * @private sendBankBraintree 
 * Creates a subMerchant account with your Bank Account info so you can cash out.
 */
function sendBankBraintree(){
	var merchantSubAccountParams = {
		individual: {
		    firstName: Alloy.Globals.currentUser.attributes.firstName,
		    lastName: Alloy.Globals.currentUser.attributes.lastName,
		    email: Alloy.Globals.currentUser.attributes.email,
		    phone: Alloy.Globals.currentUser.attributes.phoneNumber,
		    dateOfBirth: Alloy.Globals.currentUser.attributes.dateOfBirth,
		    address: {
		      streetAddress: Alloy.Globals.currentUser.attributes.address,
		      locality: Alloy.Globals.currentUser.attributes.city,
		      region: Alloy.Globals.currentUser.attributes.state,
		      postalCode: Alloy.Globals.currentUser.attributes.zip
		    }
	  	},
		funding: {
		    accountNumber: $.accountNumber.value,
		    routingNumber: $.routingNumber.value
	  	},
	  	id: Ti.App.Properties.getString('userId'), //Id of the user
	  	venmo: false
	};
	var indicatorWindow = indicator.createIndicatorWindow({
			message : "Saving Banking Info"
	});
	indicatorWindow.openIndicator();
	paymentManager.createSubMerchantAccount(merchantSubAccountParams, function(err, responseObj) {
		if(err) {
			helpers.alertUser('Failed to Save','Please make sure your bank information is correct and try again!');
			indicatorWindow.closeIndicator();
			return;
		} else {
			helpers.alertUser('Saved','Your bank information has been saved!');
			Alloy.Globals.closePage('payment');
			Alloy.Globals.openPage('payment');
			backButton();
			indicatorWindow.closeIndicator();
		}
	}); 	
}


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	$.addBankAccountView.removeEventListener('click', blurTextField);
	$.accountNumberView.removeEventListener('click', focusTextField);
	$.routingNumberView.removeEventListener('click', focusTextField);
	Alloy.Globals.closePage('addBankAccount');
}


/**
 * @private focusTextField 
 * Focuses accountNumber and routingNumber text fields in accordance with expected UI
 */
function focusTextField(e) {
	if(e.source.id === 'accountNumber' || e.source.id === 'accountLabel') {
		$.accountNumber.focus();
	} else if(e.source.id === 'routingNumber' || e.source.id === 'routingLabel') {
		$.routingNumber.focus();
	}
}


/**
 * @private blurTextField 
 * Blurs accountNumber and routingNumber text fields in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'accountNumber' || e.source.id === 'accountLabel') {
		$.routingNumber.blur();
	} else if(e.source.id === 'routingNumber' || e.source.id === 'routingLabel') {
		$.accountNumber.blur();
	} else {
		$.accountNumber.blur();
		$.routingNumber.blur();	
	}
}

// Set the Example Check image
$.imageExCheck.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.exampleCheck;




/*-------------------------------------------------Event Listeners---------------------------------------------------*/
 

$.addBankAccountView.addEventListener('click', blurTextField);
$.accountNumberView.addEventListener('click', focusTextField);
$.routingNumberView.addEventListener('click', focusTextField);
