/**
* this is the main index.js file
* @class Index
*/

var AuthManager = require('managers/authmanager');
var controls=require('controls');
Ti.API.info("platform height: ",Ti.Platform.displayCaps.platformHeight );
Ti.API.info("plaform width: ",Ti.Platform.displayCaps.platformWidth );
if (AuthManager.isLoggedIn() == 1) {
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