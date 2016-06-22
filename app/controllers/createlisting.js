var args = arguments[0] || {};
var animation = require('alloy/animation');
var ImageFactory = require('ti.imagefactory');
var imageManager = require('managers/imagemanager');
var listingManager = require('managers/listingmanager');
var indicator = require('uielements/indicatorwindow');
var helpers = require('utilities/helpers');
var pickerRowFont;
var imageCollection = [];
var previousState = 0;
var count = 1;
var categoryArray = ['Electronics', 'Menswear', 'Womenswear', 'Sports & Outdoors', 'Music', 'Furniture', 'Jewelry', 'Games & Toys', 'Automotive', 'Baby & Kids', 'Appliances', 'Other'];


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

function showCamera() {


	var _picsTaken = 0;
	var timer = {};

	Titanium.Media.showCamera({

		saveToPhotoGallery : true,
		allowEditing : true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
		autohide : true, //Important!

		success : function(event) {
			if(imageCollection.length < 2 ) {
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
		allowEditing : true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
		success : function(event) {
			if(imageCollection.length < 2 ) {
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
    	helpers.alertUser('Empty Fields', 'Please make sure all fields are filled out including adding some images');
    	return;
	}
	var validateTitle = (helpers.capFirstLetter(helpers.trim($.title.value, false))).match(/^[a-z\d-\/:;()$&@".,\?!'\[\]{}#^*+=_\\|~<> ]+$/gi);
	var validateDescription = (helpers.capFirstLetter(helpers.trim($.description.value, false))).match(/^[a-z\d-\/:;()$&@".,\?!'\[\]{}#^*+=_\\|~<>\n \t]+$/gi);
	var validatedPrice = $.price.value.replace(/[^\d,.]+/g,"");
		validatedPrice = validatedPrice.match(/^[\d,.]+$/g);
	if(!validateTitle) {
		helpers.alertUser('Invalid Title','Please enter valid characters only');
		return;
	} else if(!validateDescription) {
		helpers.alertUser('Invalid Description','Please enter valid characters only');
		return;
	} else if(!validatedPrice || !(parseFloat(validatedPrice) > .50)) {
		helpers.alertUser('Invalid Price','Price should be a number and greater than $0.50');
		return;
	} else if(!(parseFloat(validatedPrice) < 20000.00)) {
		helpers.alertUser('Invalid Price','Price can be no greater than $19,999.99.  If you\'d like to post an item for more than that, \'Contact Us\' under \'Settings\' so we can accommodate your request');
		return;
	} else if($.pickerCategory.getSelectedRow(0).id === 'blank') {
		helpers.alertUser('Invalid Category','Please selected a category that best matches your item');
		return;
	} else {
		var previewListingObj = {
			title: validateTitle[0],
			description: validateDescription[0],
			price: parseFloat(validatedPrice[0].replace(/,/g, '')).toFixed(2),
			privateSwitch: $.privateSwitch.value,
			searchCategory: $.pickerCategory.getSelectedRow(0).id,
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



/**
 * @method findIndexByKeyValue
 * This method will find the index of array by key value
 */
function findIndexByKeyValue(obj, key, value)
{
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            return i;
        }
    }
    return null;
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
};



/**
 * @private blurTextField 
 * Blurs textfields in accordance with expected UI on register.js View
 */
function blurTextField(e) {
	if(e.source.id === 'title') {
		$.title.focus();
	} else if(e.source.id === 'description' || e.source.id === 'hintTextLabel') {
		$.description.focus();
	} else if(e.source.id === 'price') {
		$.price.focus();
	} else {
		$.title.blur();
		$.description.blur();
		$.price.blur();
	}
};


/**
 * @method keyboardNext 
 * On keyboard 'Next' button pressed moves user to the next text field to fill out
 */
function keyboardNext(e) {
	if(e.source.id === 'title') {
		e.source.blur();
		$.description.focus();
	} else {
		e.source.blur();
	}
};


/**
 * @method dollarSign 
 * Auto fills in dollar sign when user enters in a price
 */
function dollarSign(e) {
	if($.price.value.length > 0 && $.price.value.indexOf('$') === -1) {
		$.price.value = '$'+$.price.value;
		previousState = $.price.value.length;
	} else if($.price.value.indexOf('$') === 0 && $.price.value.length === 1 && previousState > $.price.value.length) {
		$.price.value = '';
		previousState = $.price.value.length;
	}
}

/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off();
	$.destroy();
	imageCollection = [];
	previousState = null;
	$.privateSwitch.removeEventListener('change', blurTextField);
	$.pickerCategory.removeEventListener('change', blurTextField);
	$.createListingView.removeEventListener('click', blurTextField);
	$.title.removeEventListener('return', keyboardNext);
	$.price.removeEventListener('return', keyboardNext);
	$.price.removeEventListener('change', dollarSign);
	
}


/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/


 /**
 * @private createImageView 
 *  Dynamically creates XML elements to show the images the user has selected for their item.
 */
function createImageView(media) {
	var thumbnailWidth, thumbnailLeft, zeroDP, imgViewSize,
		deleteIconFontSize, imageViewTop, mediaThumbnail;
	
	
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour 2 photos, 4 photos, 6 photos
	        thumbnailWidth = '132dp';//'95dp';//'83dp';
	        thumbnailLeft = '3dp';//'31dp';//'7dp';
	        zeroDP = '0dp';//'0dp';//'0dp';
	        imgViewSize = '119dp';//'83dp';//'73dp';
	        deleteIconFontSize = '17dp';//'14dp';//'12dp';
	        imageViewTop = '15dp';//'13dp';//'11dp';
	        break;
	    case 1: //iphoneFive 2 photos, 4 photos, 6 photos
	        thumbnailWidth = '141dp';//'113dp';//'93dp';
	        thumbnailLeft = '3dp';//'24dp';//'3dp';
	        zeroDP = '0dp';//'0dp';//'0dp';
	        imgViewSize = '128p';//'100dp';//'83dp';
	        deleteIconFontSize = '18dp';//'16dp';//'14dp';
	        imageViewTop = '18dp';//'14dp';//'12dp';
	        break;
	    case 2: //iphoneSix 2 photos, 4 photos, 6 photos
	        thumbnailWidth = '171dp';//'138dp';//'113dp';
	        thumbnailLeft = '7dp';//'31dp';//'5dp';
	        zeroDP = '0dp';//'0dp';//'0dp';
	        imgViewSize = '156dp';//'120dp';//'100dp';
	        deleteIconFontSize = '20dp';//'18dp';//'16dp';
	        imageViewTop = '20dp';//'18dp';//'15dp';
	        break;
	    case 3: //iphoneSixPlus 2 photos, 4 photos, 6 photos
	        thumbnailWidth = '185dp';//'145dp';//'125dp';
	        thumbnailLeft = '10dp';//'38dp';//'5dp';
	        zeroDP = '0dp';//'0dp';//'0dp';
	        imgViewSize = '170dp';//'130dp';//'110dp';
	        deleteIconFontSize = '20dp';//'20dp';//'18dp';
	        imageViewTop = '20dp';//'20dp';//'15dp';
	        break;
	    case 4: //android currently same as iphoneSix 2 photos, 4 photos, 6 photos
	        thumbnailWidth = '171dp';//'138dp';//'113dp';
	        thumbnailLeft = '7dp';//'31dp';//'5dp';
	        zeroDP = '0dp';//'0dp';//'0dp';
	        imgViewSize = '156dp';//'120dp';//'100dp';
	        deleteIconFontSize = '20dp';//'18dp';//'16dp';
	        imageViewTop = '20dp';//'18dp';//'15dp';
	        break;
	};
	
	if(media.height > 750 && media.width >= media.height) {
		media = ImageFactory.compress(resizeKeepAspectRatioNewHeight(media, media.width, media.height, 750), .5);
		mediaThumbnail = ImageFactory.imageAsThumbnail(resizeKeepAspectRatioNewHeight(media, media.width, media.height, 750),{size: imgViewSize});
	} else if(media.height > 750 && media.width < media.height) {
		media = ImageFactory.compress(resizeKeepAspectRatioNewWidth(media, media.width, media.height, 750), .5);
		mediaThumbnail = ImageFactory.imageAsThumbnail(resizeKeepAspectRatioNewWidth(media, media.width, media.height, 750),{size: imgViewSize});
	} else {
		media = ImageFactory.compress(media, .5);
		mediaThumbnail = ImageFactory.imageAsThumbnail(resizeKeepAspectRatioNewHeight(media, media.width, media.height, 500),{size: imgViewSize});
	};
	var imageData = {
		resizedImage: media,
		idx: count
	};
	imageCollection.push(imageData);
	
	
	
	var thumbnailView = Ti.UI.createImageView({
		width : thumbnailWidth,
		height : Ti.UI.SIZE,
		left: thumbnailLeft,
		top: zeroDP
	});
	
	var imageView = Ti.UI.createImageView({
		width : imgViewSize,
		height : imgViewSize,
		top: imageViewTop,
		left: zeroDP,
		image : ImageFactory.imageAsThumbnail(resizeKeepAspectRatioNewHeight(media, media.width, media.height, 800),{size: imgViewSize})
	});
	
	var deleteIcon = Titanium.UI.createLabel({
		top: zeroDP,
		right: zeroDP,
		width: Titanium.UI.SIZE,
		color: "#CCCCCC",
		font: {
			fontSize: deleteIconFontSize
		},
		data: count
	});
	$.fa.add(deleteIcon, "fa-times");
	thumbnailView.add(deleteIcon);
	thumbnailView.add(imageView);
	$.imgView.add(thumbnailView);
	
	$.addListener(deleteIcon,'click', function(e) {
		var idxValue = findIndexByKeyValue(imageCollection, 'idx', e.source.data);
		$.imgView.remove(thumbnailView);
		imageCollection.splice(idxValue, 1);
	});
	count++;
	return;
};



 /**
 *  Dynamically creates pickerRows for all Selbi categories for user to choose from.
 */
switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
    	pickerRowFont = 14;
        break;
    case 1: //iphoneFive
    	pickerRowFont = 16;
        break;
    case 2: //iphoneSix
    	pickerRowFont = 18;
        break;
    case 3: //iphoneSixPlus
    	pickerRowFont = 20;
        break;
    case 4: //android currently same as iphoneSix
    	pickerRowFont = 18;
        break;
};
for(var i = 0; i < categoryArray.length; i++) {
	$.pickerCategory.add(Titanium.UI.createPickerRow({
		title: categoryArray[i],
		font: {
			fontSize: pickerRowFont,
			fontFamily: 'Nunito-Light'
		},
		id: categoryArray[i]
	}));
};




/*----------------------------------------------------Event Listeners--------------------------------------------------------*/


// The below three event listeners are a hack to add "Hint Text" to a TextArea 
// Appcelerator does not support hint text TextArea
$.addListener($.hintTextLabel,'click', function(e){
	$.description.focus();
	if($.description.value.length > 0) {
		$.hintTextLabel.hide();
	}
});
$.addListener($.description,'focus',function(e){
    if(e.source.value.length > 0){
        $.hintTextLabel.hide();
    }
});
$.addListener($.description,'blur',function(e){
    if(e.source.value.length <= 0){
        $.hintTextLabel.show();
    }
});
$.addListener($.description,'change',function(e){
    if(e.source.value.length > 0){
        $.hintTextLabel.hide();
    } else {
    	$.hintTextLabel.show();
    }
});

$.addListener($.privateSwitch,'change', blurTextField);
$.addListener($.pickerCategory,'change', blurTextField);
$.addListener($.createListingView,'click', blurTextField);
$.addListener($.title,'return', keyboardNext);
$.addListener($.price,'return', keyboardNext);
$.addListener($.price,'change', dollarSign);

Alloy.Globals.addKeyboardToolbar($.title, blurTextField);
Alloy.Globals.addKeyboardToolbar($.description, blurTextField);
Alloy.Globals.addKeyboardToolbar($.price, blurTextField);

exports.cleanup = function () {
    clearProxy();
    $.removeListener();
    Alloy.Globals.removeChildren($.createListingView);
    $.createListingView = null;
    Alloy.Globals.deallocate($);
    $ = null;
};
