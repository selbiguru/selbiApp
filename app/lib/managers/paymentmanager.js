var httpManager = require('managers/httpmanager');

var getClientToken = exports.getClientToken = function(cb) {
	httpManager.execute('/payments/getClientToken', 'GET', null, true, function(err, responseToken){
		
		console.log('err for braintree token', err);
		console.log('response from braintree TOKEN!:', responseToken);
		cb(err, responseToken);
		/*var a = Titanium.UI.createAlertDialog({
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
			userUpdateResult = userUpdateResult[0];
			if(userUpdateResult) {
				var userModel = Alloy.Models.instance('user');
				userModel.set({username: userUpdateResult.username});
				userModel.set({firstName: userUpdateResult.firstName});
				userModel.set({lastName: userUpdateResult.lastName});
				userModel.set({email: userUpdateResult.email});
				userModel.set({id: userUpdateResult.id});
				userModel.set({profileImage: userUpdateResult.profileImage});
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
		}*/
	});
};