var args = arguments[0] || {};
var authManager = require('managers/authmanager');
var imageManager = require('managers/imagemanager');
var userManager = require('managers/usermanager');

imageManager.getMenuProfileImage(function(err, profileImage){
	$.menuUserImage.image = profileImage;	
});

userManager.getCurrentUser(function(err, currentUser){
	$.userName.setText(currentUser.get('firstName') + " " + currentUser.get('lastName'));
});

function logout(){
	authManager.logout(function(err, result){
		if(!err && result) {
			var indexController = Alloy.createController('index').getView();
			indexController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}