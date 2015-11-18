var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {},
	argsFriend = arguments[0][2] || false;
var listingManager = require('managers/listingmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var myListingPadding, myListingItemHeight,
	myListingFontSize, myTopBarFontSize;
var items = [],
	obj = [];
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
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading listings!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(userListings && userListings.listings.length > 0) {
			console.log("Does this work?", myTopBarFontSize, myListingFontSize);
			for(var listing in userListings.listings) {
				if(userListings.listings[listing].imageUrls){
					var view = Alloy.createController('myitemtemplate');
					var imageUrl = userListings.listings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.mylistView + Alloy.CFG.cloudinary.bucket + userListings.listings[listing].imageUrls[0] : "";
					var tmp = {
						image :  imageUrl,
						listingItem:{
			        		borderColor: userListings.listings[listing].isSold ? "#1BA7CD" : "#E5E5E5" 
			        	},
			            listingThumb : {
			                image :  imageUrl
			            },
			            listingTitle : {
			                text : userListings.listings[listing].title
			            },
			            listingPrice: {
			            	text: userListings.listings[listing].price.formatMoney(2)
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
			        		borderColor: userListings.listings[listing].isSold ? "#1BA7CD" : "#E5E5E5" 
			        	},
			        	'#listingThumb':{
			        		image: imageUrl
			        	},
			        	'#listingTitle': {
			        		text: helpers.alterTextFormat(userListings.listings[listing].title, 14, true)
			        	},
			        	'#listingPrice':{ 
			        		text: userListings.listings[listing].price.formatMoney(2)	
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
	console.log("what is happening here?", myTopBarFontSize, myListingFontSize);
	if(argsFriend) {
		var unfriendLabel = Titanium.UI.createLabel({
			font: {
            	fontSize: myTopBarFontSize
        	},
			color: "#1BA7CD",
			id: 'friendRequestButton',
			text: 'Unfriend',
			data: true
		});
		$.fa.add(unfriendLabel, 'fa-check-square');
		unfriendLabel.addEventListener('click', function(e) {
			friendRequest();
		});
		$.friendRequestView.add(unfriendLabel);
		argsFriend = false;
	} else {
		var friendLabel = Titanium.UI.createLabel({
			font: {
	            fontSize: myTopBarFontSize
	        },
			color: "#1BA7CD",
			id: 'friendRequestButton',
			text: 'Friend',
			data: false
		});
		$.fa.add(friendLabel, 'fa-plus-square-o');
		friendLabel.addEventListener('click', function(e) {
			friendRequest();
		});
		$.friendRequestView.add(friendLabel);
		argsFriend = true;
	}
	return;
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