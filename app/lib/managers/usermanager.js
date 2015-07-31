var httpManager = require('managers/httpmanager');

var userUpdate = exports.userUpdate = function(userUpdateObj, cb) {
	// Todo: validation on userUpdateObj

	httpManager.execute('/user/' + userUpdateObj.id, 'PUT', userUpdateObj, true, function(err, userUpdateResult){
	if(err) {
		var a = Titanium.UI.createAlertDialog({
        title : 'Update User'
    	});
    	a.setMessage("Failed to update user, please try again later!");
    	a.show();
		if(cb) cb(new Error(err.message), null);
		} 
		else {
			if(cb) cb(null, userUpdateResult);
		}
	});

};