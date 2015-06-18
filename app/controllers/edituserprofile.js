var helpers = require('utilities/helpers'),
UserManager = require('managers/usermanager'),
args = arguments[0] || {};

function updateUser(e){
	// Todo: validation
	var textFieldObject = {
		"username": $.username.value,
		"firstName": $.firstName.value,
		"lastName": $.lastName.value,
		"streetAddress": $.streetAddress.value,
		"city": $.city.value, 
		"state": $.state.value
		};
	var validateFields = helpers.validateFields(textFieldObject);
	for (var i in textFieldObject) {
		$.removeClass($[i], "error");
	}
	if(validateFields != true){
		for (var i in validateFields) {
			$.addClass($[i], "error");
		}
		//Todo send back error message
		return true;
	}
	UserManager.userUpdate(validateFields, function(err, userUpdateResult){
		if(userUpdateResult) {
			console.log("Successfully updated user");	
		}
	});	
};
