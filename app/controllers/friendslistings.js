var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	userManager = require('managers/usermanager'),
	friendsManager = require('managers/friendsmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var friendsPadding, friendsItemHeight;
var items = [],
	obj = [];


$.activityIndicator.show();
$.titleFriendsListingsLabel.text = "Friends";
genFriendsItems(function(err, items){

});

//------------------------------------------------FUNCTION-------------------------------------------------------------//






/**
 * @method genFriendsItems 
 * Generates the view for friends using 'friendsitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genFriendsItems(cb){
	listingManager.getFriendsListings(argsID, function(err, friendsListings){
		//console.log('!!!!!!! ', friendsListings);
		var listItems = [];
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading your friend\'s listings!  We are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(friendsListings && friendsListings.length > 0) {
			for(var listing in friendsListings) {
				if(friendsListings[listing].imageUrls){
					var view = Alloy.createController('userTwoColumnTemplate');
					var imageUrl = friendsListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.friendlistView + Alloy.CFG.cloudinary.bucket + friendsListings[listing].imageUrls[0] : "";
					var profileImage = friendsListings[listing].friend.profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + friendsListings[listing].friend.profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
					var tmp = {
						image :  imageUrl,
			            usaListingThumb : {
			                image :  imageUrl
			            },
			            usaImageThumb : {
			                image : profileImage
			            },
			            usaListingName: {
			            	text: friendsListings[listing].friend.firstName +" "+ friendsListings[listing].friend.lastName
			            },
			            usaListingNumber: {
			            	text: friendsListings[listing].counter.count > 1 ? friendsListings[listing].counter.count + " Listings" : friendsListings[listing].counter.count + " Listing"
			            },  
			            template: 'userTwoColumnTemplate',
			            properties: {
			            	userId: friendsListings[listing].user,
			            	userName: friendsListings[listing].friend.firstName +" "+ friendsListings[listing].friend.lastName,
			            	friends: friendsListings[listing].invitation
			            }
			        };
			        view.updateViews({
			        	'#usaListingThumb':{
			        		image: imageUrl
			        	},
			        	'#usaImageThumb': {
			        		image: profileImage
			        	},
			        	'#usaListingName':{ 
			        		text: helpers.alterTextFormat(friendsListings[listing].friend.firstName +" "+ friendsListings[listing].friend.lastName, 12, false)
		        		},
		        		'#usaListingNumber':{ 
			        		text: friendsListings[listing].counter.count > 1 ? friendsListings[listing].counter.count + " Listings" : friendsListings[listing].counter.count + " Listing"	
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
			
		} else {
			dynamicElement.defaultLabel('It\'s easier to use Selbi with a network of friends. Go to Contacts under the menu to add more friends!', function(err, results) {
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
 * @method findUserListings 
 * When button is clicked, finds user listings of entered username
 */
function findUserListings(){
	var uniqueUserRegEx = ($.usernameSearch.value.toLowerCase()).match(/^[a-zA-Z\d\_]+$/);
	if(uniqueUserRegEx === null) {
		helpers.alertUser('Oops','Usernames are only letters and numbers!');
		return;
	}
	if(helpers.trim($.usernameSearch.value, true).length < 6) {
		helpers.alertUser('Oops','Usernames are at least 6 letters long!');
		return;
	}
	var userNameSearchObj = {
		username: helpers.trim($.usernameSearch.value, true).toLowerCase()
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
 * @method openListing 
 * Opens viewlisting view and shows the targeted item that was clicked on
 * @param {Object} listingId Object containing listingId and userId for the item
 */
function openListing(listingIDs){
	//console.log("used 6",listingIDs);
	Alloy.Globals.openPage('mylistings', [
		listingIDs.userName, listingIDs.userId, listingIDs.friends
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
    openListing({
    	userId:e.source.data.properties.userId,	
    	userName:e.source.data.properties.userName,
    	friends:e.source.data.properties.friends,	
    });
});
