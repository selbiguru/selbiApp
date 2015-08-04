var args = arguments[0] || {};
var authManager = require('managers/authmanager');
var imageManager = require('managers/imagemanager');

imageManager.getMenuProfileImage(function(err, profileImage){
	var profileImage = Ti.UI.createImageView({
		image: profileImage
	});	
	$.menuUserImage.add(profileImage);	
});

function logout(){
	authManager.logout(function(err, result){
		if(!err && result) {
			var indexController = Alloy.createController('index').getView();
			indexController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}