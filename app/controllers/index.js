var AuthManager = require('managers/authManager');
$.index.open();

if (AuthManager.isLoggedIn()) {
	var homeController = Alloy.createController('listings').getView();
	homeController.open();	
}

function signIn(){
	var controller = Alloy.createController('login').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});	
}