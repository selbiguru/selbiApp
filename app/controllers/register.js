var AuthManager = require('managers/authmanager'),
	modalManager = require('managers/modalmanager'),
	friendsManager = require('managers/friendsmanager'),
	twilioManager = require('managers/twiliomanager'),
	helpers = require('utilities/helpers'),
	indicator = require('uielements/indicatorwindow'),
	args = arguments[0] || {};
var prevNumber = '';
var indicatorWindow = indicator.createIndicatorWindow({
	message : "Registering"
});


function registerUser(){
	$.registerButton.touchEnabled = false;
	$.closeRegister.touchEnabled = false;
	// Todo: validation when we have a template
	if (!$.firstName.value || !$.lastName.value || !$.email.value || !$.password.value || !$.phoneNumber.value) {
    	helpers.alertUser('Missing Fields','All fields must be filled out!');
    	buttonOn();
    	return;
	}
	var userName = (($.email.value).replace(/@.*$/,"")).toLowerCase()+(Math.floor(Math.random() * 9000000)+1000000);
	var validatedNumber = validatePhoneNumber($.phoneNumber.value);
	/*if(!validatedNumber) {
		var c = Titanium.UI.createAlertDialog({
        	title : 'Invalid Phone Number'
    	});
    	helpers.alertUser('Invalid Phone Number','Please enter a valid phone number beginning with area code.');
    	buttonOn();
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
			helpers.alertUser('Phone Number Validation','Failed to send SMS text, please check your phone number and try again!');
			buttonOn();
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
						indicatorWindow.openIndicator();
					    AuthManager.userRegister($.firstName.value, $.lastName.value, $.email.value, userName, $.password.value, validatedNumber, function(err, registerResult){
							if(err) {
								buttonOn();
								helpers.alertUser('Register','Unable to register, please try again!');
								indicatorWindow.closeIndicator();
								return;
							} else {
								console.log("Successfully regsitered");
								importContacts();
								//var homeController = Alloy.createController('masterlayout').getView();
								//homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
							}
						});
					  /*} else {
					  	buttonOn();
					  	return;
					  }
				});
				results.modalResendButton.addEventListener('click', function() {
					randomNumber = Math.floor(Math.random() * 8999 + 1000);
					validateObject.verifyPhone = randomNumber;
					twilioManager.sendValidationMessage(validateObject, function(error, response){
						if(error) {
							console.log("Ping");
							helpers.alertUser('Phone Number Validation','Failed to send SMS text, please check your phone number and try again!');
							buttonOn();
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




/**
 * @method importContacts
 * Get access to user's contact list
 */
function importContacts() {
	if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED){
    	loadContacts();
	} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN){
	    Ti.Contacts.requestAuthorization(function(e){
	        if (e.success) {
	            loadContacts();
	        } else {
	        	indicatorWindow.closeIndicator();
	        	buttonOn();
	        	var homeController = Alloy.createController('masterlayout').getView();
				homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	        }
	    });
	} else {
		indicatorWindow.closeIndicator();
		buttonOn();
		var homeController = Alloy.createController('masterlayout').getView();
		homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	}
};


/**
 * @method loadContacts
 * Fetches the contacts from the users and uses the phone numbers to add friends on Selbi 
 */
function loadContacts() {
	var phoneArray = [];
	var people = Ti.Contacts.getAllPeople();
	if(people) {		
		for(var person in people) {
			var phone = people[person].phone.mobile && people[person].phone.mobile.length > 0 ? people[person].phone.mobile[0] : people[person].phone.work && people[person].phone.work.length > 0 ? people[person].phone.work[0] : people[person].phone.home && people[person].phone.home.length > 0 ? people[person].phone.home[0] : people[person].phone.other && people[person].phone.other.length > 0 ? people[person].phone.other[0] : "";
			var newPhone = phone.replace(/\D+/g, "");
			//if( validatedNumber != newPhone) {
				phoneArray.push(newPhone);
			//}
		}
		friendsManager.addFriendsByPhone(phoneArray,function(err, results){
			buttonOn();
			indicatorWindow.closeIndicator();
			var homeController = Alloy.createController('masterlayout').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		});	
	} else {
		indicatorWindow.closeIndicator();
		buttonOn();
		var homeController = Alloy.createController('masterlayout').getView();
		homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	}
}



/**
 * @method buttonOn
 * Makes buttons on view clickable
 */
function buttonOn() {
	$.registerButton.touchEnabled = true;
	$.closeRegister.touchEnabled = true;
}


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
