var AuthManager = require('managers/authManager');
var controls=require('controls');
	
if (AuthManager.isLoggedIn()) {
	var mainController = Alloy.createController('masterlayout').getView();
	mainController.open();		
} else {
	$.index.open();
}

function signIn(){
	var controller = Alloy.createController('login').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}

function register(){
	var controller = Alloy.createController('register').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}