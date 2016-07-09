var args = arguments[0] || {};

var utils = require('utilities/validate'),
	helpers = require('utilities/helpers'),
	paymentManager = require('managers/paymentmanager'),
	indicator = require('uielements/indicatorwindow'),
	modalManager = require('managers/modalmanager'),
	userManager = require('managers/usermanager');
	managedAccountParams = null,
	currentUser = null;
var indicatorWindow = null;


/**
 * @method addBankInfo 
 * Opens Birthday modal if user has not yet entered their birthday
 * Stripe requires birthday for validation when creating a Managed Account
 */
function addBankInfo() {
		buttonsOff();
		if(helpers.trim($.ssnNumber.value, true).length !== 4) {
			helpers.alertUser('Invalid SSN Number','Your SSN must be exactly 4 numbers');
		    buttonsOn();
		    return;
		} else if(helpers.trim($.routingNumber.value, true).length !== 9) {
			helpers.alertUser('Invalid Routing Number','Your Routing Number must be exactly 9 numbers');
		    buttonsOn();
		    return;
		}
		if($.accountNumber.value != "" && $.routingNumber.value != "" && $.ssnNumber.value != "") {
			var validateFieldObject = {
				accountNumber: [helpers.trim($.accountNumber.value, true), {required: true,
	       		regexp: /^[0-9]{4,17}$/, label:'Account Number field'}],
				routingNumber: [helpers.trim($.routingNumber.value, true), {required: true,
	       		regexp: /^[0-9]{9}$/, label:'Routing Number field'}],
	       		ssnNumber: [helpers.trim($.ssnNumber.value, true), {required: true,
	       		regexp: /^[0-9]{4}$/, label:'SSN Number field'}]
			};
			
			var validateBankAccount = utils.validate(validateFieldObject);
			for (i in validateBankAccount) {
				if(validateBankAccount[i].message){
					helpers.alertUser('Invalid Banking Fields','Routing, Account, and SSN fields must be only numbers');
				    buttonsOn();
				    return;
				}
			}
		} else {
			helpers.alertUser('Invalid Banking Fields','Routing, Account, and SSN fields must be filled out');
		    buttonsOn();
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
				    		helpers.alertUser('Update User','Failed to save your birthday, please try again later');
				    		buttonsOn();
				    		return;
				    	} else {
				    		results.modalWindow.close({transform:animateWindowClose, duration:300});
					    	sendBankStripe();
					    	return;
				    	}
				    });
				    results.modalWindow.close({transform:animateWindowClose, duration:300});
				    animateWindowClose = null;
				});
			});
		} else {
			sendBankStripe();
			return;
		}
	return;
}


/**
 * @private sendBankStripe 
 * Creates a Managed account with your Bank Account info so you can cash out.
 */
function sendBankStripe(){
	managedAccountParams = {
		individual: {
		    firstName: Alloy.Globals.currentUser.attributes.firstName,
		    lastName: Alloy.Globals.currentUser.attributes.lastName,
		    email: Alloy.Globals.currentUser.attributes.email,
		    phone: Alloy.Globals.currentUser.attributes.phoneNumber,
		    dateOfBirth: Alloy.Globals.currentUser.attributes.dateOfBirth,
		    ssn_last_4: $.ssnNumber.value,
		    ip: Ti.Platform.address,
		    address: {
		      line1: Alloy.Globals.currentUser.attributes.address,
		      line2: Alloy.Globals.currentUser.attributes.address2 || '',
		      city: Alloy.Globals.currentUser.attributes.city,
		      state: Alloy.Globals.currentUser.attributes.state,
		      postal_code: Alloy.Globals.currentUser.attributes.zip
		    }
	  	},
		funding: {
		    accountNumber: $.accountNumber.value,
		    routingNumber: $.routingNumber.value
	  	},
	  	id: Ti.App.Properties.getString('userId') //Id of the user
	};
	indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving Banking Info"
	});
	indicatorWindow.openIndicator();
	tokenizeBank(managedAccountParams, createStripeManagedAccount);	
}


/**
 * @private createStripeManagedAccount 
 * @param {Object} tokenObj Object containing Stripe token response
 *  Creates Stripe Managed Account on Selbi
 */
function createStripeManagedAccount(tokenObj) {
	managedAccountParams.funding = tokenObj;
	managedAccountParams.individual.ip = tokenObj.client_ip || Ti.Platform.address;
	
	if(tokenObj.error) {
		helpers.alertUser('Failed to Save', tokenObj.error.message);
		indicatorWindow.closeIndicator();
		buttonsOn();
		return;	
	} else {
		paymentManager.createManagedAccount(managedAccountParams, function(err, responseObj) {
			if(err) {
				helpers.alertUser('Failed to Save','Please make sure your bank information is correct and try again');
				indicatorWindow.closeIndicator();
				buttonsOn();
				return;
			} else {
				currentUser.set({'userMerchant': true});	
				currentUser.save();
				helpers.alertUser('Saved','Your bank information has been saved');
				buttonsOn();
				indicatorWindow.closeIndicator();
				Alloy.Globals.openPage('payment');
				backButton(false);
				return;
			}
		});
	}
}

/**
 * @private backButton
 * @param {Boolean} param Boolean to close addBankAccount or reload payment view
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton(param) {
	$.addBankAccountView.removeEventListener('click', blurTextField);
	$.accountNumberView.removeEventListener('click', focusTextField);
	$.routingNumberView.removeEventListener('click', focusTextField);
	$.ssnNumberView.removeEventListener('click', focusTextField);
	Alloy.Globals.closePage('addBankAccount');
}


/**
 * @private focusTextField 
 * Focuses accountNumber, routingNumber, and ssnNumber text fields in accordance with expected UI
 */
function focusTextField(e) {
	if(e.source.id === 'accountNumberView' || e.source.id === 'accountNumber' || e.source.id === 'accountLabel') {
		$.accountNumber.focus();
	} else if(e.source.id === 'routingNumberView' || e.source.id === 'routingNumber' || e.source.id === 'routingLabel') {
		$.routingNumber.focus();
	} else if(e.source.id === 'ssnNumberView' || e.source.id === 'ssnNumber' || e.source.id === 'ssnLabel') {
		$.ssnNumber.focus();
	}
}


/**
 * @private blurTextField 
 * Blurs accountNumber, routingNumber, and ssnNumber text fields in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'accountNumberView' || e.source.id === 'accountNumber' || e.source.id === 'accountLabel') {
		$.routingNumber.blur();
		$.ssnNumber.blur();
	} else if(e.source.id === 'routingNumberView' || e.source.id === 'routingNumber' || e.source.id === 'routingLabel') {
		$.accountNumber.blur();
		$.ssnNumber.blur();
	} else if(e.source.id === 'ssnNumberView' || e.source.id === 'ssnNumber' || e.source.id === 'ssnLabel') {
		$.accountNumber.blur();
		$.routingNumber.blur();	
	} else {
		$.accountNumber.blur();
		$.routingNumber.blur();
		$.ssnNumber.blur();	
	}
}


/**
 * @method buttonsOn
 * Turns touchEnabled on buttons on when the page is done saving
 */
function buttonsOn() {
	$.saveManagedBankButton.touchEnabled = true;
	$.backViewButton.touchEnabled = true;
};


/**
 * @method buttonsOff
 * Turns touchEnabled on buttons off while the page is saving
 */
function buttonsOff() {
	$.saveManagedBankButton.touchEnabled = false;
	$.backViewButton.touchEnabled = false;
};

/**
 * @method stripeValidtation
 * @param {Object} validationObj Object containing Stripe validation response
 * Returns false if routing or account number dont pass validation
 */ 
function stripeValidtation(validationObj) {
	indicatorWindow.closeIndicator();
	buttonsOn();
	helpers.alertUser('Invalid Banking Fields','Please check your Routing and Account numbers and try again');
    return;
};

/**
 * @method tokenizeBank
 * @param {Object} bankDetails Object containing Bank detail entered by user for Stripe tokenization
 * @param {Object} callback	Callback function after completing the Stripe tokenize card http request
 */
function tokenizeBank(bankDetails, callback) {
    var STRIPE_URL = "https://api.stripe.com/v1/tokens";
    var STRIPE_TOKEN = Alloy.CFG.stripeKey.publicKey;
    var xhr = Ti.Network.createHTTPClient({
        onload : function(e) {
            var resp = JSON.parse(this.responseText);
            resp.success = true;
            callback(resp);
            xhr.abort();
        	xhr = null;
        }, onerror : function(e) {
            var resp = JSON.parse(this.responseText);
            resp.success = false;
            callback(resp);
            xhr.abort();
        	xhr = null;
        }
    });
    // Format the request data using application/x-www-form-urlencoded.
    var formattedData = "bank_account[country]=" + 'US' +
                    "&bank_account[currency]=" + 'USD' +
                    "&bank_account[routing_number]=" + bankDetails.funding.routingNumber +
                    "&bank_account[account_number]=" + bankDetails.funding.accountNumber +
                    "&bank_account[account_holder_name]=" + bankDetails.individual.firstName + ' ' + bankDetails.individual.lastName +
                    "&bank_account[account_holder_type]=" + 'individual';
    // Open the connection as a POST.
    xhr.open("POST", STRIPE_URL);
    
    // Stripe publishable key has to be sent as Authorization header.
    xhr.setRequestHeader("Authorization","Bearer " + STRIPE_TOKEN);
    
    // Send data.
    xhr.send(formattedData);
};

// Set the Example Check image
$.imageExCheck.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.exampleCheck;


//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		currentUser = data;
	},
	error: function(data){		
	}
});

/*-------------------------------------------------Event Listeners---------------------------------------------------*/


$.addListener($.addBankAccountView,'click', blurTextField);
$.addListener($.accountNumberView,'click', focusTextField);
$.addListener($.routingNumberView,'click', focusTextField);
$.addListener($.ssnNumberView,'click', focusTextField);

Alloy.Globals.addKeyboardToolbar($.accountNumber, blurTextField);
Alloy.Globals.addKeyboardToolbar($.routingNumber, blurTextField);
Alloy.Globals.addKeyboardToolbar($.ssnNumber, blurTextField);


exports.cleanup = function () {
	$.off();
	$.destroy();
	indicatorWindow = null;
	$.removeListener();
	Alloy.Globals.removeChildren($.addBankAccountView);
	$.addBankAccountView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};
