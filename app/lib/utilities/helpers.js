/**
 * @author Jordan Burrows
 */

// textValidationArray is an array of all textFields that need string validation.
// This array can continue to be added to as we continue to require new string textFields.
// The string in the array correspond to the ID of the textField Element
// Example: <TextField id="firstName" hintText="First Name"></TextField> ...string would be "firstName".
var textValidationArray = ["username","firstName","lastName", "city", "state","email","streetAddress"];



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
	var emptyFields = {};
	var textValidation = {};
	for (var i in textFieldObject){
		if (!textFieldObject[i].length || !textFieldObject[i].trim().length) {
			emptyFields[i] = textFieldObject[i].trim();
		}
		if (textValidationArray.indexOf(i) != -1) {
			textValidation[i] = textFieldObject[i].trim();
		}
	}
	if (Object.keys(emptyFields).length != 0) {
		return emptyFields;
	} else if (Object.keys(textValidation).length != 0) {
		textValidation = validateStrings(textValidation);
		return textValidation;
	} else {
		return true;
	}
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
	return true;
};
