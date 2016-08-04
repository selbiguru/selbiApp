var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {},
	argsFriend = arguments[0][2] || false;
	argsUsername = arguments[0][3] || false;
var listingManager = require('managers/listingmanager'),
	helpers = require('utilities/helpers'),
	friendsManager = require('managers/friendsmanager'),
	dynamicElement = require('utilities/dynamicElement');
var myListingFontSize, myTopBarFontSize,
	myListingsItemWidth, myListingsItemHeight,
	friendIconTop;
var paginateLastDate = '';
var endOfListings = false;
var loadMoreItems = false;
var isSold = false;
var loading = false;
var queryObj = {
	myself: Ti.App.Properties.getString('userId') === argsID ? true : false,
	friends: argsFriend.length > 0 && argsFriend[0].status === 'approved' ? true : false
};
var tabsObject = Object.freeze({
	'mylistings': 1,
});
var tabView = tabsObject[args];
switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        myListingFontSize = '12dp';
        myTopBarFontSize = '11dp';
        mySoldFontSize = '14dp';
        friendIconTop = '23dp';
        myListingsItemWidth = 310;
        myListingsItemHeight = 200;
        heightIconView = '24dp';
        checkmarkTop = '6dp';
		checkmarkLeft = '8dp';
		dataBorderRadius = '12dp';
		rightIconView = '4dp';
		myTitleTop = '14dp';
        break;
    case 1: //iphoneFive
        myListingFontSize = '12dp';
        myTopBarFontSize = '11dp';
        mySoldFontSize = '14dp';
        friendIconTop = '23dp';
        myListingsItemWidth = 310;
        myListingsItemHeight = 200;
        heightIconView = '24dp';
        checkmarkTop = '6dp';
		checkmarkLeft = '8dp';
		dataBorderRadius = '12dp';
		rightIconView = '4dp';
		myTitleTop = '14dp';
        break;
    case 2: //iphoneSix
        myListingFontSize = '14dp';
        myTopBarFontSize = '12dp';
        mySoldFontSize = '16dp';
        friendIconTop = '23dp';
        myListingsItemWidth = 364;
        myListingsItemHeight = 235;
        heightIconView = '28dp';
        checkmarkTop = '8dp';
		checkmarkLeft = '9dp';
		dataBorderRadius = '14dp';
		rightIconView = '10dp';
		myTitleTop = '16dp';
        break;
    case 3: //iphoneSixPlus
        myListingFontSize = '15dp';
        myTopBarFontSize = '14dp';
        mySoldFontSize = '18dp';
        friendIconTop = '23dp';
        myListingsItemWidth = 398;
        myListingsItemHeight = 255;
        heightIconView = '30dp';
        checkmarkTop = '8dp';
		checkmarkLeft = '9dp';
		dataBorderRadius = '15dp';
		rightIconView = '8dp';
		myTitleTop = '18dp';
        break;
    case 4: //android currently same as iphoneSix
        myListingFontSize = '14dp';
        myTopBarFontSize = '12dp';
        mySoldFontSize = '16dp';
        friendIconTop = '23dp';
        myListingsItemWidth = 364;
        myListingsItemHeight = 235;
        heightIconView = '28dp';
        checkmarkTop = '8dp';
		checkmarkLeft = '9dp';
		dataBorderRadius = '14dp';
		rightIconView = '10dp';
		myTitleTop = '16dp';
        break;
};




$.activityIndicator.show();
if(tabView === 1 || Ti.App.Properties.getString('userId') === argsID) {
	queryObj.isSold = false;
	$.backViewButton.children[0].removeEventListener('click',backButton);
	$.backViewButton.removeAllChildren();
	$.myListingsTopBar.remove($.backViewButton);
	$.myListingsTopBar.remove($.friendRequestView);
	$.friendRequestView = null;
	$.backViewButton = null;
	$.titleMyListingsLabel.top = myTitleTop;
	$.titleMyListingsLabel.text = "My Listings";
	$.titleMyListingsUsername.hide();
	$.titleMyListingsUsername.height = '0dp';
} else {
	queryObj.isSold = false;
	$.myListingsButtonSaveIcon.removeEventListener('click',soldItems);
	$.saveViewButton.removeAllChildren();
	$.menuButton.removeAllChildren();
	$.myListingsTopBar.remove($.saveViewButton);
	$.myListingsTopBar.remove($.menuButton);
	$.menuButton = null;
	$.saveViewButton = null;
	friendRequest();
	var adjFontSize = $.titleMyListingsLabel.font.fontSize.substr(0, $.titleMyListingsLabel.font.fontSize.length-2);
	if(args.length >= 12 && args.length <= 13) {
		adjFontSize = adjFontSize - 2;
	} else if(args.length >= 14 && args.length <= 15) {
		adjFontSize = adjFontSize - 3;
	} else if(args.length > 15) {
		var argsRegex = args.match(/([^\s]+)([\s])([^\s])/);
		args = argsRegex[0] + '.';
	}
	$.titleMyListingsLabel.font = {fontSize: adjFontSize, fontFamily: "Nunito-Bold"};
	$.titleMyListingsLabel.text = args;
	$.titleMyListingsUsername.text = argsUsername;
}


//------------------------------------------------FUNCTION-------------------------------------------------------------//


/**
 * @method genMyItems 
 * Generates the view for mylistings using 'myitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genMyItems(cb){
	if(loading) {
		return;
	}
	loading = true;
	queryObj.createdAt = paginateLastDate;
	listingManager.getUserListings(argsID, queryObj, function(err, userListings){
		if(err) {
			dynamicElement.defaultLabel('Uh oh, we are experiencing some issues retrieving listings. Fortunately, we are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, null);
		}
		userListings.listings.length > 0 ? paginateLastDate = userListings.listings[userListings.listings.length - 1].createdAt : '';
		userListings.listings.length < 30 ? endOfListings = true : endOfListings = false;
		if(userListings && userListings.listings.length > 0) {
			return cb(err, userListings.listings);		
		} else if (userListings && userListings.listings.length === 0 && Ti.App.Properties.getString('userId') === argsID && !loadMoreItems ) {
			var labelText = isSold ? 'You don\'t have any sold items.  List some stuff so the cash starts flowing in!' : 'Wait what! You don\'t have any listings?  Add some now so you can start making money!';
			dynamicElement.defaultLabel(labelText, function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, userListings.listings);
		} else if (userListings && userListings.listings.length === 0 && !loadMoreItems) {
			dynamicElement.defaultLabel('Sorry, It looks like this user doesn\'t have any listings!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			return cb(err, userListings.listings);
		}
		return cb(err, userListings.listings);		
	});
};





/**
 * @method transform 
 * Generates the view for myListings using 'myListingsListView' as the defacto template.
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
	        		borderWidth: item.isSold ? '5dp' : '1dp',
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
	            	text: item.isSold ? "SOLD" : item.imageUrls.length > 1 ? item.imageUrls.length + " Images" : item.imageUrls.length + " Image"	,
        			font: item.isSold ? {fontFamily: 'Nunito-Bold', fontSize: myListingFontSize } : {fontFamily: 'Nunito-Light', fontSize: myListingFontSize } ,
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
			template: 'myListingsTemplate2'
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
		genMyItems(function(err, items){
			var lvmc = require('com.falkolab.lvmc');
			var section = lvmc.wrap($.getView('myListingsListView').sections[0]);
	
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
        myListingsItemHeight = height/dpi*160;
        myListingsItemWidth = width/dpi*160;
    }
    
    return {
    	width: myListingsItemWidth,
    	height: myListingsItemHeight
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
 * @method listingItemClick 
 * Targets myListing item that was clicked on from ListView and passes data to openListing function
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
	Alloy.Globals.openPage('viewlisting', {
		itemId: listingIDs.itemId,
		userId: listingIDs.userId
	});	
};


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	Alloy.Globals.closePage('mylistings');
};



/**
 * @private friendRequest
 *  Adds/removes friend to/from user
 */
function friendRequest() {
	if($.friendRequestView.children.length > 0){
		$.friendRequestView.remove($.friendRequestView.children[0]);
	};
	
	var hiddenView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: heightIconView,
		data: argsFriend,
		borderRadius: dataBorderRadius,
		borderColor: '#E5E5E5',
		top: friendIconTop,
		backgroundColor: '#FFF',
		right: rightIconView
	});
	$.friendRequestView.add(hiddenView);
	if(argsFriend.length > 0 && (argsFriend[0].status === 'approved' || (argsFriend[0].status === 'pending' && argsFriend[0].userFrom === Ti.App.Properties.getString('userId')) ) ) {
		var checkSquare = Titanium.UI.createLabel({
			top: checkmarkTop,
			left: checkmarkLeft,
			font: {
				fontFamily : "FontAwesome",
            	fontSize: myTopBarFontSize
        	},
			color: "#FFF",
			id: 'friendRequestButton',
			text: determineStatus(argsFriend),
			touchEnabled: false
		});
		hiddenView.add(checkSquare);
		hiddenView.backgroundColor = '#1BA7CD';
	} else {
		var plusSquare = Titanium.UI.createLabel({
			top: checkmarkTop,
			left: checkmarkLeft,
			font: {
				fontFamily : "FontAwesome",
	            fontSize: myTopBarFontSize
	        },
			color: "#1BA7CD",
			id: 'friendRequestButton',
			text: '\uf234  Add   ',
			touchEnabled: false
		});
		hiddenView.add(plusSquare);
	}
	hiddenView.addEventListener('click', function(e) {
			if(e.source.data.length <= 0) {
				friendRequestDynamic(e, 'pending');
			} else if(e.source.data[0].status === 'denied') {
				friendRequestDynamic(e, 'pending');
			} else if(e.source.data[0].status === 'pending' && e.source.data[0].userTo === Ti.App.Properties.getString('userId')) {
				friendRequestDynamic(e, 'approved');
			} else if(e.source.data[0].status === 'pending' && e.source.data[0].userFrom === Ti.App.Properties.getString('userId') ) {
				friendRequestDynamic(e, 'denied');
			} else if(e.source.data[0].status === 'approved') {
				friendRequestDynamic(e, 'denied');
			}
		});
	return;
}



/**
 * @method friendRequestDynamic
 * @param {Object} e is the clicked object returned by Appcelerator
 * @param {String} newStatus Stringed status that invitation should be updated to
 * Returns friend invitation and corresponding icon to be displayed
 */
function friendRequestDynamic(e, newStatus){
	var createInvitationObject = {
			userFrom: Ti.App.Properties.getString('userId'),
			userTo: argsID,
			status: newStatus,
	};
	e.source.remove(e.source.children[0]);
	if(e.source.data.length <= 0) {
		friendsManager.createFriendInvitation( createInvitationObject, function(err, createInviteResult) {
			if(err) {
				return;
			} else {
				var checkSquare = Ti.UI.createLabel({
					top: checkmarkTop,
					left: checkmarkLeft,
					font: {
						fontFamily : "FontAwesome",
		            	fontSize: myTopBarFontSize
		        	},
					color: "#FFF",
					id: 'friendRequestButton',
					text: '\uf00c  Pending   ',
					touchEnabled: false,
				});
				e.source.data = [createInviteResult.invitation];
				e.source.add(checkSquare);
				e.source.backgroundColor = "#1BA7CD";
			}
		});
	} else if(newStatus === 'denied') {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.data[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			} else {
				var plusSquare = Ti.UI.createLabel({
					top: checkmarkTop,
					left: checkmarkLeft,
					font: {
						fontFamily : "FontAwesome",
			            fontSize: myTopBarFontSize
			        },
					color: "#1BA7CD",
					id: 'friendRequestButton',
					text:  '\uf234  Add   ',
					touchEnabled: false
				});
				e.source.data = updateInvitationResult.invitation;
				e.source.add(plusSquare);
				e.source.backgroundColor = "#FFF";
			}
		});
	} else {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.data[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			} else {
				var checkSquare = Ti.UI.createLabel({
					top: checkmarkTop,
					left: checkmarkLeft,
					font: {
						fontFamily : "FontAwesome",
		            	fontSize: myTopBarFontSize
		        	},
					color: "#FFF",
					id: 'friendRequestButton',
					text: newStatus === 'approved' ? '\uf00c  Added   ' : '\uf00c  Pending   ',
					touchEnabled: false,
				});
				e.source.data = updateInvitationResult.invitation;
				e.source.add(checkSquare);
				e.source.backgroundColor = "#1BA7CD";
			}
		});
	}
}


/**
 * @method soldItems
 * @param {Object} e is the clicked object returned by Appcelerator
 * Reloads the table with items that were sold or all your unsold items
 */
function soldItems(e) {
	if ($.myListingsButtonSaveIcon.itsOn == false) {
		isSold = false;
        $.myListingsButtonSaveIcon.itsOn = true;
        $.myListingsButtonSaveIcon.title = 'Sold';
        $.myListingsButtonSaveIcon.font = {iconPosition:'append', fontSize: mySoldFontSize};
        $.fa.change($.myListingsButtonSaveIcon, "fa-square-o");
        paginateLastDate = '';
        loadMoreItems = false;
        endOfListings = false;
        queryObj.isSold = false;
        $.defaultView.height= '0dp';
		if($.defaultView.children.length > 0) {
			$.defaultView.remove($.defaultView.children[0]);	
		}
        $.activityIndicator.show();
        $.activityIndicator.height = Ti.UI.FILL;
        init();
    } else {
    	isSold = true;
	    $.myListingsButtonSaveIcon.itsOn = false;
	    $.myListingsButtonSaveIcon.title = 'Sold';
	    $.myListingsButtonSaveIcon.font = {iconPosition:'append', fontSize: mySoldFontSize};
	    $.fa.change($.myListingsButtonSaveIcon, "fa-check-square");
	    paginateLastDate = '';
	    loadMoreItems = false;
	    endOfListings = false;
	    queryObj.isSold = true;
	    $.defaultView.height= '0dp';
		if($.defaultView.children.length > 0) {
			$.defaultView.remove($.defaultView.children[0]);	
		}
	    $.activityIndicator.show();
		$.activityIndicator.height = Ti.UI.FILL;
	    init();
   	}
}


/**
 * @method determineStatus
 * @param {Array} invitation is the invitation object returned by Selbi
 * Determines invitation status for dynamic fontawesome elements
 */
function determineStatus(invitation) {
	if (invitation.length <= 0) {
		return '\uf067  Add   ';
	} else if (invitation[0].status === 'denied') {
		return '\uf067  Add   ';
	} else if (invitation[0].status === 'pending' && invitation[0].userTo === Ti.App.Properties.getString('userId')) {
		return '\uf067  Add   ';
	} else if (invitation[0].status === 'pending' && invitation[0].userFrom === Ti.App.Properties.getString('userId')) {
		return '\uf00c  Pending   ';
	} else if (invitation[0].status === 'approved') {
		return '\uf00c  Added   ';
	}
};

//-------------------------------------------Initializing Views/Styles----------------------------------------------------//


/**
 * @method init 
 * Initiates the grid on page load for myListings listings.
 */
function init() {
	genMyItems(function(err, items){
		if($ && $.activityIndicator) {
			var lvmc = require('com.falkolab.lvmc');
			var section = lvmc.wrap($.getView('myListingsListView').sections[0]);
			var transformed = transform(items, 2, section.getItems().length);
			section.setItems(transformed);
			loading = false;
			if ($.is && !endOfListings) {
				$.is.init($.getView('myListingsListView'));
				$.is.mark();
			} else if($.is && endOfListings){
				$.is.init($.getView('myListingsListView'));
				$.is.cleanup();
			}
			$.activityIndicator.hide();
			$.activityIndicator.height = '0dp';
		}
	});
};

init();




/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off();
	$.destroy();
	$.fa = null;
}



/*-------------------------------------------------Event Listeners---------------------------------------------------*/

//Event listener to swap checked icon vs empty box icon for items sold under 'mylistings'
$.myListingsButtonSaveIcon.addEventListener('click', soldItems);


exports.cleanup = function () {
	clearProxy();
	Alloy.Globals.removeChildren($.myListingsView);
	$.myListingsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};
