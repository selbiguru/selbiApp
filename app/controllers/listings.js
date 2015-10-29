var args = arguments[0] || {};
var listingManager = require('managers/listingmanager'),
	helper = require('utilities/helpers');
var myListingPadding, myListingItemHeight,
	friendsPadding, friendsItemHeight,
	selbiUSAPadding, selbiUSAItemHeight;
var items = [],
	obj = [];
var tabsObject = Object.freeze({
	'mylistings': 1,
	'friends': 2,
	'selbiUSA': 3
});
var tabView = tabsObject[args];
console.log("this is the user i need ", Alloy.Globals.currentUser.attributes)
/*var control = Ti.UI.createRefreshControl({
    tintColor:'#1BA7CD'
});
control.addEventListener('refreshstart',function(e){
	console.log("used 2");
    Ti.API.info('refreshstart');
    genItems(function(err, items){
		listingSection.setItems(items);
		control.endRefreshing();
	});
});*/

//var listingSection = Ti.UI.createListSection({ headerTitle: ''});
/*genItems(function(err, items){
	console.log("used 3");
	//listingSection.setItems(items);
});

//var parentWindow = Titanium.UI.currentWindow;
// $.menuButton.addEventListener('click', function(){
	// console.log("menu button click", parentWindow);
	// Titanium.API.currentTabGroup.getActiveTab().close();
// });

//$.listingListView.sections = [listingSection];
//$.listingListView.refreshControl = control;
//$.listingListView.addEventListener('itemclick', itemClickListener);*/


/*function itemClickListener(e){
	console.log("used 4");
	 var item = listingSection.getItemAt(e.itemIndex);
	 openListing(item.properties.itemId);
}*/
if(tabView === 1) {
	genMyItems(function(err, items){
		console.log("used 3");
	});
} else if(tabView === 2) {
	genFriendsItems(function(err, items){
		console.log("used 7");
	});
} else {
	genUSAItems(function(err, items){
		console.log("used 8");
	});
}

//------------------------------------------------FUNCTION-------------------------------------------------------------//


/**
 * @method genMyItems 
 * Generates the view for mylistings using 'myitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genMyItems(cb){
	console.log("used 5");
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		var listItems = [];		
		//console.log("listing%%%%% ", userListings);
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('myitemtemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.mylistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
				var tmp = {
					image :  imageUrl,
		            listingThumb : {
		                image :  imageUrl
		            },
		            listingTitle : {
		                text : userListings[listing].title
		            },
		            listingPrice: {
		            	text: userListings[listing].price.formatMoney(2)
		            },
		            listingImagesCount: {
		            	text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Images" : userListings[listing].imageUrls.length + " Image"
		            },  
		            template: 'myitemtemplate',
		            properties: {
		            	itemId: userListings[listing].id
		            }
		        };
		        view.updateViews({
		        	'#listingThumb':{
		        		image: imageUrl
		        	},
		        	'#listingTitle': {
		        		text: helper.alterTextFormat(userListings[listing].title, 14, true)
		        	},
		        	'#listingPrice':{ 
		        		text: userListings[listing].price.formatMoney(2)	
	        		},
	        		'#listingImagesCount':{ 
		        		text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Images" : userListings[listing].imageUrls.length + " Image"	
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
			
			//ADD ALL THE ITEMS TO THE GRID
			$.fg.addGridItems(items);
			
		}	
		cb(err, listItems);	
	});
};





/**
 * @method genFriendsItems 
 * Generates the view for friends using 'friendsitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genFriendsItems(cb){
	console.log("used 9");
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('friendsitemtemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.friendlistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
				var practiceImage = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage : "";
				var tmp = {
					image :  imageUrl,
		            friendsListingThumb : {
		                image :  imageUrl
		            },
		            friendsImageThumb : {
		                image : practiceImage
		            },
		            friendsListingName: {
		            	text: Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName
		            },
		            friendsListingNumber: {
		            	text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Listings" : userListings[listing].imageUrls.length + " Listing"
		            },  
		            template: 'friendsitemtemplate',
		            properties: {
		            	userId: userListings[listing].user
		            }
		        };
		        view.updateViews({
		        	'#friendsListingThumb':{
		        		image: imageUrl
		        	},
		        	'#friendsImageThumb': {
		        		image: practiceImage
		        	},
		        	'#friendsListingName':{ 
		        		text: helper.alterTextFormat(Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName, 20, false)	
	        		},
	        		'#friendsListingNumber':{ 
		        		text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Listings" : userListings[listing].imageUrls.length + " Listing"	
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
			
			//ADD ALL THE ITEMS TO THE GRID
			$.fg.addGridItems(items);
			
		}	
		cb(err, listItems);	
	});
};







/**
 * @method genUSAItems 
 * Generates the view for friends using 'usaitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genUSAItems(cb){
	console.log("used 10");
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('usaitemtemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.mylistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
				var practiceImage = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage : "";
				var tmp = {
					image :  imageUrl,
		            usaListingThumb : {
		                image :  imageUrl
		            },
		            usaImageThumb : {
		                image : practiceImage
		            },
		            usaListingName: {
		            	text: Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName
		            },
		            usaListingNumber: {
		            	text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Listings" : userListings[listing].imageUrls.length + " Listing"
		            },  
		            template: 'usaitemtemplate',
		            properties: {
		            	userId: userListings[listing].user
		            }
		        };
		        view.updateViews({
		        	'#usaListingThumb':{
		        		image: imageUrl
		        	},
		        	'#usaImageThumb': {
		        		image: practiceImage
		        	},
		        	'#usaListingName':{ 
		        		text: helper.alterTextFormat(Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName, 12, false)
	        		},
	        		'#usaListingNumber':{ 
		        		text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Listings" : userListings[listing].imageUrls.length + " Listing"	
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
			
			//ADD ALL THE ITEMS TO THE GRID
			$.fg.addGridItems(items);
			
		}	
		cb(err, listItems);	
	});
};





/**
 * @method openListing 
 * Opens viewlisting view and shows the targeted item that was clicked on
 * @param {String} listingId ListingId of the item
 */
function openListing(listingId){
	console.log("used 6", typeof listingId);
	Alloy.Globals.openPage('viewlisting', {id: listingId});
};








//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        myListingPadding = 7;
        myListingItemHeight = 45;
        friendsPadding = 10;
        friendsItemHeight = -45;
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        break;
    case 1: //iphoneFive
        myListingPadding = 7;
        myListingItemHeight = 45;
        friendsPadding = 10;
        friendsItemHeight = -45;
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        break;
    case 2: //iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 49;
        friendsPadding = 10;
        friendsItemHeight = -50;
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 49;
        break;
    case 3: //iphoneSixPlus
        myListingPadding = 13;
        myListingItemHeight = 49;
        friendsPadding = 13;
        friendsItemHeight = -49;
        selbiUSAPadding = 13;
        selbiUSAItemHeight = 54;
        break;
    case 4: //android currently same as iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 47;
        friendsPadding = 10;
        friendsItemHeight = -50;
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 47;
        break;
};
$.fg.init({
    columns: tabView === 2 ? 1 : 2,
    space: tabView === 1 ? myListingPadding : tabView === 2 ? friendsPadding : selbiUSAPadding,
    gridBackgroundColor:'#FAFAFA',
    itemHeightDelta: tabView === 1 ? myListingItemHeight : tabView === 2 ? friendsItemHeight : selbiUSAItemHeight,
    itemBackgroundColor:'#FAFAFA',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});
$.fg.setOnItemClick(function(e){
	console.log("used 1", e.source.data);
    openListing(e.source.data.properties.itemId);
});