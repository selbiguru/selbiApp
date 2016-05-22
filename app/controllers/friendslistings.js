var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	userManager = require('managers/usermanager'),
	friendsManager = require('managers/friendsmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var friendsListingsItemWidth, friendsListingsItemHeight;
var paginateLastDate = '';
var endOfListings = false;
var loadMoreItems = false;
var loading = false;


$.activityIndicator.show();
$.titleFriendsListingsLabel.text = "Friends Listings";


switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        friendsListingsItemWidth = 310;
        friendsListingsItemHeight = 200;
        break;
    case 1: //iphoneFive
        friendsListingsItemWidth = 310;
        friendsListingsItemHeight = 200;
        break;
    case 2: //iphoneSix
        friendsListingsItemWidth = 364;
        friendsListingsItemHeight = 235;
        break;
    case 3: //iphoneSixPlus
        friendsListingsItemWidth = 398;
        friendsListingsItemHeight = 255;
        break;
    case 4: //android currently same as iphoneSix
        friendsListingsItemWidth = 364;
        friendsListingsItemHeight = 235;
        break;
};

//------------------------------------------------FUNCTION-------------------------------------------------------------//



/**
 * @method genFriendsItems 
 * Generates the view for friends using 'friendsListingsTemplate' as the defacto template.
 * @param {Function} cb Callback function
 */
function genFriendsItems(cb){
	if(loading) {
		return;
	}
	loading = true;
	dateObj = {
		updatedAt: paginateLastDate
	};
	listingManager.getFriendsListings(argsID, dateObj, function(err, friendsListings){
		friendsListings.length > 0 ? paginateLastDate = friendsListings[friendsListings.length - 1].updatedAt : '';
		friendsListings.length < 30 ? endOfListings = true : endOfListings = false;
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading your friend\'s listings!  We are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, null);
		} else if(friendsListings && friendsListings.length > 0) {			
			return cb(err, friendsListings);
		} else if (friendsListings && friendsListings.length === 0 && !loadMoreItems) {
			dynamicElement.defaultLabel('It\'s easier to use Selbi with a network of friends. Go to "Add Contacts" under the menu to add more friends!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, friendsListings);
		}
		return cb(err, friendsListings);		
	});
};




/**
 * @method transform 
 * Generates the view for friendsListings using 'friendsListingsTemplate' as the defacto template.
 * @param {Array} items Listings returned from DB
 * @param {Number} columns Number of columns for grid
 * @param {Number} startIndex Index number of where to start to load more listings (if applicable)
 */
function transform(items, columns, startIndex) {
	var items = _.map(items, function(item, index) {
		if(item.listings[0].imageUrls) {
			var imageUrl = item.listings[0].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].friendlistView + Alloy.CFG.cloudinary.bucket + item.listings[0].imageUrls[0] : "";
			var profileImage = item.profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + item.profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.CFG.imageSize.facesDefault;
			return {
				usaListingItem : {
					data: {
		            	userId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	friends: item.invitation
		            }
				},
				listingDetails : {
					data: {
		            	userId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	friends: item.invitation
		            }
				},
	            usaListingThumb : {
	                image :  imageUrl,
	                data: {
		            	userId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	friends: item.invitation
		            }
	            },
	            usaImageThumb : {
	                image : profileImage,
	                data: {
		            	userId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	friends: item.invitation
		            }
	            },
	            usaListingName: {
	            	text: (item.firstName +" "+ item.lastName).length > 14 ? helpers.alterTextFormat((item.firstName +" "+ item.lastName).match(/([^\s]+)([\s])([^\s])/)[0], 13, false) : item.firstName +" "+ item.lastName,
	            	data: {
		            	userId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	friends: item.invitation
		            }
	            },
	            usaListingNumber: {
	            	text: item.count > 1 ? item.count + " Listings" : item.count + " Listing",
	            	data: {
		            	userId: item.id,
		            	userName: item.firstName +" "+ item.lastName,
		            	friends: item.invitation
		            }
	            },
	            properties: {
	            	backgroundColor: '#FAFAFA'
	            }	        
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
			template: 'friendsListingsTemplate2'
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
		genFriendsItems(function(err, items){
			var lvmc = require('com.falkolab.lvmc');
			var section = lvmc.wrap($.getView('friendsListingListView').sections[0]);
	
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
        friendsListingsItemHeight = height/dpi*160;
        friendsListingsItemWidth = width/dpi*160;
    }
    
    return {
    	width: friendsListingsItemWidth,
    	height: friendsListingsItemHeight
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
		helpers.alertUser('Oops','Usernames are only letters and numbers!');
		return;
	}
	if(uniqueUserRegEx[0].length < 7) {
		helpers.alertUser('Oops','Usernames are at least 7 letters long!');
		return;
	}
	var userNameSearchObj = {
		username: uniqueUserRegEx[0]
	};
	friendsManager.getInvitationByUsername(userNameSearchObj, function (err, usernameResults) {
		if(err){
	    	helpers.alertUser('Oops!','Sorry this user does not exist!');
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
 * Targets FriendsListings item that was clicked on from ListView and passes data to openListing function
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
	Alloy.Globals.openPage('mylistings', [
		listingIDs.userName, listingIDs.userId, listingIDs.friends
	]);
	if(Ti.App.Properties.getString('userId') === listingIDs.userId) {
		clearProxy('mylistings');
		Alloy.Globals.closePage('friendslistings');
		Ti.API.info('Closing friendslistings');
	}
};






/**
 * @private blurTextField 
 * Blurs usernameSearch text field in accordance with expected UI
 */
function blurTextField(e) {
	if(e.source.id === 'usernameSearch' || e.source.id === 'friendsListingsSearchView') {
		$.usernameSearch.focus();
	} else {
		$.usernameSearch.blur();
	}
};



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
	$.friendsListingsView.removeEventListener('click', blurTextField);
	$.usernameSearch.removeEventListener('return', keyboardSearch);
};


/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off();
	$.destroy();
	removeEventListeners();
	if(e !== 'mylistings') {
		this.removeEventListener('click', clearProxy);	
	}
}


//-------------------------------------------Initializing Views/Styles----------------------------------------------------//



/**
 * @method init 
 * Initiates the grid on page load for friendsListings.
 */
function init() {
	genFriendsItems(function(err, items){
		var lvmc = require('com.falkolab.lvmc');
		var section = lvmc.wrap($.getView('friendsListingListView').sections[0]);
		var transformed = transform(items, 2, section.getItems().length);
		section.setItems(transformed);
		loading = false;
		if ($.is && !endOfListings) {
			$.is.init($.getView('friendsListingListView'));
			$.is.mark();
		}
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
	});
};

init();



/*-------------------------------------------------Event Listeners---------------------------------------------------*/



$.friendsListingsView.addEventListener('click', blurTextField);
$.usernameSearch.addEventListener('return', keyboardSearch);

Alloy.Globals.addKeyboardToolbar($.usernameSearch, blurTextField);

exports.cleanup = function () {
	Ti.API.info('Cleaning friendlisting');
	clearProxy('mylistings');
	Alloy.Globals.removeChildren($.friendsListingsView);
	$.friendsListingsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};

