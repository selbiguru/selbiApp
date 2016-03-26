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
var paginateLastDate = '';
var endOfListings = false;
var stopScroll = true;


$.activityIndicator.show();
$.titleFriendsListingsLabel.text = "Friends Listings";
genFriendsItems(function(err, items){

});

//------------------------------------------------FUNCTION-------------------------------------------------------------//






/**
 * @method genFriendsItems 
 * Generates the view for friends using 'friendsitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genFriendsItems(cb){
	items = [];
	dateObj = {
		updatedAt: paginateLastDate
	};
	listingManager.getFriendsListings(argsID, dateObj, function(err, friendsListings){
		friendsListings.length > 0 ? paginateLastDate = friendsListings[friendsListings.length - 1].updatedAt : '';
		friendsListings.length < 30 ? endOfListings = true : endOfListings = false;
		var listItems = [];
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading your friend\'s listings!  We are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(friendsListings && friendsListings.length > 0) {
			for(var listing in friendsListings) {
				if(friendsListings[listing].listings[0].imageUrls){
					var view = Alloy.createController('userTwoColumnTemplate');
					var imageUrl = friendsListings[listing].listings[0].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].friendlistView + Alloy.CFG.cloudinary.bucket + friendsListings[listing].listings[0].imageUrls[0] : "";
					var profileImage = friendsListings[listing].profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + friendsListings[listing].profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
					var tmp = {
						image :  imageUrl,
			            usaListingThumb : {
			                image :  imageUrl
			            },
			            usaImageThumb : {
			                image : profileImage
			            },
			            usaListingName: {
			            	text: (friendsListings[listing].firstName +" "+ friendsListings[listing].lastName).match(/([^\s]+)([\s])([^\s])/)[0]
			            },
			            usaListingNumber: {
			            	text: friendsListings[listing].count > 1 ? friendsListings[listing].count + " Listings" : friendsListings[listing].count + " Listing"
			            },  
			            template: 'userTwoColumnTemplate',
			            properties: {
			            	userId: friendsListings[listing].id,
			            	userName: friendsListings[listing].firstName +" "+ friendsListings[listing].lastName,
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
			        		text: (friendsListings[listing].firstName +" "+ friendsListings[listing].lastName).length > 14 ? helpers.alterTextFormat((friendsListings[listing].firstName +" "+ friendsListings[listing].lastName).match(/([^\s]+)([\s])([^\s])/)[0], 13, false) : friendsListings[listing].firstName +" "+ friendsListings[listing].lastName
		        		},
		        		'#usaListingNumber':{ 
			        		text: friendsListings[listing].count > 1 ? friendsListings[listing].count + " Listings" : friendsListings[listing].count + " Listing"	
		        		}
			        });
			        
			        
					//listItems.push(tmp);
					items.push({
				        view: view.getView(),
				        data: tmp
				    });
				    obj.push('not');
				   // lView.getView().close();
				    //lView = null;
				    view = null;
				}
			}
			
			//ADD ALL THE ITEMS TO THE GRID
			$.fg.addGridItems(items);
			
		} else {
			dynamicElement.defaultLabel('It\'s easier to use Selbi with a network of friends. Go to Friends under the menu to add more friends!', function(err, results) {
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
 * @method infitineScroll
 * Determines when to load more items on scrolling for SelbiUSA items
 */
function infitineScroll(e) {
	if(!endOfListings) {
		var tolerance = 450;
		if((e.source.children[0].getRect().height - tolerance) <= ($.scrollViewFriends.getRect().height + e.y) && stopScroll){
			stopScroll = false;
			genFriendsItems(function(err, peace) {
				stopScroll = true;
			});
		}	
	}
}


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
	$.scrollViewFriends.removeEventListener('scroll', infitineScroll);
	$.friendsListingsView.removeEventListener('click', blurTextField);
	$.usernameSearch.removeEventListener('return', keyboardSearch);
};


/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	console.log('boog boog boog boog ', e);
	$.off();
	$.destroy();
	removeEventListeners();
	if(e !== 'mylistings') {
		this.removeEventListener('click', clearProxy);	
	}
	$.fg.clearGrid();
	for(var i in items) {
		items[i].view = null;
		items[i].data = null;
	};
	
	console.log('solve anything yet?^ ', e);
	$.friendsListingsView.parent.parent.children[0].removeEventListener('click', clearProxy);
}


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




/*-------------------------------------------------Event Listeners---------------------------------------------------*/


$.scrollViewFriends.addEventListener('scroll', infitineScroll);
$.friendsListingsView.addEventListener('click', blurTextField);
$.usernameSearch.addEventListener('return', keyboardSearch);

//$.friendsListingsView.addEventListener('click', function(e) {
	//$.friendsListingsView.parent.parent.children[0].addEventListener('click', clearProxy);
//});

exports.cleanup = function () {
	Ti.API.info('Cleaning friendlisting');
	clearProxy('mylistings');
	Alloy.Globals.removeChildren($.friendsListingsView);
	$.friendsListingsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};

