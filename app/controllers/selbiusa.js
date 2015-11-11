var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	userManager = require('managers/usermanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var	selbiUSAPadding, selbiUSAItemHeight;
var items = [],
	obj = [];


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
	listingManager.getUserListings(argsID, function(err, userListings){
		var listItems = [];	
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading all the USA listings!', function(err, results) {
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
			dynamicElement.defaultLabel('Looks like no one is selling anything at the moment :( Check back soon!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		}	
		cb(err, listItems);	
	});
};





function findUserListings(){
	var userNameSearchObj = {
		username: $.usernameSearch.value
	};
	userManager.getUserByUsername(userNameSearchObj, function (err, usernameResults) {
		if(err){
	    	helpers.alertUser('Oops!','Sorry this user does not exist!');
			return;
    	} else {
    		openListing({
    			userId: usernameResults.id,	
    			userName: usernameResults.firstName + ' ' + usernameResults.lastName	
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
		listingIDs.userName, listingIDs.userId
	]);
	
};






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
    });
});
