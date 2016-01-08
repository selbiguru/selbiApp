var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	userManager = require('managers/usermanager'),
	friendsManager = require('managers/friendsmanager'),
	modalManager = require('managers/modalmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var	selbiUSAPadding, selbiUSAItemHeight;
var items = [],
	obj = [];
var paginateLastDate = '';
var endOfListings = false;
var stopScroll = true;

$.activityIndicator.show();
$.titleSelbiUSALabel.text = "Selbi USA";
genUSAItems(function(err, items){

});

//------------------------------------------------FUNCTION-------------------------------------------------------------//



/**
 * @method genUSAItems 
 * Generates the view for friends using 'usaitemtemplates' as the defacto template.
 * @param {Function} cb Callback function
 */
function genUSAItems(cb){
	items = [];
	var dateObj = {
		updatedAt: paginateLastDate
	};
	listingManager.getSelbiListings(argsID, dateObj, function(err, selbiListings){
		selbiListings.length > 0 ? paginateLastDate = selbiListings[selbiListings.length - 1].updatedAt : '';
		selbiListings.length < 30 ? endOfListings = true : '';
		var listItems = [];	
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading all the USA listings! We are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(selbiListings && selbiListings.length > 0) {
			for(var listing in selbiListings) {
				if(selbiListings[listing].listings[0].imageUrls){
					var view = Alloy.createController('userTwoColumnTemplate');
					var imageUrl = selbiListings[listing].listings[0].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.friendlistView + Alloy.CFG.cloudinary.bucket + selbiListings[listing].listings[0].imageUrls[0] : "";
					var profileImage = selbiListings[listing].profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + selbiListings[listing].profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
					var tmp = {
						image :  imageUrl,
			            usaListingThumb : {
			                image :  imageUrl
			            },
			            usaImageThumb : {
			                image : profileImage
			            },
			            usaListingName: {
			            	text: selbiListings[listing].firstName +" "+ selbiListings[listing].lastName
			            },
			            usaListingNumber: {
			            	text: selbiListings[listing].count > 1 ? "+" + selbiListings[listing].count + " Listings" : selbiListings[listing].count + " Listing"
			            },  
			            template: 'userTwoColumnTemplate',
			            properties: {
			            	userId: selbiListings[listing].id,
			            	userName: selbiListings[listing].firstName +" "+ selbiListings[listing].lastName,
			            	friends: selbiListings[listing].invitation
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
			        		text: helpers.alterTextFormat(selbiListings[listing].firstName +" "+ selbiListings[listing].lastName, 12, false)
		        		},
		        		'#usaListingNumber':{ 
			        		text: selbiListings[listing].count > 1 ? "+" + selbiListings[listing].count + " Listings" : selbiListings[listing].count + " Listing"	
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
			
				
		} else if(obj.length === 0) {
			dynamicElement.defaultLabel('Looks like no one is selling anything at the moment :( Check back soon!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
			$.activityIndicator.hide();
			$.activityIndicator.height = '0dp';
			cb(err, listItems);	
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
	Alloy.Globals.openPage('mylistings', [
		listingIDs.userName, listingIDs.userId, listingIDs.friends
	]);
	
};



$.filterButton.addEventListener('click', function() {
	modalManager.getFilterModal(function(err, results){
		results.modalFilterButton.addEventListener('click', function(e) {
			//console.log('1111111111111 ', results.modalSwitchField.id);
			//console.log('222222222222 ', results.filterSwitchView.children[0].children[0].value);
			var poopArr = [];
			for(var i = 0; i < results.filterSwitchView.children.length; i++) {
				if(results.filterSwitchView.children[i].children[0].value) {
					poopArr.push(results.filterSwitchView.children[i].children[0].id);
				}
			}
			console.log("this is poopArr ", poopArr);
		});
		return;
	});
});





//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        break;
    case 1: //iphoneFive
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        break;
    case 2: //iphoneSix
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 49;
        break;
    case 3: //iphoneSixPlus
        selbiUSAPadding = 13;
        selbiUSAItemHeight = 54;
        break;
    case 4: //android currently same as iphoneSix
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 47;
        break;
};
$.fg.init({
    columns: 2,
    space: selbiUSAPadding,
    gridBackgroundColor:'#FAFAFA',
    itemHeightDelta: selbiUSAItemHeight,
    itemBackgroundColor:'#FAFAFA',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});
$.fg.setOnItemClick(function(e){
    openListing({
    	userId:e.source.data.properties.userId,	
    	userName:e.source.data.properties.userName,
    	friends: e.source.data.properties.friends
    });
});



$.scrollViewSelbi.addEventListener('scroll', counting);

function counting(e) {
	if(!endOfListings) {
		var tolerance = 150;
		if((e.source.children[0].getRect().height - tolerance) <= ($.scrollViewSelbi.getRect().height + e.y) && stopScroll){
			stopScroll = false;
		   //$.scrollViewSelbi.scrollingEnabled = false;
			genUSAItems(function(err, itemsResponse) {
				stopScroll = true;
				//$.scrollViewSelbi.scrollingEnabled = true;
			});
		}	
	}
}

/*$.loadMoreButton.addEventListener('click', function() {
	genUSAItems(function(err, itemsResponse) {
		
	});
});*/
