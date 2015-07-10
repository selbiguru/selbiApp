var helpers = require('utilities/helpers'),
UserManager = require('managers/usermanager'),
args = arguments[0] || {};


function updateUser(e){
	// Todo: validation
	console.log("what is e:", e);
	var textFieldObject = {
		"username": $.username.value,
		"firstName": $.firstName.value,
		"lastName": $.lastName.value,
		"streetAddress": $.streetAddress.value,
		"city": $.city.value, 
		"zipCode": $.zipCode.value,
		"state": $.state.value
		};
	var validateFields = helpers.validateFields(textFieldObject);
	/*for (var i in textFieldObject) {
		if($.[i])
		$.removeClass($[i], "error");
		
	}*/
	if(validateFields != true){
		console.log("validateFields", validateFields);
		for (var i in validateFields) {
			$.addClass($[i], "error");
		}
		//Todo send back error message
	}
	return;
	/*UserManager.userUpdate(validateFields, function(err, userUpdateResult){
		if(userUpdateResult) {
			console.log("Successfully updated user");	
		}
	});	*/
};


function getGoogleMaps(e){
	Alloy.Globals.openPage('addressgooglemap');
}
