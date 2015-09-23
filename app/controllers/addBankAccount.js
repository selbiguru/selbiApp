var args = arguments[0] || {};

var utils = require('utilities/validate'),
helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager'),
modalManager = require('managers/modalmanager');

function saveSubMerchantBankInfo() {
	console.log("%%%%%^^^^^: ", MerchantAccount.FundingDestination.bank);
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
			modalManager.getBirthdayModal(function(err, results){
				console.log("!!!!!!!!!", results);
				results.modalSaveButton.addEventListener('click', function() {
					var textFieldObject = {
						"id": Ti.App.Properties.getString('userId'), //Id of the user 
						"dateOfBirth": formatDate(results.datePicker.value)
					};
					var animateWindowClose = Titanium.UI.create2DMatrix();
				    animateWindowClose = animateWindowClose.scale(0);
				    function formatDate(d) {
					  date = new Date(d);
					  var dd = date.getDate(); 
					  var mm = date.getMonth()+1;
					  var yyyy = date.getFullYear(); 
					  if(dd<10){dd='0'+dd}; 
					  if(mm<10){mm='0'+mm};
					  return d = dd+'/'+mm+'/'+yyyy;
					}
				    Ti.API.info("User selected date: " + results.datePicker.value);
				    Ti.API.info("User pooping poop: " + results.datePicker.value.toLocaleString());
				    Ti.API.info("User beeep toooot: " + formatDate(results.datePicker.value));
				    //userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
				    	//results.modalWindow.close({transform:animateWindowClose, duration:300});
				    	//saveSubMerchantBankInfo();
				    	//return;
				    //});
				    	
				    results.modalWindow.close({transform:animateWindowClose, duration:300});
				});
			});
		} else {
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
				    accountNumber: "$.accountNumber.value,
				    routingNumber: $.routingNumber.value
			  	},
			  	tosAccepted: true,
			  	masterMerchantAccountId: "14ladders_marketplace",
			  	id: Ti.App.Properties.getString('userId'), //Id of the user
			  	venmo: false
			};
		
		paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
			if(err) {
				
			} else {
				
			}
		});*/
	}
	return;
}


// Set the Example Check image
$.imageExCheck.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.exampleCheck;