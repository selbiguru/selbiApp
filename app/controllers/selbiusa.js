var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	userManager = require('managers/usermanager'),
	friendsManager = require('managers/friendsmanager'),
	modalManager = require('managers/modalmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var	selbiUSAItemWidth, selbiUSAItemHeight, selbiUSAFontSize;
var	categoryArray = [];
var paginateLastDate = '';
var endOfListings = false;
var loadMoreItems = false;
var loading = false;

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        selbiUSAItemWidth = 310;
        selbiUSAItemHeight = 200;
        selbiUSAFontSize = '12dp';
        break;
    case 1: //iphoneFive
        selbiUSAItemWidth = 310;
        selbiUSAItemHeight = 200;
        selbiUSAFontSize = '12dp';
        break;
    case 2: //iphoneSix
        selbiUSAItemWidth = 364;
        selbiUSAItemHeight = 235;
        selbiUSAFontSize = '14dp';
        break;
    case 3: //iphoneSixPlus
        selbiUSAItemWidth = 398;
        selbiUSAItemHeight = 255;
        selbiUSAFontSize = '15dp';
        break;
    case 4: //android currently same as iphoneSix
        selbiUSAItemWidth = 364;
        selbiUSAItemHeight = 235;
        selbiUSAFontSize = '14dp';
        break;
};


$.activityIndicator.show();
$.titleSelbiUSALabel.text = "Selbi USA";


//------------------------------------------------FUNCTION-------------------------------------------------------------//





/**
 * @method genUSAItems 
 * Generates the view for friends using 'usaitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genUSAItems(cb){
	if(loading) {
		return;
	}
	loading = true;
	var selbiUSAObj = {
		createdAt: paginateLastDate,
		categories: categoryArray.length > 0 ? categoryArray : false
	};
	listingManager.getSelbiListings(argsID, selbiUSAObj, function(err, selbiListings){
		selbiListings.listings.length > 0 ? paginateLastDate = selbiListings.listings[selbiListings.listings.length - 1].createdAt : '';
		selbiListings.listings.length < 30 ? endOfListings = true : endOfListings = false;
		
		if(err) {
			dynamicElement.defaultLabel('Uh oh, we are experiencing server issues and are having trouble loading all the USA listings...We are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, null);
		} else if(selbiListings && selbiListings.listings.length > 0) {
			return cb(err, selbiListings.listings);
			
		} else if (selbiListings && selbiListings.listings.length === 0 && !loadMoreItems) {
			dynamicElement.defaultLabel('Dang, nothing was found :( Check back soon!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, selbiListings.listings);
		}
		return cb(err, selbiListings.listings);	
	});
};




/**
 * @method transform 
 * Generates the view for selbi USA using 'selbiUsaTemplate' as the defacto template.
 * @param {Array} items Listings returned from DB
 * @param {Number} columns Number of columns for grid
 * @param {Number} startIndex Index number of where to start to load more listings (if applicable)
 */
function transform(items, columns, startIndex) {
	var items = _.map(items, function(item, index) {
		if(item.imageUrls) {
			var imageUrl = item.imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].mylistView + Alloy.CFG.cloudinary.bucket + item.imageUrls[0] : "";
			return {
				listingItem:{
	        		borderColor: item.isSold ? "#1BA7CD" : "#E5E5E5",
	        		borderWidth: item.isSold ? '3dp' : '1dp',
	        		data: {
		            	itemId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	userId: item.user,
		            	isSold: item.isSold
		            }
	        	},
	            listingThumb : {
	                image :  imageUrl,
	                data: {
		            	itemId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	userId: item.user,
		            	isSold: item.isSold
		            }
	            },
	            listingDetails: {
	            	data: {
		            	itemId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	userId: item.user,
		            	isSold: item.isSold
		            }
	            },
	            listingTitle : {
	                text : helpers.alterTextFormat(item.title, 18, true),
	                color: item.isSold ? "#1BA7CD" : "#9B9B9B",
	                data: {
		            	itemId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	userId: item.user,
		            	isSold: item.isSold
		            }
	            },
	            listingPrice: {
	            	text: item.price.formatMoney(2),
	            	color: item.isSold ? "#1BA7CD" : "#9B9B9B",
	            	data: {
		            	itemId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	userId: item.user,
		            	isSold: item.isSold
		            }
	            },
	            listingImagesCount: {
	            	text: item.isSold ? "SOLD" : item.imageUrls.length > 1 ? "+" + item.imageUrls.length + " Images" : item.imageUrls.length + " Image"	,
        			font: item.isSold ? {fontFamily: 'Nunito-Bold', fontSize: selbiUSAFontSize } : {fontFamily: 'Nunito-Light', fontSize: selbiUSAFontSize } ,
        			color: item.isSold ? "#1BA7CD" : "#9B9B9B",
        			data: {
		            	itemId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	userId: item.user,
		            	isSold: item.isSold
		           }
	            },
	            properties: {
	            	backgroundColor: '#FAFAFA'
	            },	        
			};
		}
	});
	if(items.length % 2 != 0) {
		items.push({
			emptyListingItem:{
				
			},
			properties: {
				backgroundColor: '#FAFAFA',
			},
			template: 'selbiUsaTemplate2'
		});
	}
	
	return adjustItemsSize(items, columns);
}




/**
 * @method onLoadMore 
 * Generates more listings loaded for infitine scroll.
 * @param {Object} e Event object
 */
function onLoadMore(e) {
	loadMoreItems = true;
	if(!endOfListings) {
		genUSAItems(function(err, items){
			var lvmc = require('com.falkolab.lvmc');
			var section = lvmc.wrap($.getView('selbiUSAListView').sections[0]);
	
			section.appendItems(transform(items, 2, section.getItems().length));
			loading = false;
			if(err) {
				e.error();	
			} else if(endOfListings) {
				$.is.cleanup();
			} else {
				e.success();
			}
		});
	} else {
		return;
	}
}



/**
 * @method getScreenSize 
 * Determines phone screen size and adjusts items of listing accordingly for grid layout.
 */
function getScreenSize() {
	var height = Ti.Platform.displayCaps.platformHeight;
    var width = Ti.Platform.displayCaps.platformWidth;
    var dpi = Ti.Platform.displayCaps.dpi;
                
    if(Ti.Platform.osname =='android') {
        selbiUSAItemHeight = height/dpi*160;
        selbiUSAItemWidth = width/dpi*160;
    }
    
    return {
    	width: selbiUSAItemWidth,
    	height: selbiUSAItemHeight
    };
}



/**
 * @method adjustItemsSize 
 * Determines phone screen size and adjusts items of listing accordingly for grid layout.
 * @param {Array} items Array of transformed items to add size to properties
 * @param {Number} columns Number of columns of grid
 */
function adjustItemsSize(items, columns) {
	var size = getScreenSize();
	return _.map(items, function(item) {
		item.properties.width = size.width/columns;
		item.properties.height = size.height;	
		return item;		
	});
}



/**
 * @method findUserListings 
 * When button is clicked, finds user listings of entered username
 */
function findUserListings(){
	var uniqueUserRegEx = (helpers.trim($.usernameSearch.value, true).toLowerCase()).match(/^[a-z\d]+$/gi);
	if(uniqueUserRegEx === null) {
		helpers.alertUser('Oops','Usernames are only letters and numbers');
		return;
	}
	if(uniqueUserRegEx[0].length < 7) {
		helpers.alertUser('Oops','Usernames are at least 7 letters long');
		return;
	}
	var userNameSearchObj = {
		username: uniqueUserRegEx[0]
	};
	friendsManager.getInvitationByUsername(userNameSearchObj, function (err, usernameResults) {
		if(err){
	    	helpers.alertUser('Oops!','Sorry this user does not exist');
			return;
    	} else {
    		openListing({
    			userId: usernameResults.id,	
    			userName: usernameResults.firstName + ' ' + usernameResults.lastName,
    			friends: usernameResults.invitation	
   		 	});
			return;
		}
	});
}


/**
 * @method listingItemClick 
 * Targets SelbiUSA item that was clicked on from ListView and passes data to openListing function
 * @param {Object} e Event object containing listingId and userId for the item clicked
 */
function listingItemClick(e) {
	openListing(e.source.data);
}

/**
 * @method openListing 
 * Opens viewlisting view and shows the targeted item that was clicked on
 * @param {Object} listingId Object containing listingId and userId for the item
 */
function openListing(listingIDs){
	$.usernameSearch.blur();
	if(!listingIDs.friends) {
		Alloy.Globals.openPage('viewlisting', {
			itemId: listingIDs.itemId,
			userId: listingIDs.userId
		});
	} else {
		Alloy.Globals.openPage('mylistings', [
			listingIDs.userName, listingIDs.userId, listingIDs.friends
		]);
		if(Ti.App.Properties.getString('userId') === listingIDs.userId) {
			clearProxy('mylistings');
			Alloy.Globals.closePage('selbiusa');
		}
	}	
};




/**
 * @private blurTextField 
 * Blurs usernameSearch text field in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'usernameSearch' || e.source.id === 'selbiUSASearchView') {
		$.usernameSearch.focus();
	} else {
		$.usernameSearch.blur();
	}
};



/**
 * @method filterListings 
 * Opens filter modal for user to filter through listings
 */
function filterListings() {
	modalManager.getFilterModal(categoryArray, function(err, results){
		results.modalFilterButton.addEventListener('click', function(e) {
			var animateWindowClose = Titanium.UI.create2DMatrix();
				animateWindowClose = animateWindowClose.scale(0);
			categoryArray = [];
			paginateLastDate = '';
			loadMoreItems = false;
			endOfListings = false;
			for(var i = 0; i < results.filterSwitchView.children.length; i++) {
				if(results.filterSwitchView.children[i].children[0].value) {
					categoryArray.push(results.filterSwitchView.children[i].children[0].id);
				}
			}
			$.defaultView.height= '0dp';
			if($.defaultView.children.length > 0) {
				$.defaultView.remove($.defaultView.children[0]);	
			}
			$.activityIndicator.show();
        	$.activityIndicator.height = Ti.UI.FILL;
			init();
			results.modalWindow.close({transform:animateWindowClose, duration:300});
			animateWindowClose = null;
		});
		return;
	});
}


/**
 * @method keyboardSearch 
 * On keyboard 'Go' button pressed usernameSearch is blurred and findUserListing function is called
 */
function keyboardSearch(){
	$.usernameSearch.blur();
	findUserListings();
}



/**
 * @method removeEventListeners
 * Removes event listeners
 */
function removeEventListeners() {
	$.filterButton.removeEventListener('click', filterListings);
	$.selbiUSAView.removeEventListener('click', blurTextField);
	$.usernameSearch.removeEventListener('return', keyboardSearch);
	$.searchUserButton.removeEventListener('click', findUserListings);
};



/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off();
	$.destroy();
	removeEventListeners();
}



//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

/**
 * @method init 
 * Initiates the grid on page load for selbiUSA listings.
 */
function init() {
	genUSAItems(function(err, items){
		var lvmc = require('com.falkolab.lvmc');
		var section = lvmc.wrap($.getView('selbiUSAListView').sections[0]);
		var transformed = transform(items, 2, section.getItems().length);
		section.setItems(transformed);
		loading = false;
		if ($.is && !endOfListings) {
			$.is.init($.getView('selbiUSAListView'));
			$.is.mark();
		} else if($.is && endOfListings){
			$.is.init($.getView('selbiUSAListView'));
			$.is.cleanup();
		}
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
	});
};

init();




/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.filterButton.addEventListener('click', filterListings);
$.selbiUSAView.addEventListener('click', blurTextField);
$.usernameSearch.addEventListener('return', keyboardSearch); 
$.searchUserButton.addEventListener('click', findUserListings);

Alloy.Globals.addKeyboardToolbar($.usernameSearch, blurTextField);



exports.cleanup = function () {
	clearProxy();
	$.removeListener();
	$.selbiUSAView.removeAllChildren();
	$.selbiUSAView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};