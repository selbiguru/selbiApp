/**
 * @class EditUserProfile
 * This class deals with user's profile and social profile management
 */
args = arguments[0] || {};

var helpers = require('utilities/helpers'),
	userManager = require('managers/usermanager'),
	imageManager = require('managers/imagemanager'),
	currentUser = null,
	userNameUnique = true,
	indicator = require('uielements/indicatorwindow'),
	fb = require('facebook'); 
//logout from facebook everytime for testing
//fb.logout();



/**
 * @method onCameraClick
 * This method gives users options to click a picture or select from gallery
 */
function onCameraClick() {
	var opts = {
	  cancel: 2,
	  options: ['Capture Image', 'Select from gallery', 'Cancel'],
	  selectedIndex: 2,
	  title: 'Upload your picture'
	};
	var optionsDialog = Ti.UI.createOptionDialog(opts);
	optionsDialog.show();
	optionsDialog.addEventListener('click', function(e){
		switch(e.index) {
			case 0:
				showCamera();
				break;
			case 1:
				openGallery();
				break;
			default:
				//Do Nothing
				break;
		}
	});
}

/**
 * @method showCamera
 * This method will allow users to click a picture and upload to their profile.
 * NOTE: Android support needs testing
 */
function showCamera(){
	Titanium.Media.showCamera({
		success: function(e){
			uploadUserProfile(e.media);
		},
		cancel: function(){
			// Do nothing
		},
		error: function(){
			helpers.alertUser('Image','Unable to load the image!');
		},
		saveToPhotoGallery:true,
	    // allowEditing and mediaTypes are iOS-only settings
		allowEditing:true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
}

/**
 * @method openGallery
 * This method will allow users to pick images from their phone gallery and upload to their profile
 * NOTE: Android support needs testing
 */
function openGallery(){
	Titanium.Media.openPhotoGallery({
		success: function(e){
			uploadUserProfile(e.media);
		},
		cancel: function(){
			//Do nothing		
		},
		error: function(){
			helpers.alertUser('Image','Unable to load the image!');
		},
		// allowEditing and mediaTypes are iOS-only settings
		allowEditing:true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
}

/**
 * @method uploadUserProfile
 * This method will upload the image to cloudinary and save it to the user's profile
 */
function uploadUserProfile(imageBlob){
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving .."
	});

	indicatorWindow.openIndicator();
	function uploadCompleteCallback(err, result) {
		if(currentUser) {
			currentUser.set({'profileImage': result.public_id});
			currentUser.save();
			userManager.userUpdate(currentUser.toJSON(), function(err, results){
				if(err) {
					helpers.alertUser('Update User','Failed to update user, please try again later!');
					indicatorWindow.closeIndicator();
					return;
				} else {
					imageManager.getMenuProfileImage(function(err, profileImage){
						$.userProfileImage.image = profileImage;
						indicatorWindow.closeIndicator();
						helpers.alertUser('Updated User', 'User profile saved!');
						addressHack();
					});
					return;	
				}			
			});
		} else {
			indicatorWindow.closeIndicator();
		}
	}
	
	// Prepare request
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.tempDirectory, 'profile.jpg');
		f.write(imageBlob); 	
	var uploadImageRequest = {
		image: Titanium.Filesystem.tempDirectory + 'profile.jpg',
		referenceId: 0,
		userId: Ti.App.Properties.getString('userId')
	};
	
	// Image upload
	imageManager.uploadImage(uploadImageRequest, uploadCompleteCallback);	
}

function updateUser(e){
	var uniqueFirstNameRegEx = ($.firstName.value).match(/^[a-zA-Z]+$/);
	var uniqueLastNameRegEx = ($.lastName.value).match(/^[a-zA-Z]+$/);
	
	if(!userNameUnique) {
		if(helpers.trim($.username.value, true).length < 6 ) {
			helpers.alertUser('Sorry','Usernames must be at least 6 characters!');
		} else {
			helpers.alertUser('Sorry','Usernames can only be letters and numbers!');
		}
		return;
	};
	
	if(!uniqueFirstNameRegEx || !uniqueLastNameRegEx) {
		helpers.alertUser('Sorry','First and Last name can only be letters and must be at least 1 character long!');
		return;
	}
	var textFieldObject = {
		"id": Ti.App.Properties.getString('userId'), //Id of the user 
		"firstName": helpers.trim($.firstName.value, true).toLowerCase(),
		"lastName": helpers.trim($.lastName.value, true).toLowerCase(),
		"username": helpers.trim($.username.value, true).toLowerCase()
	};
	
	userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
		if(err) {
			helpers.alertUser('Update User','Failed to update user, please try again later!');
			return;
		} else {
			helpers.alertUser('Updated User', 'User profile saved!');
			$.firstName.value = $.firstName.value;
			$.lastName.value = $.lastName.value;
			$.username.value = $.username.value;
		}
		addressHack();
	});	
};


function updateUserName() {
	var uniqueObject = {
		username: ($.username.value).toLowerCase(),
		email: (Alloy.Globals.currentUser.attributes.email).toLowerCase(),
		userId: Ti.App.Properties.getString('userId')
	};
	userManager.isUnique(uniqueObject, function(err, uniqueResult){
		if(err) {
			helpers.alertUser('Oops','Something went wrong checking for usernames, please try again later!');
			return;
		} else if(uniqueResult){
			userNameUnique = true;
			$.username.value = $.username.value;
			$.usernameXIcon.hide();
			$.usernameCheckIcon.show();
		} else {
			userNameUnique = false;
			$.usernameCheckIcon.hide();
			$.usernameXIcon.show();
		}
	});	
};


/*// Don't forget to set your requested permissions, else the login button won't be effective.
var win = (Ti.Platform.name === 'android') ? Ti.UI.createWindow({backgroundColor: 'white'}) : null;


//check if already connected to facebook
if(fb.loggedIn)
{
	//if already connected then disconnect. 
	//currently we are not giving a user a way to logout
	//fb.logout();
	
	$.connectFacebook.title = 'Connected to Facebook';
    $.connectFacebook.touchEnabled = false;
    console.log('Inside the if statement: ' + $.connectFacebook.touchEnabled);
}

fb.addEventListener('login', function(e) {
    if (e.success) {
        console.log('login from uid: '+e.uid + 'teh whole object: ' + e);
        
        for (var prop in e) {
          // important check that this is objects own property 
          // not from prototype prop inherited
          if(e.hasOwnProperty(prop)){
            console.log(prop + " = " + e[prop]);
          }
         }
        fb.loggedIn = true;
        $.connectFacebook.title = 'Connected to Facebook';
        $.connectFacebook.touchEnabled = false;
        console.log('Logged In = ' + fb.loggedIn);
    }
    else if (e.cancelled) {
        // user cancelled
        alert('cancelled');
    }
    else {
        alert(e.error);
    }
});

fb.addEventListener('logout', function(e) {
    alert('Logged out');
    console.log('Logged In = ' + fb.loggedIn);
    fb.loggedIn = false;
    $.connectFacebook.title = 'Connect to Facebook';
});

function connectToFaceBook(){
	console.log('entered connectToFacebook');
	if(fb.loggedIn)
	{
		//if already connected then disconnect. 
		//currently we are not giving a user a way to logout
		//fb.logout();
		$.connectFacebook.title = 'Connected to Facebook';
        $.connectFacebook.touchEnabled = false;
	}
	else
	{
		//For Android Platform. TODO test properly
		if (Ti.Platform.name === 'android') {
			console.log('entered createActivityWorker');
		    win.fbProxy = fb.createActivityWorker({lifecycleContainer: win});
		    fb.permissions = ['email', 'publish_actions'];
			win.open();
		}
		else {		
			fb.permissions = ['email', 'publish_actions'];
			fb.initialize(1000);
			fb.authorize();
		}
	}
}

function connectToTwitter() {
	console.log('In connectToTwitter method.');

	var twitter = Alloy.Globals.social.create({
    	consumerSecret: Alloy.CFG.twitter.consumerSecret,
    	consumerKey: Alloy.CFG.twitter.consumerKey
	});
	
	twitter.authorize();
	
	if (twitter.isAuthorized())
	{
		$.connectTwitter.touchEnabled = false;
		$.connectTwitter.title = 'Connected to Twitter';
	}
	
	console.log('Check if authorized.' + twitter.isAuthorized());
	
	// Post a message
	// Setup both callbacks for confirmation
	// Note: share() automatically calls authorize() so an explicit call as above is unnecessary
	/*twitter.share({
	    message: "friends unite! " + Math.random().toString(),
	    success: function(e) {alert('Success!');},
	    error: function(e) {alert('Error!' + e);}
	});
	
	console.log('just shared : + ');
	
	if (twitter.isAuthorized()) {	
		$.connectTwitter.setText('Connected to Twitter');
        $.connectTwitter.touchEnabled = false;
        }
        
	//Do not Deauthorize the application
	//twitter.deauthorize();
	console.log('twitter.isAuthorized(): ' + twitter.isAuthorized());
}*/

function getGoogleMaps(e){
	Alloy.Globals.openPage('addressgooglemap');
}







/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/











/*----------------------------------------------On page load API calls---------------------------------------------*/



//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		currentUser = data;
	},
	error: function(data){		
	}
});
// Set the user profile image
imageManager.getMenuProfileImage(function(err, profileImage){
	$.userProfileImage.image = profileImage;
});

// Hide the x-icon on username load until user types and we use isUnique API route to see if available
$.usernameXIcon.hide();


//On page load, this is a hack to show hintText instead of empty field for city and streetAddress
function addressHack() {
	if(helpers.trim($.city.value).length === 0 && helpers.trim($.streetAddress.value).length === 0) {
		$.city.value = '';
		$.streetAddress.value = '';
	}
}

addressHack();



/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.firstNameView.addEventListener('click', function(e){
	this.children[1].focus();
});

$.lastNameView.addEventListener('click', function(e){
	this.children[1].focus();
});

$.usernameView.addEventListener('click', function(e){
	this.children[1].focus();
});





$.username.addEventListener('change',function(e){
	var uniqueUserRegEx = ($.username.value).match(/^[a-zA-Z\d\_]+$/);
	if(uniqueUserRegEx === null) {
		userNameUnique = false;
		$.usernameCheckIcon.hide();
		$.usernameXIcon.show();
	} else if(this.value.length > 6) {
		updateUserName();
	} else {
		userNameUnique = false;
		$.usernameCheckIcon.hide();
		$.usernameXIcon.show();
	}
});