/**
 * @class AuthManager
 * AuthManager class to manage user auth related operations
 */
var httpClient = require('managers/httpmanager');
var keychain = require('com.obscure.keychain');
var keychainItem = keychain.createKeychainItem('serveraccount');

/**
 * @method Login
 * Login the user if correct credentials are procided
 * Store the token value for oAuth in the keychain
 * @param {String} username Username can be email or username
 * @param {String} password	Password entered at the time of registration
 * @param {Function} cb callback function
 */
var login = exports.login = function (username, password, cb){
	// Todo: validation
	
	
	// Prepare request
	var loginRequest = {
		"identifier": username,
		"password": password
	};
	
	// Execute Request
	httpClient.execute("/login", "POST", loginRequest, false, function(err, loginResult){
		if(!err && loginResult) {
			// Create a singleton
			var authModel = Alloy.Models.instance('auth');
			var userModel = Alloy.Models.instance('user');
			
			if(loginResult.user) {
				// Set user properties
				userModel.set({username: loginResult.user.username});
				userModel.set({firstName: loginResult.user.firstName});
				userModel.set({lastName: loginResult.user.lastName});
				userModel.set({email: loginResult.user.email});
				userModel.set({profileImage: loginResult.user.profileImage});
				userModel.set({createdAt: loginResult.user.createdAt});
				userModel.set({id: loginResult.user.id});
				userModel.save();		
				Alloy.Globals.currentUser = loginResult.userModel;	
			}
			
			authModel.set({ token: loginResult.token });
			authModel.set({ username: username });
			authModel.set({ password: password });
			authModel.set({ user : JSON.stringify(userModel)});
			authModel.set({ isAuth: true });
			authModel.save();
			
			keychainItem.account = "token";
			keychainItem.valueData = loginResult.token;
			
			Ti.App.Properties.setString('userId', loginResult.user.id);
			Ti.App.Properties.setString('isAuth', true);
			
			cb(null, authModel);
		} else {
			cb(err, null);
		}		
	}); 
};

/**
 * @method UserRegister
 * Register a user with a given set of values.
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email
 * @param {String} username
 * @param {String} password
 * @param {String} phoneNumber
 * @param {Object} cb
 */
var userRegister = exports.userRegister = function(firstName, lastName, email, username, password, phoneNumber, cb) {
	// Todo: validation
	
	
	// Prepare request
	var registerRequest = {
		"username": username,
		"email": email,
		"password": password,
		"firstName": firstName,
		"lastName": lastName,
		"phoneNumber": phoneNumber,
		"userAgreementAccepted": true
	};
	httpClient.execute("/register", "POST", registerRequest, true, function(err, registerResults) {
		if(!err && registerResults) {
			login(email, password, cb);
		} else {
			cb(err, null);
		}
	}); 
};

/**
 * @method IsLoggedIn
 * Check whether the user is logged in
 */
var isLoggedIn = exports.isLoggedIn = function() {
	return Ti.App.Properties.getString('isAuth') ? Ti.App.Properties.getString('isAuth') : false;
};

/**
 * @method GetToken
 * Get the oAuth token for the logged in user
 * NOTE: this is stored in keychain
 */
var getToken = exports.getToken = function() {
	return keychainItem.valueData;
};

/**
 * @method Logout
 * Logs the user out of the app clearing any stored credentials/keys
 * @param {Function} cb
 */
var logout = exports.logout = function(cb){
	httpClient.execute("/logout", "POST", null, true, function(err, logoutResult){
		Ti.API.info("Logout Result", logoutResult);
		if(logoutResult) {
			Ti.App.Properties.removeProperty('token');
			Ti.App.Properties.removeProperty('userId');
			Ti.App.Properties.setString('isAuth', false);
			keychainItem.reset();
		}
		cb(err, logoutResult);
	});
};
