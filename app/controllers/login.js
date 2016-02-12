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
			removeEventListeners();
			indicatorWindow.closeIndicator();
			buttonOn();
			var homeController = Alloy.createController('masterlayout').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});
}

function closeWindow(){
	removeEventListeners();
	$.login.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}


/**
 * @method removeEventListeners
 * Removes event listeners
 */
function removeEventListeners() {
	$.loginView.removeEventListener('click', blurTextField);
	$.username.removeEventListener('return', keyboardNext);
	$.password.removeEventListener('return', keyboardLogIn);
};


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



/**
 * @private blurTextField 
 * Blurs username and password text field in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'username') {
		$.username.focus();
		$.password.blur();
	} else if(e.source.id === 'password') {
		$.password.focus();
		$.username.blur();
	} else {
		$.password.blur();
		$.username.blur();
	}
};


/**
 * @method keyboardNext
 * Clicking the keyboard 'NEXT' button takes the user from username to password
 */
function keyboardNext() {
	$.username.blur();
	$.password.focus();
};


/**
 * @method keyboardLogIn
 * Clicking the keyboard 'GO' button attempts to sign the user in
 */
function keyboardLogIn() {
	$.password.blur();
	loginUser();
};



/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.loginView.addEventListener('click', blurTextField);

$.username.addEventListener('return', keyboardNext);

$.password.addEventListener('return', keyboardLogIn);
