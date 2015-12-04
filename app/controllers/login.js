var AuthManager = require('managers/authmanager'),
	helpers = require('utilities/helpers'),
	indicator = require('uielements/indicatorwindow'),
	args = arguments[0] || {};
var indicatorWindow = indicator.createIndicatorWindow({
	message : "Signing in"
});



function loginUser(){
	// Todo: validation
	$.loginUser.touchEnabled = false;
	$.forgotPassword.touchEnabled = false;
	$.closeWindow.touchEnabled = false;
	if (!helpers.trim($.username.value, false) || !$.password.value ) {
    	helpers.alertUser('Missing Fields','Please fill out all fields!');
    	buttonOn();
    	return;
	}
	var validatedUsername = helpers.trim($.username.value, false);
	indicatorWindow.openIndicator();
	AuthManager.login(validatedUsername, $.password.value, function(err, loginResult){
		if(err) {
			indicatorWindow.closeIndicator();
			buttonOn();
			helpers.alertUser('Login','Please check your Username and Password and try again!');
			return;
		} else {
			indicatorWindow.closeIndicator();
			buttonOn();
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


/**
 * @method buttonOn
 * Makes buttons on view clickable
 */
function buttonOn() {
	$.loginUser.touchEnabled = true;
	$.forgotPassword.touchEnabled = true;
	$.closeWindow.touchEnabled = true;
}
