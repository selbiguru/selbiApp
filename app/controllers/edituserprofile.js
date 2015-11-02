/**
 * @class EditUserProfile
 * This class deals with user's profile and social profile management
 */
args = arguments[0] || {};

var helpers = require('utilities/helpers'),
userManager = require('managers/usermanager'),
imageManager = require('managers/imagemanager'),
currentUser = null,
indicator = require('uielements/indicatorwindow'),
fb = require('facebook'); 
//logout from facebook everytime for testing
fb.logout();

//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		//check for address? then hide elements and show different elements?
		
	},
	error: function(data){		
	}
});
// Set the user profile image
imageManager.getMenuProfileImage(function(err, profileImage){
	$.userProfileImage.image = profileImage;	
});

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
			alert("Unable to load the image");
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
			alert("Unable to load the image");
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
			userManager.userUpdate(currentUser.toJSON(), function(){				
				imageManager.getMenuProfileImage(function(err, profileImage){
					$.userProfileImage.image = profileImage;
					indicatorWindow.closeIndicator();
				});				
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
	// Todo: validation
	var textFieldObject = {
		"id": Ti.App.Properties.getString('userId'), //Id of the user 
		"firstName": helpers.capFirstLetter($.firstName.value),
		"lastName": helpers.capFirstLetter($.lastName.value),
		"username": $.username.value
	};
	/*var validateFields = helpers.validateFields(textFieldObject);
	for (var i in textFieldObject) {
		if($.[i])
		$.removeClass($[i], "error");
		
	}
	if(validateFields != true){
		console.log("validateFields", validateFields);
		for (var i in validateFields) {
			$.addClass($[i], "error");
		}
		//Todo send back error message
	}*/
	
	userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
		if(userUpdateResult) {
			$.firstName.value = helpers.capFirstLetter($.firstName.value);
			$.lastName.value = helpers.capFirstLetter($.lastName.value);
			$.username.value = $.username.value;
		}
	});	
};


// Don't forget to set your requested permissions, else the login button won't be effective.
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
	});*/
	
	console.log('just shared : + ');
	
	if (twitter.isAuthorized()) {	
		$.connectTwitter.setText('Connected to Twitter');
        $.connectTwitter.touchEnabled = false;
        }
        
	//Do not Deauthorize the application
	//twitter.deauthorize();
	console.log('twitter.isAuthorized(): ' + twitter.isAuthorized());
}

function getGoogleMaps(e){
	Alloy.Globals.openPage('addressgooglemap');
}

