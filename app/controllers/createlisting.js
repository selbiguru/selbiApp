var args = arguments[0] || {};
var animation = require('alloy/animation');
var imageManager = require('managers/imagemanager');
var listingManager = require('managers/listingmanager');
var indicator = require('uielements/indicatorwindow');
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

	console.log("Show camera");

	var _picsTaken = 0;
	var timer = {};

	Titanium.Media.showCamera({

		saveToPhotoGallery : true,
		allowEditing : false,
		autohide : false, //Important!

		success : function(event) {
			if(imageCollection.length < 6 ) {
				createImageView(event);
			}
		},

		error : function(error) {
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
				a.setMessage(L('no_camera'));
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		}
	});
}

function showGallery() {
	Titanium.Media.openPhotoGallery({
		showControls : true,
		success : function(event) {
			if(imageCollection.length < 6 ) {
				createImageView(event);
			}
		},

		error : function(error) {
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
				a.setMessage(L('no_camera'));
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		}
	});
}

function saveListing() {
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
}



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
function createImageView(event) {
	var thumbnailWidth, thumbnailLeft, zeroDP, imgViewSize,
		deleteIconFontSize, imageViewTop;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        thumbnailWidth = '86dp';
	        thumbnailLeft = '10dp';
	        zeroDP = '0dp';
	        imgViewSize = '76dp';
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
		image : event.media
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
	imageCollection.push(event.media);
	
	deleteIcon.addEventListener('click', function(e) {
		$.imgView.remove(thumbnailView);
		var index = imageCollection.indexOf(event.media);
		imageCollection.splice(index, 1);
		console.log("imagecolletion IS THIS OL THING", imageCollection);
		console.log("imagecolletion length", imageCollection.length);
	});
	return;
}

function outputState(){
    Ti.API.info('Switch value: ' + $.privateSwitch.value);
    Ti.API.info('Switch TYPE: ' + typeof $.privateSwitch.value);
};
