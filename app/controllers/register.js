var AuthManager = require('managers/authmanager'),
	modalManager = require('managers/modalmanager'),
	friendsManager = require('managers/friendsmanager'),
	twilioManager = require('managers/twiliomanager'),
	helpers = require('utilities/helpers'),
	utils = require('utilities/validate'),
	indicator = require('uielements/indicatorwindow'),
	args = arguments[0] || {};
var html2as = require('nl.fokkezb.html2as');
var prevNumber = '';
var indicatorWindow;
var validatedNumber = '';


function registerUser(){
	indicatorWindow = indicator.createIndicatorWindow({
		message : "Validating Phone"
	});
	buttonOff();
	if (!$.firstName.value || !$.lastName.value || !$.email.value || !$.password.value || !$.phoneNumber.value) {
    	helpers.alertUser('Missing Fields','All fields must be filled out');
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
		validatedNumber = validatePhoneNumber($.phoneNumber.value);
	var validatedPassword = $.password.value;
	if(!validateFirstName || !validateLastName ) {
		helpers.alertUser('Invalid Name','Please enter a valid first and last name');
		buttonOn();
		return;
	} else if(validatedEmail.email.message) {
		helpers.alertUser('Invalid Email', validatedEmail.email.message);
		buttonOn();
		return;
	} else if(!validatedNumber || validatedNumber.length != 10) {
    	helpers.alertUser('Invalid Phone Number','Please enter a valid 10 digit phone number beginning with area code');
    	buttonOn();
		return;
	} else if(validatedPassword.length < 8) {
		helpers.alertUser('Password','Your password must be at least 8 characters long');
    	buttonOn();
		return;
	}
	var userName = (helpers.trim(validateFirstName[0].concat(validateLastName[0]), true).replace(/\W+/g, '').toLowerCase()).slice(0,20);
	var codeNumbers =[];
	var randomNumber = Math.floor(Math.random() * 8999 + 1000);
	var validateObject = {
		phoneNumber: parseFloat(validatedNumber),
		verifyPhone: randomNumber,
		email: validatedEmail.email
	};
	indicatorWindow.openIndicator();
	twilioManager.sendValidationMessage(validateObject, function(error, response){
		indicatorWindow.closeIndicator();
		buttonOn();
		if(error) {
			helpers.alertUser('Register', error);
			return;
		} else {
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
						results.modalErrorLabel.visible = false;
						results.modalErrorLabel.height = '0dp';
						var animateWindowClose = Titanium.UI.create2DMatrix();
					    animateWindowClose = animateWindowClose.scale(0);	
					    results.modalWindow.close({transform:animateWindowClose, duration:300});
					    indicatorWindow = indicator.createIndicatorWindow({
							message : "Registering"
						});
						buttonOff();
						indicatorWindow.openIndicator();
					    AuthManager.userRegister(validateFirstName[0], validateLastName, validatedEmail.email, userName, validatedPassword, parseFloat(validatedNumber), function(err, registerResult){
							if(err) {
								buttonOn();
								helpers.alertUser('Register', 'Unable to register, please try again.  If the problem persists, contact us at Support@selbi.io');
								indicatorWindow.closeIndicator();
								return;
							} else {
								importContacts();
								removeEventListeners();	
							}
						});
					  } else {
					  	results.modalErrorLabel.visible = true;
						results.modalErrorLabel.height = Ti.UI.SIZE;
					  	buttonOn();
					  	return;
					  }
				});
				results.modalResendButton.addEventListener('click', function() {
					results.modalErrorLabel.visible = false;
					results.modalErrorLabel.height = '0dp';
					randomNumber = Math.floor(Math.random() * 8999 + 1000);
					validateObject.verifyPhone = randomNumber;
					twilioManager.sendValidationMessage(validateObject, function(error, response){
						if(error) {
							helpers.alertUser('Register', error);
							buttonOn();
							return;
						} else {
							return;
						}
					});
				});
			});
		}
	});
}

function closeRegisterWindow(){
	$.destroy();
	$.off();
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
	        	indicatorWindow.closeIndicator();
	        	buttonOn();
				Alloy.createController('masterlayout').getView().open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
				modalManager.getWelcomeModal(function(err, results){
					var animateWindowClose = Titanium.UI.create2DMatrix();
						animateWindowClose = animateWindowClose.scale(0);
					results.modalWindow.close({transform:animateWindowClose, duration:300});
					results.modalWelcomeButton.addEventListener('click', function(e) {
						results.modalWindow.close({transform:animateWindowClose, duration:300});
					});
					animateWindowClose = null;
				});
	        }
	    });
	} else {
		indicatorWindow.closeIndicator();
		buttonOn();
		Alloy.createController('masterlayout').getView().open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		modalManager.getWelcomeModal(function(err, results){
			var animateWindowClose = Titanium.UI.create2DMatrix();
				animateWindowClose = animateWindowClose.scale(0);
			results.modalWindow.close({transform:animateWindowClose, duration:300});
			results.modalWelcomeButton.addEventListener('click', function(e) {
				results.modalWindow.close({transform:animateWindowClose, duration:300});
			});
			animateWindowClose = null;
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
			var contactName = people[person] ? people[person].firstName +''+ people[person].lastName : "";
			if( newPhone.toString().length >= 10 && newPhone.toString().length <= 11) {
				if (newPhone.toString().length == 11 && newPhone.toString()[0] == '1') {
					newPhone = newPhone.slice(1);
				}
				if((parseFloat(validatedNumber) != parseFloat(newPhone)) && contactName.length > 0) {
					phoneArray.push(newPhone);
				}
			}
		}
		friendsManager.addFriendsByPhone(phoneArray,function(err, results){
			buttonOn();
			indicatorWindow.closeIndicator();
			Alloy.createController('masterlayout').getView().open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
			modalManager.getWelcomeModal(function(err, results){
				var animateWindowClose = Titanium.UI.create2DMatrix();
					animateWindowClose = animateWindowClose.scale(0);
				results.modalWindow.close({transform:animateWindowClose, duration:300});
				results.modalWelcomeButton.addEventListener('click', function(e) {
					results.modalWindow.close({transform:animateWindowClose, duration:300});
				});
				animateWindowClose = null;
			});
		});	
	} else {
		indicatorWindow.closeIndicator();
		buttonOn();
		Alloy.createController('masterlayout').getView().open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		modalManager.getWelcomeModal(function(err, results){
			var animateWindowClose = Titanium.UI.create2DMatrix();
				animateWindowClose = animateWindowClose.scale(0);
			results.modalWindow.close({transform:animateWindowClose, duration:300});
			results.modalWelcomeButton.addEventListener('click', function(e) {
				results.modalWindow.close({transform:animateWindowClose, duration:300});
			});
			animateWindowClose = null;
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
 * @method buttonOff
 * Makes buttons on view unclickable
 */
function buttonOff() {
	$.registerButton.touchEnabled = false;
	$.closeRegister.touchEnabled = false;
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
 * Blurs textfields in accordance with expected UI on register.js View
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


/**
 * @method keyboardNext 
 * On keyboard 'Next' button pressed moves user to the next text field to fill out
 */
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


/**
 * @method keyboardRegister 
 * On keyboard 'Go' button pressed phoneNumber is blurred and registerUser function is called
 */
function keyboardRegister() {
	$.phoneNumber.blur();
	registerUser();
};


/**
 * @private removeEventListeners 
 * Removes event listeners from the controller
 */
function removeEventListeners() {
	$.phoneNumber.removeEventListener('change', phoneNumberChange);
	$.registerView.removeEventListener('click', blurTextField);
	$.firstName.removeEventListener('return', keyboardNext);
	$.lastName.removeEventListener('return', keyboardNext);
	$.email.removeEventListener('return', keyboardNext);
	$.password.removeEventListener('return', keyboardNext);
	$.phoneNumber.removeEventListener('return', keyboardRegister);
	$.terms.removeEventListener('link', privacyTerms);
};


/**
 * @private privacyTerms 
 * opens safari with correct url (terms/privacy)
 */
function privacyTerms(e) {
	if (e.url === 'privacy') {
    	//open link in safari - application will close
		Titanium.Platform.openURL('http://www.selbi.io/privacy');
   	} else if(e.url === 'terms') {
   		//open link in safari - application will close
		Titanium.Platform.openURL('http://www.selbi.io/terms-and-conditions');
   	}
}



/*************************************************Dynamic Elements***********************************************************/

html2as(
    "By signing up, you are agreeing to Selbi's <a style='text-decoration:none;' href='privacy'>Privacy Policy</a> and <a style='color:#9B9B9B;'href='terms'>Terms & Conditions</a>",
    function(err, as) {
        if (err) {
            console.error(err);
        } else {
           $.terms.attributedString = as;
           $.terms.addEventListener('link', privacyTerms);
        }
    }
);


/*************************************************Event Listeners***********************************************************/

$.phoneNumber.addEventListener('change', phoneNumberChange);
$.registerView.addEventListener('click', blurTextField);
$.firstName.addEventListener('return', keyboardNext);
$.lastName.addEventListener('return', keyboardNext);
$.email.addEventListener('return', keyboardNext);
$.password.addEventListener('return', keyboardNext);
$.phoneNumber.addEventListener('return', keyboardRegister);

Alloy.Globals.addKeyboardToolbar($.firstName, blurTextField);
Alloy.Globals.addKeyboardToolbar($.lastName, blurTextField);
Alloy.Globals.addKeyboardToolbar($.email, blurTextField);
Alloy.Globals.addKeyboardToolbar($.password, blurTextField);
Alloy.Globals.addKeyboardToolbar($.phoneNumber, blurTextField);
