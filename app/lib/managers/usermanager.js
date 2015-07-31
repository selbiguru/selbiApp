var httpManager = require('managers/httpmanager');

var userUpdate = exports.userUpdate = function(userUpdateObj, cb) {
	// Todo: validation on userUpdateObj

	httpManager.execute('/user/' + userUpdateObj.id, 'PUT', userUpdateObj, true, function(err, userUpdateResult){
		var a = Titanium.UI.createAlertDialog({
        	title : 'Update User'
    	});

		if(err) {
	    	a.setMessage("Failed to update user, please try again later!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
				a.setMessage("User profile saved!");
	    		a.show();
				if(cb) 	cb(null, userUpdateResult);
		}
	});

};