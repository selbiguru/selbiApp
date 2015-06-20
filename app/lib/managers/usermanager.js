var httpClient = require('managers/httpmanager');

var userUpdate = exports.userUpdate = function(userUpdateObj, cb) {
	// Todo: validation on userUpdateObj
	
	
	/*httpClient.execute("/update/users", "PUT", userUpdateObj, function(err, userUpdateResult) {
		if(!err && userUpdateResult) {
			var userModel = Alloy.createModel('user');
			
			if(loginResult.user) {
				// Set user properties
				userModel.set({username: userUpdateResult.user.username});
				userModel.set({username: userUpdateResult.user.address});
				userModel.set({username: userUpdateResult.user.state});
				userModel.set({username: userUpdateResult.user.city});
				userModel.set({firstName: userUpdateResult.user.firstName});
				userModel.set({lastName: userUpdateResult.user.lastName});
				userModel.set({email: userUpdateResult.user.email});
				userModel.set({id: userUpdateResult.user.id});			
			}
		} else {
			if(cb) cb(err, null);
		}
	}); */
};