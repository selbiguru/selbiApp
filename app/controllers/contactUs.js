var args = arguments[0] || {};
var emailManager = require('managers/emailmanager');
var helpers = require('utilities/helpers');


/**
 * @method sendEmailToSelbi
 * Send an email from a given user to Selbi via 'Contact Us' view
 */
function sendEmailToSelbi() {
	if($.emailTitle.value.length < 1 || $.emailBody.value.length < 1) {
		helpers.alertUser('Empty Fields','Please make sure both the subject and message are filled out!');
    	return;
	} else {
		var emailObj = {
			subject: $.emailTitle.value,
			body: $.emailBody.value+" User Id: "+ Alloy.Globals.currentUser.attributes.id ,
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






/*----------------------------------------------------Event Listeners--------------------------------------------------------*/


// The below three event listeners are a hack to add "Hint Text" to a TextArea 
// Appcelerator does not support hint text TextArea
$.hintTextLabel.addEventListener('click', function(e){
	$.emailBody.focus();
	if($.emailBody.value.length > 0) {
		$.hintTextLabel.hide();
	}
});
$.emailBody.addEventListener('focus',function(e){
    if(e.source.value.length > 0){
        $.hintTextLabel.hide();
    }
});
$.emailBody.addEventListener('blur',function(e){
    if(e.source.value.length <= 0){
        $.hintTextLabel.show();
    }
});
$.emailBody.addEventListener('change',function(e){
    if(e.source.value.length > 0){
        $.hintTextLabel.hide();
    } else {
    	$.hintTextLabel.show();
    }
});