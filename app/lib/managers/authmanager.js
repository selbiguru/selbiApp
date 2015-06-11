var httpClient = require('managers/httpmanager');

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
			var userModel = Alloy.createModel('user');
			
			if(loginResult.user) {
				// Set user properties
				userModel.set({username: loginResult.user.username});
				userModel.set({password: password });
				userModel.set({firstName: loginResult.user.firstName});
				userModel.set({lastName: loginResult.user.lastName});
				userModel.set({email: loginResult.user.email});
				userModel.set({id: loginResult.user.id});			
			}
			
			authModel.set({ token: loginResult.token });
			authModel.set({ username: username });
			authModel.set({ password: password });
			authModel.set({ user : JSON.stringify(userModel)});
			authModel.set({ isAuth: true });
			authModel.save();
			
			Ti.App.Properties.setString('token', loginResult.token);
			Ti.App.Properties.setString('userId', loginResult.user.id);
			Ti.App.Properties.setString('isAuth', true);
			
			if(cb) cb(null, authModel);
			
		} else {
			if(cb) cb(err, null);
		}		
	}); 
};

exports.userRegister = function(firstName, lastName, email, password, cb) {
	// Todo: validation
	
		
	// Prepare request
	var registerRequest = {
		"username": email,
		"email": email,
		"password": password,
		"firstName": firstName,
		"lastName": lastName
		
	};
	
	httpClient.execute("/register", "POST", registerRequest, false, function(err, registerResults) {
		if(!err && registerResults) {
			login(email, password, cb);
		} else {
			if(cb) cb(err, null);
		}
	}); 
};

exports.isLoggedIn = function() {
	return Ti.App.Properties.getString('isAuth') ? Ti.App.Properties.getString('isAuth') : false;
};

exports.getToken = function() {
	return Ti.App.Properties.getString('token') ? Ti.App.Properties.getString('token'): "";
};

exports.logout = function(cb){
	httpClient.execute("/logout", "POST", null, true, function(err, logoutResult){
		Ti.API.info("Logout Result", logoutResult);
		if(logoutResult) {
			Ti.App.Properties.removeProperty('token');
			Ti.App.Properties.removeProperty('userId');
			Ti.App.Properties.setString('isAuth', false);
			
		}
		cb(err, logoutResult);
	});
};
