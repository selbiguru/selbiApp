var args = arguments[0] || {};
var animation = require('alloy/animation');
var imageManager = require('managers/imagemanager');
var listingManager = require('managers/listingmanager');
var indicator = require('uielements/indicatorwindow');
var helpers = require('utilities/helpers');
var imageCollection = [];



function addItemToGrid(title, image) {
	$.fg.addGridItem({
		title : title,
		image : image
	});
}

function gotoStep2() {
	$.step2.show();
	$.step1.hide();
}

function gotoStep1() {
	$.step2.hide();
	$.step1.show();
}

// ref: https://github.com/pablorr18/TiFlexiGrid
/*$.fg.init({
 columns:3,
 space:5,
 gridBackgroundColor:'#fff',
 itemHeightDelta: 0,
 itemBackgroundColor:'#eee',
 itemBorderColor:'transparent',
 itemBorderWidth:0,
 itemBorderRadius:0
 });

 function addItemToGrid(title, image){
 $.fg.addGridItem({title: title, image: image});
 }*/

function showCamera() {


	var _picsTaken = 0;
	var timer = {};

	Titanium.Media.showCamera({

		saveToPhotoGallery : true,
		allowEditing : false,
		autohide : false, //Important!

		success : function(event) {
			if(imageCollection.length < 6 ) {
				createImageView(event.media);
			}
		},

		error : function(error) {
			if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
				helpers.alertUser('Camera', L('no_camera'));
			} else {
				helpers.alertUser('Camera', ('Unexpected error: ' + error.code));
			}
		}
	});
}

function showGallery() {
	Titanium.Media.openPhotoGallery({
		showControls : true,
		success : function(event) {
			if(imageCollection.length < 6 ) {
				createImageView(event.media);
			}
		},

		error : function(error) {
			if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
				helpers.alertUser('Camera', L('no_camera'));
			} else {
				helpers.alertUser('Camera', ('Unexpected error: ' + error.code));
			}
		}
	});
}


function previewListing(){
	if(!$.title.value || !$.description.value || !$.price.value || imageCollection.length < 1) {
    	helpers.alertUser('Empty Fields', 'Please make sure all fields are filled out including adding some images!');
    	return;
	} 
	var validateTitle = (helpers.capFirstLetter(helpers.trim($.title.value, false))).match(/^[a-z\d-\/:;()$&@".,\?!'\[\]{}#^*+=_\\|~<> ]+$/gi);
	var validateDescription = (helpers.capFirstLetter(helpers.trim($.description.value, false))).match(/^[a-z\d-\/:;()$&@".,\?!'\[\]{}#^*+=_\\|~<>\n \t]+$/gi);
	var validatedPrice = $.price.value.match(/^[\d,.]+$/g);
	if(!validateTitle) {
		helpers.alertUser('Invalid Title','Please enter valid characters only.');
		return;
	} else if(!validateDescription) {
		helpers.alertUser('Invalid Description','Please enter valid characters only.');
		return;
	} else if(!validatedPrice) {
		helpers.alertUser('Invalid Price','Price should be a number.');
		return;
	} else {
		var previewListingObj = {
			title: validateTitle[0],
			description: validateDescription[0],
			price: parseFloat(validatedPrice[0].replace(/,/g, '')).toFixed(2),
			privateSwitch: $.privateSwitch.value,
			images: imageCollection,
			itemId: false
		};
		var indicatorWindow = indicator.createIndicatorWindow({
			message : "Creating Preview"
		});
		indicatorWindow.openIndicator();
		Alloy.Globals.openPage('viewlisting', previewListingObj);
		indicatorWindow.closeIndicator();
	}
};



//To delete below saveFunction
/*function saveListing() {
	var a = Titanium.UI.createAlertDialog({
		title : 'Listing'
	});

	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving"
	});

	indicatorWindow.openIndicator();
	listingManager.createListing($.title.value, $.description.value, $.price.value, $.privateSwitch.value, function(err, saveResult) {
		if (saveResult) {
			listingManager.uploadImagesForListing(saveResult.id, imageCollection, function(err, imgUrls) {
				if (imgUrls && imgUrls.length > 0) {
					delete saveResult.rev;
					saveResult.imageUrls = imgUrls;
					listingManager.updateListing(saveResult, function(err, updateResult) {
						indicatorWindow.closeIndicator();
						a.setMessage("Listing created successfully");
						a.show();
						Alloy.Globals.openPage('viewlisting', saveResult.id);
					});
				} else {
					indicatorWindow.closeIndicator();
					a.setMessage("Listing created successfully");
					a.show();
					Alloy.Globals.openPage('viewlisting', saveResult.id);
				}
			});
		} else {
			indicatorWindow.closeIndicator();
			a.setMessage("Failed to create listing");
			a.show();
		}
	});
}*/



/*----------------------------------------------------Event Listeners--------------------------------------------------------*/


// The below three event listeners are a hack to add "Hint Text" to a TextArea 
// Appcelerator does not support hint text TextArea
$.hintTextLabel.addEventListener('click', function(e){
	$.description.focus();
	if($.description.value.length > 0) {
		$.hintTextLabel.hide();
	}
});
$.description.addEventListener('focus',function(e){
    if(e.source.value.length > 0){
        $.hintTextLabel.hide();
    }
});
$.description.addEventListener('blur',function(e){
    if(e.source.value.length <= 0){
        $.hintTextLabel.show();
    }
});
$.description.addEventListener('change',function(e){
    if(e.source.value.length > 0){
        $.hintTextLabel.hide();
    } else {
    	$.hintTextLabel.show();
    }
});



/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

 /**
 * @private createImageView 
 *  Dynamically creates XML elements to show the images the user has selected for their item.
 */
function createImageView(media) {
	var thumbnailWidth, thumbnailLeft, zeroDP, imgViewSize,
		deleteIconFontSize, imageViewTop;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        thumbnailWidth = '83dp';
	        thumbnailLeft = '7dp';
	        zeroDP = '0dp';
	        imgViewSize = '73dp';
	        deleteIconFontSize = '12dp';
	        imageViewTop = '11dp';
	        break;
	    case 1: //iphoneFive
	        thumbnailWidth = '93dp';
	        thumbnailLeft = '3dp';
	        zeroDP = '0dp';
	        imgViewSize = '83dp';
	        deleteIconFontSize = '14dp';
	        imageViewTop = '12dp';
	        break;
	    case 2: //iphoneSix
	        thumbnailWidth = '113dp';
	        thumbnailLeft = '5dp';
	        zeroDP = '0dp';
	        imgViewSize = '100dp';
	        deleteIconFontSize = '16dp';
	        imageViewTop = '15dp';
	        break;
	    case 3: //iphoneSixPlus
	        thumbnailWidth = '125dp';
	        thumbnailLeft = '5dp';
	        zeroDP = '0dp';
	        imgViewSize = '110dp';
	        deleteIconFontSize = '18dp';
	        imageViewTop = '15dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        thumbnailWidth = '113dp';
	        thumbnailLeft = '5dp';
	        zeroDP = '0dp';
	        imgViewSize = '100dp';
	        deleteIconFontSize = '16dp';
	        imageViewTop = '15dp';
	        break;
	};
	var thumbnailView = Ti.UI.createImageView({
		width : thumbnailWidth,
		height : Ti.UI.SIZE,
		left: thumbnailLeft
	});
	
	var imageView = Ti.UI.createImageView({
		width : imgViewSize,
		height : imgViewSize,
		top: imageViewTop,
		left: zeroDP,
		image : media
	});
	
	var deleteIcon = Titanium.UI.createLabel({
		top: zeroDP,
		right: zeroDP,
		width: Titanium.UI.SIZE,
		color: "#EAEAEA",
		font: {
			fontSize: deleteIconFontSize
		}
	});
	$.fa.add(deleteIcon, "fa-times");
	thumbnailView.add(deleteIcon);
	thumbnailView.add(imageView);
	$.imgView.add(thumbnailView);
	var imagePercent = (media.width/media.height).toFixed(2);
	var resizedImage = media.imageAsResized(imagePercent*600, 600);
	imageCollection.push(resizedImage);
	
	deleteIcon.addEventListener('click', function(e) {
		$.imgView.remove(thumbnailView);
		var index = imageCollection.indexOf(media);
		imageCollection.splice(index, 1);
	});
	return;
}