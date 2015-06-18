var httpClient = require('managers/httpmanager');

var userUpdate = exports.userUpdate = function(userUpdateObj, cb) {
	// Todo: validation on userUpdateObj
	
	/*httpClient.execute("/update/users", "PUT", userUpdateObj, function(err, userUpdateResult) {
		if(!err && userUpdateResult) {
			
		} else {
			if(cb) cb(err, null);
		}
	}); */
};