/**
 * @class EditUserProfile
 * This class deals with user's profile and social profile management
 */
args = arguments[0] || {};

var helpers = require('utilities/helpers'),
	userManager = require('managers/usermanager'),
	imageManager = require('managers/imagemanager'),
	paymentManager = require('managers/paymentmanager'),
	ImageFactory = require('ti.imagefactory'),
	currentUser = null,
	userNameUnique = true,
	indicator = require('uielements/indicatorwindow'),
	geoLocation = require('utilities/geoLocation'),
	dynamicElement = require('utilities/dynamicElement');

//Checks to see if servers are running (looking at global user).
//If not shows the below message
if(!Alloy.Globals.currentUser){
	$.editUserProfileView.remove($.editUserInfoView);
	dynamicElement.defaultLabel('Our servers are down. Fortunately, we are already working on a solution!', function(err, results) {
		$.editUserProfileUndefined.add(results);
	});
}


//Checks current user address before showing or hiding address info
//Button title changes in response to user having or not having an address
if(!Alloy.Globals.currentUser.attributes.address){
	$.addressLabel.hide();
	$.addressLabel.height = '0dp';
	$.addressInfo.hide();
	$.addressInfo.height = '0dp';
	$.googleAddress.title = 'Add Address';	
} else {
	$.googleAddress.title = 'Edit Address';
}


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
		error: function(error){
			if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
				helpers.alertUser('Camera', L('no_camera'));
			} else {
				helpers.alertUser('Camera', ('Unexpected error: ' + error.code));
			}
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
	buttonsOff();
	indicatorWindow.openIndicator();
	function uploadCompleteCallback(err, result) {
		if(currentUser) {
			var currentProfileImage = currentUser.get('profileImage');
			var profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + result.public_id;
			currentUser.set({'profileImage': result.public_id});
			currentUser.set({'imageURL': profileImageUrl});		
			currentUser.save();
			var profileImgObject = {
				"id": Ti.App.Properties.getString('userId'),
				"profileImage": result.public_id
			};
			userManager.userUpdate(profileImgObject, function(err, results){
				addressHack();
				if(err) {
					indicatorWindow.closeIndicator();
					buttonsOn();
					helpers.alertUser('Update User','Failed to update user, please try again later');
					return;
				} else {
					if(currentProfileImage) {
						var deleteImageObj = {
							images: [currentProfileImage]
						};
						imageManager.deleteImage(deleteImageObj, function(err, deleteImageResult) {
						});
					}
					imageManager.getMenuProfileImage(function(err, profileImage){
						$.userProfileImage.addEventListener('load',loadImage);
						$.userProfileImage.image = profileImage;
						function loadImage(e){
							indicatorWindow.closeIndicator();
							buttonsOn();
							helpers.alertUser('Updated User', 'User profile saved');
							$.userProfileImage.removeEventListener('load',loadImage);
						}
					});
					return;	
				}			
			});
		} else {
			indicatorWindow.closeIndicator();
			buttonsOn();
		}
	}
	
	// Prepare request
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.tempDirectory, 'profile.jpg');
	var resizedImage;
	if(imageBlob.height > 700 && imageBlob.width >= imageBlob.height) {
		resizedImage = ImageFactory.compress(resizeKeepAspectRatioNewHeight(imageBlob, imageBlob.width, imageBlob.height, 700), .6);
	} else if(imageBlob.height > 700 && imageBlob.width < imageBlob.height) {
		resizedImage = ImageFactory.compress(resizeKeepAspectRatioNewWidth(imageBlob, imageBlob.width, imageBlob.height, 700), .6);
	} else {
		resizedImage = ImageFactory.compress(imageBlob, .6);
	};
	
		f.write(resizedImage);
	var uploadImageRequest = {
		image: Titanium.Filesystem.tempDirectory + 'profile.jpg',
		referenceId: 0,
		userId: Ti.App.Properties.getString('userId')
	};
	
	// Image upload
	imageManager.uploadImage(uploadImageRequest, uploadCompleteCallback);	
}

/**
 * @method resizeKeepAspectRatioNewWidth
 * This method used with ImageFactory to resize the image with same ratio but new width
 */
function resizeKeepAspectRatioNewWidth(blob, imageWidth, imageHeight, newWidth) {
    // only run this function if suitable values have been entered
    if (imageWidth <= 0 || imageHeight <= 0 || newWidth <= 0)
        return blob;

    var ratio = imageWidth / imageHeight;

    var w = newWidth;
    var h = newWidth / ratio;


    return ImageFactory.imageAsResized(blob, { width:w, height:h });
}


/**
 * @method resizeKeepAspectRatioNewHeight
 * This method used with ImageFactory to resize the image with same ratio but new height
 */
function resizeKeepAspectRatioNewHeight(blob, imageWidth, imageHeight, newHeight) {
    // only run this function if suitable values have been entered
    if (imageWidth <= 0 || imageHeight <= 0 || newHeight <= 0)
        return blob;

    var ratio = imageWidth / imageHeight;

    var w = newHeight * ratio;
    var h = newHeight;


    return ImageFactory.imageAsResized(blob, { width:w, height:h });
}


function updateUser(e){
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving .."
	});
	var uniqueFirstNameRegEx = (helpers.capFirstLetter(helpers.trim($.firstName.value, false))).match(/^[a-z ,.'-]+$/i);
	var uniqueLastNameRegEx = (helpers.capFirstLetter(helpers.trim($.lastName.value, false))).match(/^[a-z ,.'-]+$/i);
	
	if(!userNameUnique) {
		if(helpers.trim($.username.value, true).length < 7 ) {
			helpers.alertUser('Sorry','Usernames must be at least 7 characters');
		} else {
			helpers.alertUser('Sorry','Usernames can only be letters, numbers or an _');
		}
		return;
	};
	if(!uniqueFirstNameRegEx || !uniqueLastNameRegEx) {
		helpers.alertUser('Sorry','Please enter a valid first and last name');
		return;
	}
	var textFieldObject = {
		"id": Ti.App.Properties.getString('userId'), //Id of the user 
		"firstName": uniqueFirstNameRegEx[0],
		"lastName": uniqueLastNameRegEx[0],
		"username": helpers.trim($.username.value, true).toLowerCase()
	};
	buttonsOff();
	indicatorWindow.openIndicator();
	userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
		if(err) {
			indicatorWindow.closeIndicator();
			buttonsOn();
			helpers.alertUser('Update User','Failed to update user, please try again later');
			return;
		} else {
			indicatorWindow.closeIndicator();
			buttonsOn();
			helpers.alertUser('Updated User', 'User profile saved');
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
			helpers.alertUser('Oops','Something went wrong checking for usernames, please try again later');
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

function getGoogleMaps(e){
	geoLocation.getCurrentPosition(function(e){
		Alloy.Globals.openPage('addressgooglemap',[e]);
	});
};



/**
 * @method buttonsOn
 * Turns touchEnabled on buttons on when the page is done saving
 */
function buttonsOn() {
	$.saveInfoButtonIcon.touchEnabled = true;
	$.menuButton.touchEnabled = true;
	$.googleAddress.touchEnabled = true;
};


/**
 * @method buttonsOff
 * Turns touchEnabled on buttons off while the page is saving
 */
function buttonsOff() {
	$.saveInfoButtonIcon.touchEnabled = false;
	$.menuButton.touchEnabled = false;
	$.googleAddress.touchEnabled = false;
};


/**
 * @private blurTextField 
 * Blurs textfields in accordance with expected UI on register.js View
 */
function blurTextField(e) {
	if(e.source.id === 'firstNameView' || e.source.id === 'firstName' || e.source.id === 'firstNameLabel') {
		$.firstName.focus();
	} else if(e.source.id === 'lastNameView' || e.source.id === 'lastName' || e.source.id === 'lastNameLabel') {
		$.lastName.focus();
	} else if(e.source.id === 'usernameView' || e.source.id === 'username' || e.source.id === 'usernameLabel' || e.source.id === 'usernameCheckIcon' || e.source.id === 'usernameXIcon') {
		$.username.focus();
	} else {
		$.firstName.blur();
		$.lastName.blur();
		$.username.blur();
	}
};


/**
 * @private blurTextField 
 * Blurs textfields in accordance with expected UI on register.js View
 */
function showBalanceInfoModal() {
	helpers.alertUser('Your Balance','Your balance is the amount of money that is to be automatcially transferred to the bank account you provided based on the transfer schedule.\n\nTo learn more about transfers check out \'How does my balance transfer\' in our FAQ section under \'Settings\'');
}


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	Alloy.Globals.closePage('edituserprofile');
};

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
	if($) {
		$.userProfileImage.image = profileImage;	
	}
});

// Hide the x-icon on username load until user types and we use isUnique API route to see if available
$.usernameXIcon.hide();
$.balanceLabel.hide();


//On page load, this is a hack to show hintText instead of empty field for city and streetAddress
function addressHack() {
	if(helpers.trim($.city.value).length === 0 && helpers.trim($.streetAddress.value).length === 0) {
		$.city.value = '';
		$.streetAddress.value = '';
	}
}

paymentManager.getBalance(function(err, managedBalance) {
	if($) {
		if(err){
			$.balanceLabel.text = 'Balance: N/A   \uf29c';
			$.balanceLabel.show();
			return;
		}
		var balance = managedBalance && managedBalance.pending ? parseFloat(managedBalance.pending[0].amount)/100 : 0;
		$.balanceLabel.text = 'Balance: '+balance.formatMoney(2)+'   \uf29c';
		$.balanceLabel.show();
	}
});	

addressHack();



/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.addListener($.editUserProfileView,'click', blurTextField);
$.addListener($.balanceLabel,'click', showBalanceInfoModal);


Alloy.Globals.addKeyboardToolbar($.firstName, blurTextField);
Alloy.Globals.addKeyboardToolbar($.lastName, blurTextField);
Alloy.Globals.addKeyboardToolbar($.username, blurTextField);

$.username.addEventListener('change',function(e){
	var uniqueUserRegEx = ($.username.value).match(/^[a-z\d]+$/gi);
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


exports.cleanup = function () {
	$.destroy();
    $.off();
    $.balanceLabel.removeEventListener('click', showBalanceInfoModal);
    $.editUserProfileButtonIcon.removeEventListener('click', backButton);
    $.editUserProfileView.removeEventListener('click', blurTextField);
    $.removeListener();
    $.editUserProfileView.removeAllChildren();
    $.editUserProfileView = null;
    Alloy.Globals.deallocate($);
    $ = null;
};

