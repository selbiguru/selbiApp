var args = arguments[0] || {};
var utils = require('utilities/validate');
var addressManager = require('managers/addressmanager');
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
	buttonsOff();
	var leadingWords = ['building','bldg', 'apartment', 'apt', 'suite', 'ste'];
	var value = {
		value: $.apartmenNumber.value,
	};
	var options = {
		trim: true,
		regexp: /^([a-zA-Z0-9\-]+\s?)*$/,
		label: "Apt/Bldg #",
		required: false
	};
	var aptNumber = utils.validate(value, options);
	if (aptNumber.message) {
		buttonsOn();
		helpers.alertUser('Oops', 'Apt/Bldg can only contain letters/numbers/-');
		return;	
	} else {
		var leadingWordsAdj = false;
		if(leadingWords.indexOf(value.value.toLowerCase().split(" ")[0]) != -1) {
			if(value.value.toLowerCase().split(" ")[0] === 'building') {
				value.value = helpers.capFirstLetter(value.value.toLowerCase().replace("building", "bldg"));
			} else if(value.value.toLowerCase().split(" ")[0] === 'apartment') {
				value.value = helpers.capFirstLetter(value.value.toLowerCase().replace("apartment", "apt"));
			} else if(value.value.toLowerCase().split(" ")[0] === 'suite') {
				value.value = helpers.capFirstLetter(value.value.toLowerCase().replace("suite", "ste"));
			}
			value.value = helpers.capFirstLetter(value.value);
			leadingWordsAdj = true;
		};
		var textFieldObject = {
		"id": Ti.App.Properties.getString('userId'), //Id of the user 
		"userAddress": {
						"address": $.route.value,
						"address2": helpers.trim($.apartmenNumber.value, true).length > 0 ? leadingWordsAdj ? value.value : '#'+ helpers.capFirstLetter(value.value) : '', 
						"city": $.locality.value+",", 
						"state": $.administrative_area_level_1.value,
						"zip": $.postal_code.value,
						"country": $.country.value
						}
		};
		addressManager.addAddress(textFieldObject, function(err, userUpdateResult){
			if(err) {
				buttonsOn();
				helpers.alertUser('Update Address','Failed to update address, please try again');
				return;
			} else {
				buttonsOn();
				helpers.alertUser('Updated Address', 'User address saved');
				$.verifyAddressCancelButton.fireEvent('click');
				return;
			}
		});
	}
	
}



/**
 * @method buttonsOn
 * Turns touchEnabled on buttons on when the page is done saving
 */
function buttonsOn() {
	$.verifyAddressCancelButton.touchEnabled = true;
	$.verifyAddressVerifyButton.touchEnabled = true;
};


/**
 * @method buttonsOff
 * Turns touchEnabled on buttons off while the page is saving
 */
function buttonsOff() {
	$.verifyAddressCancelButton.touchEnabled = false;
	$.verifyAddressVerifyButton.touchEnabled = false;
};


/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.aptNumberView.addEventListener('click', function(e){
	this.children[1].focus();
});
