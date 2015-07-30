var AuthManager = require('managers/authmanager'),
	args = arguments[0] || {};

function registerUser(){
	// Todo: validation when we have a template
	/*if (!$.firstName.value || !$.lastName.value || !$.username.value || !$.password.value) {
		return error;
	}*/
	
	AuthManager.userRegister($.firstName.value, $.lastName.value, $.email.value, $.password.value, function(err, registerResult){
		if(registerResult) {
			console.log("Successfully regsitered");
			var homeController = Alloy.createController('masterlayout').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}

function closeRegisterWindow(){
	$.register.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}