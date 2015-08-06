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
    		
    		httpManager.execute('/user/' + Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, userObject){
			if(userObject) {
				var userModel = Alloy.Models.instance('user');
				userModel.set({username: userObject.username});
				userModel.set({firstName: userObject.firstName});
				userModel.set({lastName: userObject.lastName});
				userModel.set({email: userObject.email});
				userModel.set({id: userObject.id});
				userModel.set({profileImage: userObject.profileImage});
				userModel.save();		
				Alloy.Globals.currentUser = userModel;
			}	
			cb(err, Alloy.Globals.currentUser);
	});		
		}
	});

};

exports.getCurrentUser = function(cb){	
	if(Alloy.Globals.currentUser) 
	{
		return cb(null, Alloy.Globals.currentUser);
	}	
	console.warn("Fetching user information");
	httpManager.execute('/user/' + Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, userObject){
		if(userObject) {
			var userModel = Alloy.Models.instance('user');
			userModel.set({username: userObject.username});
			userModel.set({firstName: userObject.firstName});
			userModel.set({lastName: userObject.lastName});
			userModel.set({email: userObject.email});
			userModel.set({id: userObject.id});
			userModel.set({profileImage: userObject.profileImage});
			userModel.save();		
			Alloy.Globals.currentUser = userModel;
		}	
		cb(err, Alloy.Globals.currentUser);
	});	
};
