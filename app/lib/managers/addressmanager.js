var httpManager = require('managers/httpmanager');
var helpers = require('utilities/helpers');


var addAddress = exports.addAddress = function(addressUpdateObj, cb) {
	httpManager.execute('/address/' + addressUpdateObj.id, 'POST', addressUpdateObj, true, function(err, addressUpdateResult){		
		if(err) {
			cb(err, null);
		} else {
			if(addressUpdateResult) {
				var userModel = Alloy.Models.instance('user');
				userModel.set({username: addressUpdateResult.username});
				userModel.set({firstName: helpers.capFirstLetter(addressUpdateResult.firstName)});
				userModel.set({lastName: helpers.capFirstLetter(addressUpdateResult.lastName)});
				userModel.set({email: addressUpdateResult.email});
				userModel.set({id: addressUpdateResult.id});
				userModel.set({phoneNumber: addressUpdateResult.phoneNumber});
				userModel.set({profileImage: addressUpdateResult.profileImage});
				userModel.set({fraudAlert: addressUpdateResult.fraudAlert});
				userModel.set({admin: addressUpdateResult.admin});
				userModel.set({userMerchant: !!addressUpdateResult.userMerchant});
				userModel.set({dateOfBirth: addressUpdateResult.dateOfBirth || null});
				if(addressUpdateResult.userAddress){
						userModel.set({address: addressUpdateResult.userAddress.address});
						addressUpdateResult.userAddress.address2 ? userModel.set({address2: addressUpdateResult.userAddress.address2}) : userModel.set({address2: ''});
						userModel.set({city: addressUpdateResult.userAddress.city});
						userModel.set({state: addressUpdateResult.userAddress.state});
						userModel.set({country: addressUpdateResult.userAddress.country});
						userModel.set({zip: addressUpdateResult.userAddress.zip});
				}
				userModel.save();
				Alloy.Globals.currentUser = userModel;
			}	
			cb(err, Alloy.Globals.currentUser);
		}
	});
};