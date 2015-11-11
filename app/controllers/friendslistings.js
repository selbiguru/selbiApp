var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var friendsPadding, friendsItemHeight;
var items = [],
	obj = [];
	

console.log("#################", args);
console.log("*******************", argsID);

$.titleFriendsListingsLabel.text = "Friends";
genFriendsItems(function(err, items){
	if(err) {
		helpers.alertUser('Listings','Unable to get friend\'s listings, please try again later!');
		return;
	}
});

//------------------------------------------------FUNCTION-------------------------------------------------------------//






/**
 * @method genFriendsItems 
 * Generates the view for friends using 'friendsitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genFriendsItems(cb){
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading your friend\'s listings!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('userTwoColumnTemplate');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.friendlistView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
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
			
		} else {
			dynamicElement.defaultLabel('Your Friend\'s are not currently listing anything for sale.  We suggest adding more friends under \'Contacts\' in the menu, or check out what the rest of Selbi is selling under \'Selbi USA!\'', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
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
	Alloy.Globals.openPage('mylistings', [
		listingIDs.userName, listingIDs.userId
	]);
	
};






//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        friendsPadding = 7;//10; For 1 column layout
        friendsItemHeight = 45;//-45; For 1 column layout
        break;
    case 1: //iphoneFive
        friendsPadding = 7;//10; For 1 column layout
        friendsItemHeight = 45;//-45; For 1 column layout
        break;
    case 2: //iphoneSix
        friendsPadding = 10;//10; For 1 column layout
        friendsItemHeight = 49;//-50; For 1 column layout
        break;
    case 3: //iphoneSixPlus
        friendsPadding = 13;//13; For 1 column layout
        friendsItemHeight = 54;//-49; For 1 column layout
        break;
    case 4: //android currently same as iphoneSix
        friendsPadding = 10;//10; For 1 column layout
        friendsItemHeight = 49;//-50; For 1 column layout
        break;
};
$.fg.init({
    columns: 2,
    space: friendsPadding,
    gridBackgroundColor:'#FAFAFA',
    itemHeightDelta: friendsItemHeight,
    itemBackgroundColor:'#FAFAFA',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});
$.fg.setOnItemClick(function(e){
	console.log("used 1", e.source.data);
    openListing({
    	userId:e.source.data.properties.userId,	
    	userName:e.source.data.properties.userName,	
    });
});
