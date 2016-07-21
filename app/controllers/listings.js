var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	helpers = require('utilities/helpers');
var myListingPadding, myListingItemHeight,
	friendsPadding, friendsItemHeight,
	selbiUSAPadding, selbiUSAItemHeight;
var items = [],
	obj = [];
var tabsObject = Object.freeze({
	'mylistings': 1,
	'friendslistings': 2,
	'selbiusa': 3
});
var tabView = tabsObject[args];

if(tabView === 1) {
	$.closeUserView.hide();
	$.titleListingsLabel.text = "My Listings";
	genMyItems(function(err, items){
		if(err) {
			helpers.alertUser('Listings','Unable to get user listings, please try again later');
			return;
		}
	});
} else if(tabView === 2) {
	$.closeUserView.hide();
	$.titleListingsLabel.text = "Friends";
	genFriendsItems(function(err, items){
		if(err) {
			helpers.alertUser('Listings','Unable to get friend\'s listings, please try again later');
			return;
		}
	});
} else if(tabView === 3) {
	$.closeUserView.hide();
	$.titleListingsLabel.text = "USA Listings";
	genUSAItems(function(err, items){
		if(err) {
			helpers.alertUser('Listings','Unable to get USA listings, please try again later');
		}
	});
} else {
	$.closeUserView.show();
	$.titleListingsLabel.text = args;
	genMyItems(function(err, items){
		if(err) {
			helpers.alertUser('Listings','Unable to get user listings, please try again later');
			return;
		}
	});
}

//------------------------------------------------FUNCTION-------------------------------------------------------------//


/**
 * @method genMyItems 
 * Generates the view for mylistings using 'myitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genMyItems(cb){
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('myitemtemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].mylistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
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
		            	text: userListings[listing].imageUrls.length > 1 ? userListings[listing].imageUrls.length + " Images" : userListings[listing].imageUrls.length + " Image"
		            },  
		            template: 'myitemtemplate',
		            properties: {
		            	itemId: userListings[listing].id,
		            	userName: Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName
		            	//userId: userListings[listing].user,
		            }
		        };
		        view.updateViews({
		        	'#listingThumb':{
		        		image: imageUrl
		        	},
		        	'#listingTitle': {
		        		text: helpers.alterTextFormat(userListings[listing].title, 14, true)
		        	},
		        	'#listingPrice':{ 
		        		text: userListings[listing].price.formatMoney(2)	
	        		},
	        		'#listingImagesCount':{ 
		        		text: userListings[listing].imageUrls.length > 1 ? userListings[listing].imageUrls.length + " Images" : userListings[listing].imageUrls.length + " Image"	
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
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('userTwoColumnTemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].friendlistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
				var practiceImage = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].menu + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage : "";
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
		            template: 'userTwoColumnTemplate',
		            properties: {
		            	userId: userListings[listing].user,
		            	userName: Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName
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
		        		text: helpers.alterTextFormat(Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName, 12, false)
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
 * @method genUSAItems 
 * Generates the view for friends using 'usaitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genUSAItems(cb){
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('userTwoColumnTemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].friendlistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
				var practiceImage = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].menu + Alloy.CFG.cloudinary.bucket + Alloy.Globals.currentUser.attributes.profileImage : "";
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
		            template: 'userTwoColumnTemplate',
		            properties: {
		            	userId: userListings[listing].user,
		            	userName: Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName
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
		        		text: helpers.alterTextFormat(Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName, 12, false)
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
 * @param {Object} listingId Object containing listingId and userId for the item
 */
function openListing(listingIDs){
	Alloy.Globals.openPage('listings', [
		listingIDs.userName, listingIDs.userId
	]);
	
};






//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        myListingPadding = 7;
        myListingItemHeight = 45;
        friendsPadding = 7;//10; For 1 column layout
        friendsItemHeight = 45;//-45; For 1 column layout
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        break;
    case 1: //iphoneFive
        myListingPadding = 7;
        myListingItemHeight = 45;
        friendsPadding = 7;//10; For 1 column layout
        friendsItemHeight = 45;//-45; For 1 column layout
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        break;
    case 2: //iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 49;
        friendsPadding = 10;//10; For 1 column layout
        friendsItemHeight = 49;//-50; For 1 column layout
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 49;
        break;
    case 3: //iphoneSixPlus
        myListingPadding = 13;
        myListingItemHeight = 49;
        friendsPadding = 13;//13; For 1 column layout
        friendsItemHeight = 54;//-49; For 1 column layout
        selbiUSAPadding = 13;
        selbiUSAItemHeight = 54;
        break;
    case 4: //android currently same as iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 47;
        friendsPadding = 10;//10; For 1 column layout
        friendsItemHeight = 49;//-50; For 1 column layout
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 47;
        break;
};
$.fg.init({
    columns: tabView === 1 ? 2 : tabView === 2 ? 2 : 2,
    space: tabView === 1 ? myListingPadding : tabView === 2 ? friendsPadding : selbiUSAPadding,
    gridBackgroundColor:'#FAFAFA',
    itemHeightDelta: tabView === 1 ? myListingItemHeight : tabView === 2 ? friendsItemHeight : selbiUSAItemHeight,
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
    });
});

$.closeUserView.addEventListener('click', function(e){
	Alloy.Globals.closePage('listings');
});
