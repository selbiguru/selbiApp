var httpManager = require('managers/httpmanager');

var userUpdate = exports.userUpdate = function(userUpdateObj, cb) {
	// Todo: validation on userUpdateObj
	httpManager.execute('/UserData/' + userUpdateObj.id, 'PUT', userUpdateObj, true, function(err, userUpdateResult){
		if(err) {
			cb(err, null);
		} else {
			if(userUpdateResult) {
				var userModel = Alloy.Models.instance('user');
				userModel.set({username: userUpdateResult.username});
				userModel.set({firstName: userUpdateResult.firstName});
				userModel.set({lastName: userUpdateResult.lastName});
				userModel.set({email: userUpdateResult.email});
				userModel.set({id: userUpdateResult.id});
				userModel.set({phoneNumber: userUpdateResult.phoneNumber});
				userModel.set({profileImage: userUpdateResult.profileImage});
				userModel.set({dateOfBirth: userUpdateResult.dateOfBirth || null});
				if(userUpdateResult.userAddress){
						userModel.set({address: userUpdateResult.userAddress.address});
						userUpdateResult.userAddress.address2 ? userModel.set({address2: userUpdateResult.userAddress.address2}) : userModel.set({address2: ''});
						userModel.set({city: userUpdateResult.userAddress.city});
						userModel.set({state: userUpdateResult.userAddress.state});
						userModel.set({country: userUpdateResult.userAddress.country});
						userModel.set({zip: userUpdateResult.userAddress.zip});
				}
				userModel.save();
				Alloy.Globals.currentUser = userModel;
			}	
			cb(err, Alloy.Globals.currentUser);
		}
	});

};

var getCurrentUser = exports.getCurrentUser = function(cb){
	console.warn("Fetching user information UserID: " + Ti.App.Properties.getString('userId'));
	
	httpManager.execute('/UserData/' + Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, userObject){
		if(err) {
			cb(err, null);
		} else {
			var userModel = Alloy.Models.instance('user');
			userModel.set({username: userObject.username});
			userModel.set({firstName: userObject.firstName});
			userModel.set({lastName: userObject.lastName});
			userModel.set({email: userObject.email});
			userModel.set({id: userObject.id});
			userModel.set({phoneNumber: userObject.phoneNumber});
			userModel.set({profileImage: userObject.profileImage});
			userModel.set({dateOfBirth: userObject.dateOfBirth || null});
			if(userObject.userAddress){
					userModel.set({address: userObject.userAddress.address});
					userObject.userAddress.address2 ? userModel.set({address2: userObject.userAddress.address2}) : userModel.set({address2: ''});
					userModel.set({city: userObject.userAddress.city});
					userModel.set({state: userObject.userAddress.state});
					userModel.set({country: userObject.userAddress.country});
					userModel.set({zip: userObject.userAddress.zip});
			}
			userModel.save();		
			Alloy.Globals.currentUser = userModel;
			cb(err, Alloy.Globals.currentUser);
		}	
	});	
};




var isUnique = exports.isUnique = function(uniqueObject, cb){
	httpManager.execute('/userData/uniqueUsername', 'POST', uniqueObject, true, function(err, uniqueResult){
		if(err) {
			cb(err, null);
		} else {
			cb(err, uniqueResult);
		}
	});
};