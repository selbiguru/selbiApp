var helpers = require('utilities/helpers');
var args = arguments[0] || {};


function updateUser(){
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
	if(validateFields != true){
		//Todo send back error message
		for (var i in validateFields) {
			console.log("error i", i);
			$.addClass($.textField, "error");
		}
		
	}
	
	/*AuthManager.login($.username.value, $.password.value, function(err, loginResult){
		if(loginResult) {
			console.log("Successfully logged in");
			var homeController = Alloy.createController('masterlayout').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	*/
};
