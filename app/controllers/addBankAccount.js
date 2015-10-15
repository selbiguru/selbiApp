var args = arguments[0] || {};

var utils = require('utilities/validate'),
helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager'),
modalManager = require('managers/modalmanager');
userManager = require('managers/usermanager');


/**
 * @method addBankInfo 
 * Opens Birthday modal if user has not yet entered their birthday
 * Braintree requires birthday when creating a subMerchant Account
 */
function addBankInfo() {
		var a = Titanium.UI.createAlertDialog({
		        title : 'Invalid Banking Fields'
		    });
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
				    a.setMessage("Both Routing and Account fields must be only numbers!");
				    a.show();
				    return;
				}
			}
		} else {
			a.setMessage("Both Routing and Account fields must be filled out!");
			a.show();
		    return;
		}
		console.log("HAPPY BIRTHDAY!!!!", !Alloy.Globals.currentUser.attributes.dateOfBirth);
		console.log("OVTOBER 15TH!!!!", Alloy.Globals.currentUser.attributes.dateOfBirth);
		if(!Alloy.Globals.currentUser.attributes.dateOfBirth || Alloy.Globals.currentUser.attributes.dateOfBirth === false) {
			modalManager.getBirthdayModal(function(err, results){
				results.modalSaveButton.addEventListener('click', function() {
					var textFieldObject = {
						"id": Ti.App.Properties.getString('userId'), //Id of the user 
						"dateOfBirth": results.datePicker.value.toISOString()
					};
					console.log("!!!!!!!!!", textFieldObject);
					var animateWindowClose = Titanium.UI.create2DMatrix();
				    animateWindowClose = animateWindowClose.scale(0);
				    userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
				    	console.log("err!!!!!! ", err);
				    	console.log("userUpdateResults ", userUpdateResult);
				    	console.log("globalupdate birthday ", Alloy.Globals.currentUser.attributes.dateOfBirth);
				    	results.modalWindow.close({transform:animateWindowClose, duration:300});
				    	//sendBankBraintree();
				    	return;
				    });
				    	
				    results.modalWindow.close({transform:animateWindowClose, duration:300});
				});
			});
		} else {
			console.log("pee");
			//sendBankBraintree();
			return;
		}
	return;
}


/**
 * @private sendBankBraintree 
 * Determines if your address is complete on your profile page and if so, creates a subMerchant account with your Bank Account info so you can cash out.
 */
function sendBankBraintree(){
	var a = Titanium.UI.createAlertDialog({
	  	title : 'Add Address'
	});
    if (Alloy.Globals.currentUser.attributes.address) {
		var merchantSubAccountParams = {
			individual: {
			    firstName: Alloy.Globals.currentUser.attributes.firstName,
			    lastName: Alloy.Globals.currentUser.attributes.lastName,
			    email: Alloy.Globals.currentUser.attributes.email,
			    phone: Alloy.Globals.currentUser.attributes.phoneNumber,
			    dateOfBirth: Alloy.Globals.currentUser.attributes.dateOfBirth,
			    address: {
			      streetAddress: Alloy.Globals.currentUser.attributes.userAddress.address,
			      locality: Alloy.Globals.currentUser.attributes.userAddress.city,
			      region: Alloy.Globals.currentUser.attributes.userAddress.state,
			      postalCode: Alloy.Globals.currentUser.attributes.userAddress.zip
			    }
		  	},
			funding: {
			    accountNumber: $.accountNumber.value,
			    routingNumber: $.routingNumber.value
		  	},
		  	id: Ti.App.Properties.getString('userId'), //Id of the user
		  	venmo: false
		};
	
		paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
			console.log("err!!!!!", err);
			console.log("responseobj@@@@@@@", responseObj);
			if(err) {
				
			} else {
		
			}
		});
	} else {
		a.setMessage("You must first complete your profile and address in the settings before continuing!");
		a.show();
		return;
	}
}

// Set the Example Check image
$.imageExCheck.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.exampleCheck;