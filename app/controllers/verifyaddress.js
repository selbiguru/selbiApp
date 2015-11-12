var args = arguments[0] || {};
var utils = require('utilities/validate');
var userManager = require('managers/usermanager');
var helpers = require('utilities/helpers');
var address =  args[0];

// Populates the address fields on page load
for(i = 0; i < $.addressValidationView.children.length; i++) {
	var row = $.addressValidationView.children[i];
	if (address[row.children[0].children[1].id]) {
		if (row.children[0].children[1].id === "route" && address["street_number"] !== "short_name") {
			row.children[0].children[1].value = address["street_number"] +" "+ address[row.children[0].children[1].id];
		} else {
			row.children[0].children[1].value = address[row.children[0].children[1].id];
		}
	}
}

//Closes addressgooglemap and verifyaddress Views on 'cancel' click
$.verifyAddressCancelButton.addEventListener('click', function(){
	Alloy.Globals.closePage('addressgooglemap');
	Alloy.Globals.closePage('verifyaddress');
});



function validateAddressView(){
	var value = {
		value: $.apartmenNumber.value,
	};
	var options = {
		trim: true,
		regexp: /^([a-zA-Z0-9\.]+\s?)*$/,
		label: "Apt/Bldg #",
		required: false
	};
	var aptNumber = utils.validate(value, options);
	if (aptNumber.message) {
		alert(aptNumber.message);
		//$.addClass($.userAptNumber, "error");
		return;	
	} else {
		var textFieldObject = {
		"id": Ti.App.Properties.getString('userId'), //Id of the user 
		"userAddress": {
						"address": $.route.value,
						"address2": '#'+ $.apartmenNumber.value, 
						"city": $.locality.value+",", 
						"state": $.administrative_area_level_1.value,
						"zip": $.postal_code.value,
						"country": $.country.value
						}
		};
		userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
			if(err) {
				helpers.alertUser('Update Address','Failed to update address, please try again!');
				return;
			} else {
				helpers.alertUser('Updated Address', 'User address saved!');
				$.verifyAddressCancelButton.fireEvent('click');
				return;
			}
		});
	}
	
}

/*$.userAptNumber.addEventListener('click', function(){
	$.removeClass($.userAptNumber, "error");
});*/
//save to model..grab user object, update/ add address to user model. couchdb





/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.aptNumberView.addEventListener('click', function(e){
	this.children[1].focus();
});
