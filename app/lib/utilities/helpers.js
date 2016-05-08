/**
 * @author Jordan Burrows
 */

// textValidationArray is an array of all textFields that need string validation.
// This array can continue to be added to as we continue to require new string textFields.
// The string in the array correspond to the ID of the textField Element
// Example: <TextField id="firstName" hintText="First Name"></TextField> ...string would be "firstName".
var textValidationArray = ["username","firstName","lastName", "city", "state","email","streetAddress"];


// numberValidationArray is an array of all textFields that need number validation.
// This array can continue to be added to as we continue to require new number textFields.
// The string in the array correspond to the ID of the textField Element
// Example: <TextField id="zipCode" hintText="Zip Code"></TextField> ...string would be "zipCode".
var numberValidationArray = ["zipCode"];


// validateFields function validates textFields and returns either true or an object of the errors with xml corresponding ID.
// this function also validates strings within the textFields. 
// params @textFieldObject - object containing user input textFields that need to be validated.
// Example: var textFieldObject = {
//		"username": $.username.value,
//		"firstName": $.firstName.value,
//		"lastName": $.lastName.value,
//		"streetAddress": $.streetAddress.value,
//		"city": $.city.value, 
//		"state": $.state.value
//		};
// In "username": $.username.value, "username" is a string of the ID of the textField...
// For <TextField id="username" hintText="Username"></TextField> ...key would be "username" and value would be $.username.value.
//
// Object Returned :
// emptyFields {
//      city = "";
//      state = "";
//      username = "";
//   } 
// OR
// errorStringObj {
//       city = "wd/m";
//       state = "iowa<";
//		 username = "/jam"
//   }
var validateFields = exports.validateFields = function validateFields(textFieldObject) {
	var emptyFields = {},
	textValidation = {},
	zipCodeValidation = {};
	for (var i in textFieldObject){
		if (!textFieldObject[i].trim().length) {
			emptyFields[i] = textFieldObject[i].trim();
		}
		if (textValidationArray.indexOf(i) != -1) {
			textValidation[i] = textFieldObject[i].trim();
		}
		if (numberValidationArray.indexOf(i) != -1) {
			zipCodeValidation[i] = textFieldObject[i].trim();
		}
	}
	if (Object.keys(emptyFields).length != 0) {
		return emptyFields;
	}
	if (Object.keys(textValidation).length != 0) {
		textValidation = validateStrings(textValidation);
	}
	if (Object.keys(zipCodeValidation).length != 0) {
		zipCodeValidation = validateZipCode(zipCodeValidation);
	}
	if (Object.keys(zipCodeValidation).length != 0 || Object.keys(textValidation).length != 0) {
		for (var i in zipCodeValidation) {
			textValidation[i] = zipCodeValidation[i];
		}
		return textValidation;
	}
	return true;
};

// validateStrings function validates textField Strings and returns either true or an object of errors with xml corresponding ID.
// params @textFieldStringObject - object containing user input textFields that need to be validated.
// Example: textFieldStringObject:  {
//       city = "wd/m";
//       firstName = jordan;
//       lastName = burrows;
//       state = "iowa<";
//       streetAddress = 293857j;
//       username = jam;
//   }
//
// The object key is the ID of the textField...
// For <TextField id="username" hintText="Username"></TextField> ...key would be "username".
//
// Object Returned :
// errorStringObj {
//       city = "wd/m";
//       state = "iowa<";
//		 username = "/jam"
//   }
var validateStrings = exports.validateStrings = function validateStrings(textFieldStringObject) {
	var errorStringObj = {};
	var validRegEx = /^[^\\\/&<>]*$/;
	for (var i in textFieldStringObject) {
			var testRegEx = validRegEx.test(textFieldStringObject[i]);
			if (!testRegEx) {
				errorStringObj[i] = textFieldStringObject[i];;
			}
	}
	if (Object.keys(errorStringObj).length != 0) {
		return errorStringObj;
	}
	return errorStringObj;
};






// validateNumbers function validates textField Numbers and returns either true or an object of errors with xml corresponding ID.
// params @textFieldNumbersObject - object containing user input textFields that need to be validated.
// Example: textFieldNumbersObject:  {
//       zipCode = "89043";
//   }
//
// The object key is the ID of the textField...
// For <TextField id="numbers" hintText="Numbers"></TextField> ...key would be "numbers".
//
// Object Returned :
// errorNumbersObj {
//       numbers = "54-/:49"
//   }
var validateNumbers = exports.validateNumbers = function validateNumbers(textFieldNumbersObject) {
	var errorNumbersObj = {};
	var validRegEx = /^\d*$/;
	for (var i in textFieldNumbersObject) {
			var testRegEx = validRegEx.test(textFieldNumbersObject[i]);
			if (!testRegEx) {
				errorNumbersObj[i] = textFieldNumbersObject[i];;
			}
	}
	if (Object.keys(errorNumbersObj).length != 0) {
		return errorNumbersObj;
	}
	return errorNumbersObj;
};





// zipCodeValidation function validates textField zipCode and returns either true or an object of errors with xml corresponding ID.
// params @textFieldZipCodeObject - object containing user input textFields that need to be validated.
// Example: textFieldZipCodeObject:  {
//       zipCode = "89043";
//   }
//
// The object key is the ID of the textField...
// For <TextField id="zipCode" hintText="Zip Code"></TextField> ...key would be "zipCode".
//
// Object Returned :
// errorZipCodeObj {
//       zipCode = "54-/:49"
//   }
var validateZipCode = exports.validateZipCode = function zipCodeValidation(textFieldZipCodeObject) {
	var errorZipCodeObj = {};
	var validRegEx = /^\d{5}(?:[-]\d{4})?$/;
	for (var i in textFieldZipCodeObject) {
			var testRegEx = validRegEx.test(textFieldZipCodeObject[i]);
			if (!testRegEx) {
				errorZipCodeObj[i] = textFieldZipCodeObject[i];;
			}
	}
	if (Object.keys(errorZipCodeObj).length != 0) {
		return errorZipCodeObj;
	}
	return errorZipCodeObj;
};


/**
 * @method alterTextFormat
 * Alters text to limit the number of characters shown.  Additional characters shown as '..'
 * @param {String} text Text you want altered
 * @param {Number} length Maximum length of word to be followed by '..' to show word continues
 * @param {Boolean} toUpperCase True or false if you want all letters in the word to be Uppercase
 */
exports.alterTextFormat = function(text, length, toUpperCase){
	var trimmedTitle = text.trim();
	if(trimmedTitle.length > length) {
		trimmedTitle = trimmedTitle.slice(0, length) + '..';	
	}
	return toUpperCase ? this.capFirstLetter(trimmedTitle) : trimmedTitle;
};

//trims string by removing spaces
//pass true to remove all spaces or
//pass false to remove only begining and ending spaces
exports.trim = function(str, boolean) {
	if (boolean) {
		return str.replace(/\s/g,"");
	} else {
		return str.replace(/^\s+|\s+$/g,"");	
	}
};


/**
 * @method capFirstLetter
 * Capitalizes the first letter of a word
 * @param {String} word Word you want capitalized
 */
exports.capFirstLetter = function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
};



/**
 * @method alertUser
 * Sends an alert to the user's phone
 * @param {String} alertTitle Title you want in the alert shown to the user
 * @param {String} alertMessage Message you want in the alert shown to the user
 */
exports.alertUser = function(alertTitle, alertMessage) {
	var userMessage = alertMessage;
	if(alertMessage[0] === '"' && alertMessage[alertMessage.length-1] === '"') {
		userMessage = userMessage.slice(1, -1);
	}
    var a = Titanium.UI.createAlertDialog({
        	title : alertTitle
    });
	a.setMessage(userMessage);
	a.addEventListener('click',function(){a.hide();a=null;});
	a.show();
	return;
};




/**
 * @method confirmAction
 * Sends an alert to the user's phone
 * @param {String} alertTitle Title you want in the alert shown to the user
 * @param {String} alertMessage Message you want in the alert shown to the user
 * @param {Function} callback
 */
exports.confirmAction = function(alertTitle, alertMessage, callback) {
	var userMessage = alertMessage;
	if(alertMessage[0] === '"' && alertMessage[alertMessage.length-1] === '"') {
		userMessage = userMessage.slice(1, -1);
	}
    var a = Titanium.UI.createAlertDialog({
        	title : alertTitle,
        	cancel: 1,
    		buttonNames: ['Cancel', 'Confirm'],
    });
	a.setMessage(userMessage);
	callback(null, a);
	return;
};



