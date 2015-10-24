var args = arguments[0] || {};

function sendEmailToSelbi() {
	var emailObj = {
		subject: $.emailTitle.value,
		body: $.emailBody.value,
		email: Alloy.Globals.currentUser.attributes.email,
		phoneNumber: Alloy.Globals.currentUser.attributes.phoneNumber,
		id: Alloy.Globals.currentUser.attributes.id
	};
	return;
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