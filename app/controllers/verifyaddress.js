var args = arguments[0] || {};
var utils = require('utilities/validate');
var address =  args[0];

// Populates the address fields on page load
for(i = 0; i < $.addressValidationView.children.length; i++) {
	var row = $.addressValidationView.children[i];
	if (address[row.children[0].id]) {
		if (row.children[0].id === "route" && address["street_number"] !== "short_name") {
			row.children[0].value = address["street_number"] +" "+ address[row.children[0].id];
		} else {
			row.children[0].value = address[row.children[0].id];
		}
	}
}

//Closes addressgooglemap and verifyaddress Views on 'cancel' click
$.verifyAddressCancelButton.addEventListener('click', function(){
	Alloy.Globals.closePage('addressgooglemap');
	Alloy.Globals.closePage('verifyaddress');
});

//
function validateAddressView(){
	var value = {
		value: $.apartmenNumber.value,
	};
	var options = {
		trim: true,
		regexp: /^([A-Za-z0-9\-\_]*)$/,
		label: "Apt/Street #",
		required: false
	};
	var car = utils.validate(value, options);
	if (car.message) {
		alert(car.message);
		//$.addClass($.userAptNumber, "error");
		return;	
	}
}

/*$.userAptNumber.addEventListener('click', function(){
	$.removeClass($.userAptNumber, "error");
});*/
//save to model..grab user object, update/ add address to user model. couchdb