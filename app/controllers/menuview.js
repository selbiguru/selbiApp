var args = arguments[0] || {};
var authManager = require('managers/authmanager');
var imageManager = require('managers/imagemanager');
var userManager = require('managers/usermanager');
var helpers = require('utilities/helpers');

imageManager.getMenuProfileImage(function(err, profileImage){
	$.menuUserImage.image = profileImage;
});

userManager.getCurrentUser(function(err, currentUser){
	if(err) {
		helpers.alertUser('Get User','Failed to get the current user!');
		return;
	}
	$.userName.setText(currentUser.get('firstName') + " " + currentUser.get('lastName'));
});

function logout(){
	authManager.logout(function(err, result){
		if(err) {
			helpers.alertUser('Logout','Selbi is experiencing technical difficulties and unable to log you out at this time.  Please try again later!');
			return;
		} else {
			var indexController = Alloy.createController('index').getView();
			indexController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}