var AuthManager = require('managers/authManager'),
	args = arguments[0] || {};



function loginUser(){
	// Todo: validation
	
	AuthManager.login($.username.value, $.password.value, function(err, loginResult){
		if(loginResult) {
			console.log("Successfully logged in");
			var homeController = Alloy.createController('listings').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}

function closeWindow(){
	$.login.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}

function forgotPassword(){
	var controller = Alloy.createController('forgotpassword').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}
