var args = arguments[0] || {};
var userManager = require('managers/usermanager'),
	helpers = require('utilities/helpers'),
	utils = require('utilities/validate');


/**
 * @method closeForgotPassword
 * Closes the View and controller for forgotPassword and shows the previous view
 */
function closeForgotPassword(){
	$.destroy();
	$.off();
	$.resetPassword.removeEventListener('click', resetPassword);
	$.forgotPasswordView.removeEventListener('click', blurTextField);
	$.email.removeEventListener('return', keyboardResetPassword);
	$.forgotPassword.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}



/**
 * @method resetPassword
 * sends user an email to allow them to reset their password
 */
function resetPassword() {
	$.resetPassword.touchEnabled = false;
	$.cancel.touchEnabled = false;
	if (!helpers.trim($.email.value, true)) {
    	helpers.alertUser('Oops','You must enter an email!');
    	buttonOn();
    	return;
	} 
	var validateEmailObj = {
	   	email: [(helpers.trim($.email.value, true)).toLowerCase(), {required: true,
	   	email: true, label:'Email field'}]
	};
	var validatedEmail = utils.validate(validateEmailObj);
	if(validatedEmail.email.message) {
		helpers.alertUser('Invalid Email', validatedEmail.email.message);
		buttonOn();
		return;
	}
	var emailObject = {
		email: validatedEmail.email
	};
	userManager.forgotPassword(emailObject, function(err, forgotResult) {
		if(err) {
			helpers.alertUser('Oops!','Something went wrong. Make sure the email you entered is correct!');
		} else {
			helpers.alertUser('Success!','An email has been sent to the address you entered!');
			$.email.value = '';
		}
		buttonOn();
	});
};


/**
 * @method buttonOn
 * Makes buttons on view clickable again
 */
function buttonOn() {
	$.resetPassword.touchEnabled = true;
	$.cancel.touchEnabled = true;
};


/**
 * @method keyboardResetPassword
 * Clicking the keyboard 'GO' button fires the resetPassword function
 */
function keyboardResetPassword() {
	$.email.blur();
	resetPassword();
};


/**
 * @private blurTextField 
 * Blurs username and password text field in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'email') {
		$.email.focus();
	} else {
		$.email.blur();
	}
};


/*-------------------------------------------------Event Listeners---------------------------------------------------*/

$.resetPassword.addEventListener('click', resetPassword);
$.forgotPasswordView.addEventListener('click', blurTextField);
$.email.addEventListener('return', keyboardResetPassword);