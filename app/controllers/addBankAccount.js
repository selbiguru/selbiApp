var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager');

/*function saveSubMerchantBankInfo() {
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
		    destination: MerchantAccount.FundingDestination.bank,
		    accountNumber: "$.accountNumber.value,
		    routingNumber: $.routingNumber.value
	  	},
	  	tosAccepted: true,
	  	masterMerchantAccountId: "14ladders_marketplace",
	  	id: Alloy.Globals.currentUser.attributes.id
	};
	
	paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
		if(err) {
			
		} else {
			
		}
	});
	
}*/