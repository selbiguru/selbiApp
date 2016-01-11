var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {},
	argsFriend = arguments[0][2] || false;
var listingManager = require('managers/listingmanager'),
	helpers = require('utilities/helpers'),
	friendsManager = require('managers/friendsmanager'),
	dynamicElement = require('utilities/dynamicElement');
var myListingPadding, myListingItemHeight,
	myListingFontSize, myTopBarFontSize;
var items = [],
	obj = [];
var paginateLastDate = '';
var endOfListings = false;
var stopScroll = true;
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
        myListingPadding = 7;
        myListingItemHeight = 45;
        myListingFontSize = '12dp';
        myTopBarFontSize = '13dp';
        break;
    case 1: //iphoneFive
        myListingPadding = 7;
        myListingItemHeight = 45;
        myListingFontSize = '12dp';
        myTopBarFontSize = '13dp';
        break;
    case 2: //iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 49;
        myListingFontSize = '14dp';
        myTopBarFontSize = '15dp';
        break;
    case 3: //iphoneSixPlus
        myListingPadding = 13;
        myListingItemHeight = 49;
        myListingFontSize = '15dp';
        myTopBarFontSize = '16dp';
        break;
    case 4: //android currently same as iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 47;
        myListingFontSize = '14dp';
        myTopBarFontSize = '15dp';
        break;
};






$.activityIndicator.show();
if(tabView === 1 || Ti.App.Properties.getString('userId') === argsID) {
	$.myListingsTopBar.remove($.backViewButton);
	$.friendRequestView.hide();
	$.titleMyListingsLabel.text = "My Listings";
} else {
	$.myListingsTopBar.remove($.menuButton);
	friendRequest();
	$.titleMyListingsLabel.text = args;
}
genMyItems(function(err, items){

});

//------------------------------------------------FUNCTION-------------------------------------------------------------//


/**
 * @method genMyItems 
 * Generates the view for mylistings using 'myitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genMyItems(cb){
	items = [];
	queryObj.createdAt = paginateLastDate;
	listingManager.getUserListings(argsID, queryObj, function(err, userListings){
		userListings.listings.length > 0 ? paginateLastDate = userListings.listings[userListings.listings.length - 1].createdAt : '';
		userListings.listings.length < 30 ? endOfListings = true : '';
		var listItems = [];	
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading listings!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(userListings && userListings.listings.length > 0) {
			for(var listing in userListings.listings) {
				if(userListings.listings[listing].imageUrls){
					var view = Alloy.createController('myitemtemplate');
					var imageUrl = userListings.listings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.mylistView + Alloy.CFG.cloudinary.bucket + userListings.listings[listing].imageUrls[0] : "";
					var tmp = {
						image :  imageUrl,
						listingItem:{
			        		borderColor: userListings.listings[listing].isSold ? "#1BA7CD" : "#E5E5E5",
			        		borderWidth: userListings.listings[listing].isSold ? '3dp' : '1dp'
			        	},
			            listingThumb : {
			                image :  imageUrl
			            },
			            listingTitle : {
			                text : userListings.listings[listing].title,
			                color: userListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			            },
			            listingPrice: {
			            	text: userListings.listings[listing].price.formatMoney(2),
			            	color: userListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			            },
			            listingImagesCount: {
			            	text: userListings.listings[listing].isSold ? "SOLD" : userListings.listings[listing].imageUrls.length > 1 ? "+" + userListings.listings[listing].imageUrls.length + " Images" : userListings.listings[listing].imageUrls.length + " Image"	,
		        			font: userListings.listings[listing].isSold ? {fontFamily: 'Nunito-Bold', fontSize: myListingFontSize } : {fontFamily: 'Nunito-Light', fontSize: myListingFontSize } ,
		        			color: userListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			            },  
			            template: 'myitemtemplate',
			            properties: {
			            	itemId: userListings.listings[listing].id,
			            	userName: userListings.firstName +" "+ userListings.lastName,
			            	userId: userListings.listings[listing].user,
			            	isSold: userListings.listings[listing].isSold
			            }
			        };
			        view.updateViews({
			        	'#listingItem':{
			        		borderColor: userListings.listings[listing].isSold ? "#1BA7CD" : "#E5E5E5",
			        		borderWidth: userListings.listings[listing].isSold ? '3dp' : '1dp'
			        	},
			        	'#listingThumb':{
			        		image: imageUrl
			        	},
			        	'#listingTitle': {
			        		text: helpers.alterTextFormat(userListings.listings[listing].title, 14, true),
			        		color: userListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			        	},
			        	'#listingPrice':{ 
			        		text: userListings.listings[listing].price.formatMoney(2),
			        		color: userListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"	

		        		},
		        		'#listingImagesCount':{ 
			        		text: userListings.listings[listing].isSold ? "SOLD" : userListings.listings[listing].imageUrls.length > 1 ? "+" + userListings.listings[listing].imageUrls.length + " Images" : userListings.listings[listing].imageUrls.length + " Image"	,
		        			font: userListings.listings[listing].isSold ? {fontFamily: 'Nunito-Bold', fontSize: myListingFontSize } : {fontFamily: 'Nunito-Light', fontSize: myListingFontSize } ,
		        			color: userListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
		        		}
			        });
			        
			        lView = view.getView();
					listItems.push(tmp);
					items.push({
				        view: lView,
				        data: tmp
				    });
				    obj.push(lView);
				}
			}
			
			//ADD ALL THE ITEMS TO THE GRID
			$.fg.addGridItems(items);
			
		} else if (userListings && userListings.listings.length === 0 && Ti.App.Properties.getString('userId') === argsID) {
			dynamicElement.defaultLabel('Wait what! You don\'t have any listings!  Add some now so you can start making money!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if (userListings && userListings.listings.length === 0) {
			dynamicElement.defaultLabel('Sorry, It looks like this user doesn\'t have any listings!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		}
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
		cb(err, listItems);	
	});
};




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
		height: Ti.UI.SIZE,
		data: argsFriend
	});
	$.friendRequestView.add(hiddenView);
	if(argsFriend.length > 0 && (argsFriend[0].status === 'approved' || (argsFriend[0].status === 'pending' && argsFriend[0].userFrom === Ti.App.Properties.getString('userId')) ) ) {
		var checkSquare = Titanium.UI.createLabel({
			font: {
            	fontSize: myTopBarFontSize
        	},
			color: "#1BA7CD",
			id: 'friendRequestButton',
			text: argsFriend[0].status === 'approved' ? 'Friends' : 'Pending',
			touchEnabled: false
		});
		$.fa.add(checkSquare, 'fa-check-square');
		hiddenView.add(checkSquare);
	} else {
		var plusSquare = Titanium.UI.createLabel({
			font: {
	            fontSize: myTopBarFontSize
	        },
			color: "#1BA7CD",
			id: 'friendRequestButton',
			text: 'Add',
			touchEnabled: false
		});
		$.fa.add(plusSquare, 'fa-plus-square-o');
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
					font: {
		            	fontSize: myTopBarFontSize
		        	},
					color: "#1BA7CD",
					id: 'friendRequestButton',
					text: 'Pending',
					touchEnabled: false
				});
				e.source.data = [createInviteResult.invitation]; 
				$.fa.add(checkSquare, 'fa-check-square');
				e.source.add(checkSquare);
			}
		});
	} else if(newStatus === 'denied') {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.data[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			} else {
				var plusSquare = Ti.UI.createLabel({
					font: {
			            fontSize: myTopBarFontSize
			        },
					color: "#1BA7CD",
					id: 'friendRequestButton',
					text: 'Add',
					touchEnabled: false
				});
				e.source.data = updateInvitationResult.invitation;
				$.fa.add(plusSquare, 'fa-plus-square-o');
				e.source.add(plusSquare);
			}
		});
	} else {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.data[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			} else {
				var checkSquare = Ti.UI.createLabel({
					font: {
		            	fontSize: myTopBarFontSize
		        	},
					color: "#1BA7CD",
					id: 'friendRequestButton',
					text: updateInvitationResult.invitation[0].status === 'approved' ? 'Friends' : 'Pending',
					touchEnabled: false
				});
				e.source.data = updateInvitationResult.invitation; 
				$.fa.add(checkSquare, 'fa-check-square');
				e.source.add(checkSquare);
			}
		});
	}
}




//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

$.fg.init({
    columns: 2,
    space: myListingPadding,
    gridBackgroundColor:'#FAFAFA',
    itemHeightDelta: myListingItemHeight,
    itemBackgroundColor:'#FAFAFA',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});
$.fg.setOnItemClick(function(e){
    openListing({
    	itemId:e.source.data.properties.itemId,
    	userId:e.source.data.properties.userId,	
    	userName:e.source.data.properties.userName,
    	isSold: e.source.data.properties.isSold	
    });
});



$.scrollViewMyListings.addEventListener('scroll', infitineScroll);

/**
 * @method infitineScroll
 * Determines when to load more items on scrolling for User's items
 */
function infitineScroll(e) {
	if(!endOfListings) {
		var tolerance = 450;
		if((e.source.children[0].getRect().height - tolerance) <= ($.scrollViewMyListings.getRect().height + e.y) && stopScroll){
			stopScroll = false;
		   //$.scrollViewMyListings.scrollingEnabled = false;
			genMyItems(function(err, itemsResponse) {
				stopScroll = true;
				//$.scrollViewMyListings.scrollingEnabled = true;
			});
		}	
	}
}