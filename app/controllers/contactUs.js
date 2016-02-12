var args = arguments[0] || {};
var emailManager = require('managers/emailmanager');
var helpers = require('utilities/helpers');


/**
 * @method sendEmailToSelbi
 * Send an email from a given user to Selbi via 'Contact Us' view
 */
function sendEmailToSelbi() {
	if(helpers.trim($.emailTitle.value, false).length < 1 || helpers.trim($.emailBody.value, false).length < 1) {
		helpers.alertUser('Empty Fields','Please make sure both the subject and message are filled out!');
    	return;
	} else {
		var emailObj = {
			subject: helpers.trim($.emailTitle.value, false),
			body: helpers.trim($.emailBody.value, false) +" User Id: "+ Alloy.Globals.currentUser.attributes.id ,
			email: Alloy.Globals.currentUser.attributes.email,
			name: Alloy.Globals.currentUser.attributes.firstName +" "+Alloy.Globals.currentUser.attributes.lastName
		};
		
		emailManager.sendContactSelbiEmail(emailObj, function(err, emailResult){
			if(err) {
				helpers.alertUser('Email Failed','Failed to send email.  Please try again later!');
				return;
			} else {
				helpers.alertUser('Email Sent!','Selbi has received your message!  We will get back to you asap!');
		    	$.emailBody.value = '';
		    	$.emailTitle.value = '';
			}
			return;
		});
	}
}



/**
 * @private blurTextField 
 * Blurs usernameSearch text field in accordance with expected UI
 */
function blurTextField(e) {
	console.log('LOOPlooploop ', e.source.id);
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

