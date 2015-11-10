var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	helpers = require('utilities/helpers');
var myListingPadding, myListingItemHeight;
var items = [],
	obj = [];
var tabsObject = Object.freeze({
	'mylistings': 1,
});
var tabView = tabsObject[args];
console.log("#################", args);
console.log("*******************", argsID);

if(tabView === 1) {
	$.closeUserView.hide();
	$.titleMyListingsLabel.text = "My Listings";
} else {
	$.closeUserView.show();
	$.titleMyListingsLabel.text = args;
}
genMyItems(function(err, items){
		if(err) {
			helpers.alertUser('Listings','Unable to get user listings, please try again later!');
			return;
		}
		console.log("used 19");
	});

//------------------------------------------------FUNCTION-------------------------------------------------------------//


/**
 * @method genMyItems 
 * Generates the view for mylistings using 'myitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genMyItems(cb){
	console.log("used 5");
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];
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
		            	itemId: userListings[listing].id,
		            	userName: Alloy.Globals.currentUser.attributes.firstName +" "+ Alloy.Globals.currentUser.attributes.lastName,
		            	userId: userListings[listing].user,
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
			
		} else if (userListings && userListings.length === 0) {
			helpers.alertUser('Sorry','It looks like this user doesn\'t have any listings!');
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
	console.log("used 6",listingIDs);
	Alloy.Globals.openPage('viewlisting', {
		itemId: listingIDs.itemId,
		userId: listingIDs.userId
	});	
};






//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        myListingPadding = 7;
        myListingItemHeight = 45;
        break;
    case 1: //iphoneFive
        myListingPadding = 7;
        myListingItemHeight = 45;
        break;
    case 2: //iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 49;
        break;
    case 3: //iphoneSixPlus
        myListingPadding = 13;
        myListingItemHeight = 49;
        break;
    case 4: //android currently same as iphoneSix
        myListingPadding = 10;
        myListingItemHeight = 47;
        break;
};
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
	console.log("used 1", e.source.data);
    openListing({
    	itemId:e.source.data.properties.itemId,
    	userId:e.source.data.properties.userId,	
    	userName:e.source.data.properties.userName,	
    });
});

$.closeUserView.addEventListener('click', function(e){
	Alloy.Globals.closePage('mylistings');
});