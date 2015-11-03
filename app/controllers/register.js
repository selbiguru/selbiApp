var AuthManager = require('managers/authmanager'),
	modalManager = require('managers/modalmanager'),
	twilioManager = require('managers/twiliomanager'),
	args = arguments[0] || {};
var prevNumber = '';


function registerUser(){
	// Todo: validation when we have a template
	if (!$.firstName.value || !$.lastName.value || !$.email.value || !$.password.value || !$.phoneNumber.value) {
		var a = Titanium.UI.createAlertDialog({
        	title : 'Missing Fields'
    	});
    	a.setMessage("All fields must be filled out!");
    	a.show();
    	return;
	}
	var userName = ($.email.value).replace(/@.*$/,"")+(Math.floor(Math.random() * 9000000)+1000000);
	var validatedNumber = validatePhoneNumber($.phoneNumber.value);
	/*if(!validatedNumber) {
		var c = Titanium.UI.createAlertDialog({
        	title : 'Invalid Phone Number'
    	});
		c.setMessage("Please enter a valid phone number beginning with area code");
		c.show();
		return;
	}
	var codeNumbers =[];
	var randomNumber = Math.floor(Math.random() * 8999 + 1000);
	var validateObject = {
		phoneNumber: validatedNumber,
		verifyPhone: randomNumber
	};
	twilioManager.sendValidationMessage(validateObject, function(error, response){
		if(error) {
			console.log("ROBIN");
			return;
		} else {
			console.log("BATMAN");
			modalManager.getVerifyPhoneModal(function(err, results){
				results.verifyModalView.addEventListener('change', function(e){
					var children = results.verifyModalView.children;
					for(var i = 0 ; i < children.length; i++){
						var child = children[i],
							nextChild = children[i+1];
						if(e.source.id === child.id){
							if(child.value.length > 0 && i !== (children.length - 1)) {
								codeNumbers[i] = child.value;
								nextChild.focus();
							} else if(child.value.length > 0) {
								codeNumbers[i] = child.value;
								child.blur();
							}
						}
					}
					return;
				});
				results.modalVerifyButton.addEventListener('click', function() {
					if(randomNumber === +codeNumbers.join('')) {
						var animateWindowClose = Titanium.UI.create2DMatrix();
					    animateWindowClose = animateWindowClose.scale(0);	
					    results.modalWindow.close({transform:animateWindowClose, duration:300});*/
					    AuthManager.userRegister($.firstName.value, $.lastName.value, $.email.value, userName, $.password.value, validatedNumber, function(err, registerResult){
							if(registerResult) {
								console.log("Successfully regsitered");
								var homeController = Alloy.createController('masterlayout').getView();
								homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
							}
						});
					  /*} else {
					  	return;
					  }
				});
				results.modalResendButton.addEventListener('click', function() {
					randomNumber = Math.floor(Math.random() * 8999 + 1000);
					validateObject.verifyPhone = randomNumber;
					twilioManager.sendValidationMessage(validateObject, function(error, response){
						if(error) {
							console.log("Ping");
							return;
						} else {
							console.log("Pong");
							return;
						}
					});
				});
			});
		}
	});*/
}

function closeRegisterWindow(){
	$.register.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}


/**
 * @method validatePhoneNumber
 * Validate the phone number when a user signs-up
 * @param {String} phoneNumber User's phone number
 */
function validatePhoneNumber(phoneNumber) {
	var phone = phoneNumber.replace(/\D/g, '');
	if(phone.charAt(0) === "1") {
		return false;
	} else {
		return phone;
	};
};



/*************************************************Event Listeners***********************************************************/

$.phoneNumber.addEventListener('change', function(e){
	if(prevNumber.length <= this.value.length) {
		if((validatePhoneNumber(this.value).length === 4 || validatePhoneNumber(this.value).length === 7) && prevNumber.slice(-1) !== '-') {
			this.value = (this.value).substring(0,this.value.length - 1) +'-'+(this.value).substring(this.value.length - 1);
		} else {
			this.value = this.value;
		} 	
	}
	prevNumber = this.value;
});
