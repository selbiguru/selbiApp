/**
 * @class Payment
 * This class deals with user's payment and adding/editing new payment methods
 */
var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager');

function addNewCard(){
    paymentManager.getClientToken(function(err, response){
    	Ti.App.fireEvent('app:fromTitaniumPaymentGetTokenFromServer', { token: response });
		return;
	});
	Alloy.Globals.openPage('addCreditCard');
}
function addNewBank(){
	//Add new bank page to add routing number and account number.
	//Need to connect to Braintree if this option is selected
	//To create a merchant we need an address so we check to see if the user model has an address, 
	//otherwise we send back an alert
	/*var a = Titanium.UI.createAlertDialog({
        	title : 'Add Address'
    	});
	if (user.address) {
		Alloy.Globals.openPage('addBankAccount');
	} else {
		a.setMessage("You must first add an address under your profile!");
	    a.show();
		return;
	}*/
	Alloy.Globals.openPage('addBankAccount');
}
function addVenmo(){
	//Selecting Venmo will not leave this page but instead send info to braintree
	//via this js file.  Then a checkmark will appear to show they selected this option.
	//Need to connect to Braintree if this option is selected.
	//If selected, Braintree uses phone number, which we will have,
	//to send funds to venmo when somone purchases from this vendor
	//To create a merchant we need an address so we check to see if the user model has an address, 
	//otherwise we send back an alert
	/*var a = Titanium.UI.createAlertDialog({
        	title : 'Add Address'
    	});
	if (user.address) {
		var merchantSubAccountParams = {
			individual: {
			    firstName: Alloy.Globals.currentUser.attributes.firstName,
			    lastName: Alloy.Globals.currentUser.attributes.lastName,
			    email: Alloy.Globals.currentUser.attributes.email,
			    phone: Alloy.Globals.currentUser.attributes.phoneNumber,
			    dateOfBirth: "1981-11-19",
			    address: {
			      streetAddress: Alloy.Globals.currentUser.attributes.userAddress.address,
			      locality: Alloy.Globals.currentUser.attributes.userAddress.city,
			      region: Alloy.Globals.currentUser.attributes.userAddress.state,
			      postalCode: Alloy.Globals.currentUser.attributes.userAddress.zip
			    }
  		  	},
  			funding: {
			    descriptor: "Selbi Sale",
			    destination: MerchantAccount.FundingDestination.mobile,
			    email: "Alloy.Globals.currentUser.attributes.email,
			    mobilePhone: Alloy.Globals.currentUser.attributes.phoneNumber
		  	},
		  	tosAccepted: true,
		  	masterMerchantAccountId: "14ladders_marketplace",
		  	id: Ti.App.Properties.getString('userId') //Id of the user
  		};
  		paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
			if(err) {
				
			} else {
				
			}
		});
  		
	} else {
		a.setMessage("You must first complete your profile in the settings!");
	    a.show();
		return;
	}*/
	return;
}

// Set the Venmo button image
$.imageAddVenmo.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.venmoWhite;


paymentManager.getCustomerPaymentMethod(function(err, results){
	console.log("%%%%%%%%%%%: ",results);
});