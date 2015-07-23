var args = arguments[0] || {};
var address =  args[0];

for(i = 0; i < $.addressValidationView.children.length; i++) {
	var row = $.addressValidationView.children[i];
	if (address[row.children[0].id]) {
		if (row.children[0].id === "route") {
			row.children[0].value = address["street_number"] +" "+ address[row.children[0].id];
		} else {
			row.children[0].value = address[row.children[0].id];
		}
	}
}


$.verifyAddressCancelButton.addEventListener('click', function(){
	Alloy.Globals.closePage('addressgooglemap');
	Alloy.Globals.closePage('verifyaddress');
});
/*function closeValidateView(){
	Alloy.Globals.closePage('verifyaddress');
}*/

function validateAddressView(){
	//console.log("true");
}

//save to model..grab user object, update/ add address to user model. couchdb