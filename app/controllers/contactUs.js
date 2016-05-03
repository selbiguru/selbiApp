var args = arguments[0] || {};
var emailManager = require('managers/emailmanager');
var helpers = require('utilities/helpers');
var indicator = require('uielements/indicatorwindow');




/**
 * @method sendEmailToSelbi
 * Send an email from a given user to Selbi via 'Contact Us' view
 */
function sendEmailToSelbi() {
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Sending Email"
	});
	$.sendEmailButton.touchEnabled = false;
	$.menuButton.touchEnabled = false;
	if(helpers.trim($.emailTitle.value, false).length < 1 || helpers.trim($.emailBody.value, false).length < 1) {
		helpers.alertUser('Empty Fields','Please make sure both the subject and message are filled out!');
    	buttonOn();
    	return;
	} else {
		indicatorWindow.openIndicator();
		var emailObj = {
			subject: helpers.trim($.emailTitle.value, false),
			body: helpers.trim($.emailBody.value, false) +"<br><br><br>User Id: &nbsp;&nbsp;&nbsp;"+ Alloy.Globals.currentUser.attributes.id ,
			email: Alloy.Globals.currentUser.attributes.email,
			name: Alloy.Globals.currentUser.attributes.firstName +" "+Alloy.Globals.currentUser.attributes.lastName
		};
		emailManager.sendContactSelbiEmail(emailObj, function(err, emailResult){
			if(err) {
				helpers.alertUser('Email Failed','Failed to send email.  Please try again later!');
			} else {
				helpers.alertUser('Email Sent!','Selbi has received your message!  We will get back to you asap!');
		    	$.emailBody.value = '';
		    	$.emailTitle.value = '';
			}
			buttonOn();
			indicatorWindow.closeIndicator();
			indicatorWindow = null;
			return;
		});
	}
}



/**
 * 
 * @private blurTextField 
 * Blurs usernameSearch text field in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'emailTitle'){
		$.emailTitle.focus();
		$.emailBody.blur();
	} else if(e.source.id === 'emailBody' || e.source.id === 'hintTextLabel') {
		$.emailTitle.blur();
		$.emailBody.focus();
	} else {
		$.emailTitle.blur();
		$.emailBody.blur();
	}
};


/**
 * @method keyboardNext 
 * On keyboard 'NEXT' button pressed emailTitle is blurred and emailBody is set to focus
 */
function keyboardNext(){
	$.emailTitle.blur();
	$.emailBody.focus();
};


/**
 * @method buttonOn
 * Makes buttons on view clickable
 */
function buttonOn() {
	$.sendEmailButton.touchEnabled = true;
	$.menuButton.touchEnabled = true;
}


/*----------------------------------------------------Event Listeners--------------------------------------------------------*/


// The below three event listeners are a hack to add "Hint Text" to a TextArea 
// Appcelerator does not support hint text TextArea
$.hintTextLabel.addEventListener('click', function(e){
	$.emailBody.focus();
	if(helpers.trim($.emailBody.value, false).length > 0) {
		$.hintTextLabel.hide();
	}
});
$.emailBody.addEventListener('focus',function(e){
    if(helpers.trim(e.source.value, false).length > 0){
        $.hintTextLabel.hide();
    }
});
$.emailBody.addEventListener('blur',function(e){
    if(helpers.trim(e.source.value, false).length <= 0){
    	$.emailBody.value = '';
        $.hintTextLabel.show();
    }
});
$.emailBody.addEventListener('change',function(e){
    if(helpers.trim(e.source.value, false).length > 0){
        $.hintTextLabel.hide();
    } else {
    	$.emailBody.value = '';
    	$.hintTextLabel.show();
    }
});


$.contactUsView.addEventListener('click', blurTextField);

$.emailTitle.addEventListener('return', keyboardNext);

Alloy.Globals.addKeyboardToolbar($.emailTitle, blurTextField);
Alloy.Globals.addKeyboardToolbar($.emailBody, blurTextField);

exports.cleanup = function () {
	Ti.API.info('Cleaning conactUsView');
	$.off();
	$.destroy();
	$.removeListener();
	Alloy.Globals.removeChildren($.contactUsView);
	$.contactUsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};
