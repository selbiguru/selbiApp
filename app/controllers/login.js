var AuthManager = require('managers/authmanager'),
	helpers = require('utilities/helpers'),
	args = arguments[0] || {};



function loginUser(){
	// Todo: validation
	
	AuthManager.login($.username.value, $.password.value, function(err, loginResult){
		if(err) {
			helpers.alertUser('Login','Please check your Username and Password and try again!');
			return;
		} else {
			var homeController = Alloy.createController('masterlayout').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}

function closeWindow(){
	$.login.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}

function forgotPassword(){
	var controller = Alloy.createController('forgotPassword').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}
