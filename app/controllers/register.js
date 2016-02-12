var AuthManager = require('managers/authmanager'),
	modalManager = require('managers/modalmanager'),
	friendsManager = require('managers/friendsmanager'),
	twilioManager = require('managers/twiliomanager'),
	helpers = require('utilities/helpers'),
	utils = require('utilities/validate'),
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
	var validateEmailObj = {
   		email: [(helpers.trim($.email.value, true)).toLowerCase(), {required: true,
   		email: true, label:'Email field'}]
	};
	var validateFirstName = (helpers.capFirstLetter(helpers.trim($.firstName.value, false))).match(/^[a-z ,.'-]+$/i);
	var validateLastName = (helpers.capFirstLetter(helpers.trim($.lastName.value, false))).match(/^[a-z ,.'-]+$/i);
	var validatedEmail = utils.validate(validateEmailObj);
	var validatedNumber = validatePhoneNumber($.phoneNumber.value);
	var validatedPassword = $.password.value;
	if(!validateFirstName || !validateLastName ) {
		helpers.alertUser('Invalid Name','Please enter a valid first and last name.');
		buttonOn();
		return;
	} else if(validatedEmail.email.message) {
		helpers.alertUser('Invalid Email', validatedEmail.email.message);
		buttonOn();
		return;
	} else if(!validatedNumber || validatedNumber.length != 10) {
    	helpers.alertUser('Invalid Phone Number','Please enter a valid 10 digit phone number beginning with area code.');
    	buttonOn();
		return;
	} else if(validatedPassword.length < 8) {
		helpers.alertUser('Password','Your password must be at least 8 characters long.');
    	buttonOn();
		return;
	}
	var userName = (helpers.trim(validateFirstName[0].concat(validateLastName[0]), true).replace(/\W+/g, '').toLowerCase()+(Math.floor(Math.random() * 9000000)+1000000)).slice(0,20);
	/*var codeNumbers =[];
	var randomNumber = Math.floor(Math.random() * 8999 + 1000);
	var validateObject = {
		phoneNumber: validatedNumber,
		verifyPhone: randomNumber
	};
	twilioManager.sendValidationMessage(validateObject, function(error, response){
		if(error) {
			console.log("TWILIO ERROR");
			helpers.alertUser('Phone Number Validation','Failed to send SMS text, please check your phone number and try again!');
			buttonOn();
			return;
		} else {
			console.log("TWILIO SUCCESS");
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
					    AuthManager.userRegister(validateFirstName[0], validateLastName, validatedEmail.email, userName, validatedPassword, validatedNumber, function(err, registerResult){
							if(err) {
								buttonOn();
								helpers.alertUser('Register', err);
								indicatorWindow.closeIndicator();
								return;
							} else {
								console.log("Successfully registered");
								importContacts();
								removeEventListeners();
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
	removeEventListeners();
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
	        	console.log('010101010101');
	        	indicatorWindow.closeIndicator();
	        	buttonOn();
	        	var homeController = Alloy.createController('masterlayout').getView();
				homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
				modalManager.getWelcomeModal(function(err, results){
					var animateWindowClose = Titanium.UI.create2DMatrix();
						animateWindowClose = animateWindowClose.scale(0);
					results.modalWindow.close({transform:animateWindowClose, duration:300});
					results.modalWelcomeButton.addEventListener('click', function(e) {
						results.modalWindow.close({transform:animateWindowClose, duration:300});
					});
				});
	        }
	    });
	} else {
		console.log('02020202020202');
		indicatorWindow.closeIndicator();
		buttonOn();
		var homeController = Alloy.createController('masterlayout').getView();
		homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		modalManager.getWelcomeModal(function(err, results){
			var animateWindowClose = Titanium.UI.create2DMatrix();
				animateWindowClose = animateWindowClose.scale(0);
			results.modalWindow.close({transform:animateWindowClose, duration:300});
			results.modalWelcomeButton.addEventListener('click', function(e) {
				results.modalWindow.close({transform:animateWindowClose, duration:300});
			});
		});
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
			console.log('0505050505');
			buttonOn();
			indicatorWindow.closeIndicator();
			var homeController = Alloy.createController('masterlayout').getView();
			homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
			modalManager.getWelcomeModal(function(err, results){
				var animateWindowClose = Titanium.UI.create2DMatrix();
					animateWindowClose = animateWindowClose.scale(0);
				results.modalWindow.close({transform:animateWindowClose, duration:300});
				results.modalWelcomeButton.addEventListener('click', function(e) {
					results.modalWindow.close({transform:animateWindowClose, duration:300});
				});
			});
		});	
	} else {
		console.log('0404040404');
		indicatorWindow.closeIndicator();
		buttonOn();
		var homeController = Alloy.createController('masterlayout').getView();
		homeController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		modalManager.getWelcomeModal(function(err, results){
			var animateWindowClose = Titanium.UI.create2DMatrix();
				animateWindowClose = animateWindowClose.scale(0);
			results.modalWindow.close({transform:animateWindowClose, duration:300});
			results.modalWelcomeButton.addEventListener('click', function(e) {
				results.modalWindow.close({transform:animateWindowClose, duration:300});
			});
		});
	}
}



/**
 * @method buttonOn
 * Makes buttons on view clickable
 */
function buttonOn() {
	$.registerButton.touchEnabled = true;
	$.closeRegister.touchEnabled = true;
};


/**
 * @method phoneNumberChange
 * On change event, phone number layout updates
 */
function phoneNumberChange() {
	if(prevNumber.length <= this.value.length) {
		if((validatePhoneNumber(this.value).length === 4 || validatePhoneNumber(this.value).length === 7) && prevNumber.slice(-1) !== '-') {
			this.value = (this.value).substring(0,this.value.length - 1) +'-'+(this.value).substring(this.value.length - 1);
		} else {
			this.value = this.value;
		} 	
	}
	prevNumber = this.value;
}


/**
 * @private blurTextField 
 * Blurs usernameSearch text field in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'firstName') {
		$.firstName.focus();
	} else if(e.source.id === 'lastName') {
		$.lastName.focus();
	} else if(e.source.id === 'email') {
		$.email.focus();
	} else if(e.source.id === 'password') {
		$.password.focus();
	} else if(e.source.id === 'phoneNumber') {
		$.phoneNumber.focus();
	} else {
		$.firstName.blur();
		$.lastName.blur();
		$.email.blur();
		$.password.blur();
		$.phoneNumber.blur();
	}
};



function keyboardNext(e) {
	if(e.source.id === 'firstName') {
		e.source.blur();
		$.lastName.focus();
	} else if(e.source.id === 'lastName') {
		e.source.blur();
		$.email.focus();
	} else if(e.source.id === 'email') {
		e.source.blur();
		$.password.focus();
	} else {
		e.source.blur();
		$.phoneNumber.focus();
	}
};


function keyboardRegister() {
	$.phoneNumber.blur();
	registerUser();
};


function removeEventListeners() {
	$.phoneNumber.removeEventListener('change', phoneNumberChange);
	$.registerView.removeEventListener('click', blurTextField);
	$.firstName.removeEventListener('return', keyboardNext);
	$.lastName.removeEventListener('return', keyboardNext);
	$.email.removeEventListener('return', keyboardNext);
	$.password.removeEventListener('return', keyboardNext);
	$.phoneNumber.removeEventListener('return', keyboardRegister);
};

/*************************************************Event Listeners***********************************************************/

$.phoneNumber.addEventListener('change', phoneNumberChange);
$.registerView.addEventListener('click', blurTextField);
$.firstName.addEventListener('return', keyboardNext);
$.lastName.addEventListener('return', keyboardNext);
$.email.addEventListener('return', keyboardNext);
$.password.addEventListener('return', keyboardNext);
$.phoneNumber.addEventListener('return', keyboardRegister);