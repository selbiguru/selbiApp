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
			getCurrentUser(function (err, results){
				if (err){
					cb(new Error(err.message), null);
				} else {
					cb(null, results);
				}
			});
		}
	});

};
var count  = 0;
var getCurrentUser = exports.getCurrentUser = function(cb){
	console.warn("Fetching user information UserID: " + Ti.App.Properties.getString('userId'));
	
	httpManager.execute('/getUserData/' + Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, userObject){
		userObject = userObject[0];
		count++
		if(userObject) {
			console.log("!!!!!!!!!!!: ", count);
			var userModel = Alloy.Models.instance('user');
			userModel.set({username: userObject.username});
			userModel.set({firstName: userObject.firstName});
			userModel.set({lastName: userObject.lastName});
			userModel.set({email: userObject.email});
			userModel.set({id: userObject.id});
			userModel.set({profileImage: userObject.profileImage});
			if(userObject.userAddress){
					userModel.set({streetAddress: userObject.userAddress.streetAddress});
					userObject.userAddress.bldg ? userModel.set({bldg: userObject.userAddress.bldg}) : null;
					userModel.set({city: userObject.userAddress.city});
					userModel.set({state: userObject.userAddress.state});
					userModel.set({country: userObject.userAddress.country});
					userModel.set({zip: userObject.userAddress.zip});
					userObject.userAddress.streetAddress2 ? userModel.set({bldg: userObject.userAddress.streetAddress2}) : '';
			}
			userModel.save();		
			Alloy.Globals.currentUser = userModel;
		}	
		cb(err, Alloy.Globals.currentUser);
	});	
};
