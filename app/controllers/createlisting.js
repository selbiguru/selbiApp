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

			var imageView = Ti.UI.createImageView({
				width : "100",
				height : "100",
				image : event.media
			});
			$.imgView.add(imageView);
			imageCollection.push(event.media);
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

			var imageView = Ti.UI.createImageView({
				width : "100",
				height : "100",
				image : event.media
			});

			$.imgView.add(imageView);
			imageCollection.push(event.media);
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
	var style;
	if (Ti.Platform.name === 'iPhone OS') {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	} else {
		style = Ti.UI.ActivityIndicatorStyle.DARK;
	}
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Saving"
	});

	indicatorWindow.openIndicator();
	listingManager.createListing($.title.value, $.description.value, $.price.value, function(err, saveResult) {
		if (saveResult) {
			listingManager.uploadImagesForListing(saveResult.id, imageCollection, function(err, imgUrls) {
				if (imgUrls && imgUrls.length > 0) {
					delete saveResult.rev;
					saveResult.imageUrls = imgUrls;
					listingManager.updateListing(saveResult, function(err, updateResult) {
						indicatorWindow.closeIndicator();
						a.setMessage("Listing created successfully");
						a.show();
					});
				} else {
					indicatorWindow.closeIndicator();
					a.setMessage("Listing created successfully");
					a.show();
				}
			});
		} else {
			indicatorWindow.closeIndicator();
			a.setMessage("Failed to create listing");
			a.show();
		}
	});
}
