var args = arguments[0] || {};
var userManager = require('managers/usermanager'),
	helpers = require('utilities/helpers'),
	utils = require('utilities/validate');

function closeForgotPassword(){
	$.forgotPassword.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}



$.resetPassword.addEventListener('click', function() {
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
});


function buttonOn() {
	$.resetPassword.touchEnabled = true;
	$.cancel.touchEnabled = true;
}
