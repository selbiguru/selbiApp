var args = arguments[0] || {};

var utils = require('utilities/validate'),
helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager'),
modalManager = require('managers/modalmanager');

function saveSubMerchantBankInfo() {
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
		console.log("HAPPY BIRTHDAY!!!!");
		if(!Alloy.Globals.currentUser.attributes.dateOfBirth || Alloy.Globals.currentUser.attributes.dateOfBirth === null) {
			modalManager.getBirthdayModal();
		}
		/*var merchantSubAccountParams = {
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
		  	id: Ti.App.Properties.getString('userId') //Id of the user
		};
	
	paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
		if(err) {
			
		} else {
			
		}
	});*/
	return true;
}


// Set the Example Check image
$.imageExCheck.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.exampleCheck;