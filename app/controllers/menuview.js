var args = arguments[0] || {};
var authManager = require('managers/authmanager');
var imageManager = require('managers/imagemanager');
var userManager = require('managers/usermanager');
var notificationManager = require('managers/notificationmanager');
var helpers = require('utilities/helpers');
var currentUser;
var notificationUser;


//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		currentUser = data;
		imageManager.getMenuProfileImage(function(err, profileImage){
			$.menuUserImage.image = profileImage;
			currentUser.set({'imageURL': profileImage});
			currentUser.save();
		});
		notificationManager.countNotifications(function(err, notificationCount){
			currentUser.set({'notificationCount': notificationCount});
			currentUser.save();
		});
	},
	error: function(data){
		helpers.alertUser('Get User','Failed to get the current user!');	
	}
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