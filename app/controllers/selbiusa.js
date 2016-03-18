var args = arguments[0][0] || {},
	argsID = arguments[0][1] || {};
var listingManager = require('managers/listingmanager'),
	userManager = require('managers/usermanager'),
	friendsManager = require('managers/friendsmanager'),
	modalManager = require('managers/modalmanager'),
	helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');
var	selbiUSAPadding, selbiUSAItemHeight, selbiUSAFontSize;
var items = [],
	obj = [],
	categoryArray = [];
var paginateLastDate = '';
var endOfListings = false;
var stopScroll = true;

switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        selbiUSAFontSize = '12dp';
        break;
    case 1: //iphoneFive
        selbiUSAPadding = 7;
        selbiUSAItemHeight = 45;
        selbiUSAFontSize = '12dp';
        break;
    case 2: //iphoneSix
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 49;
        selbiUSAFontSize = '14dp';
        break;
    case 3: //iphoneSixPlus
        selbiUSAPadding = 13;
        selbiUSAItemHeight = 49;
        selbiUSAFontSize = '15dp';
        break;
    case 4: //android currently same as iphoneSix
        selbiUSAPadding = 10;
        selbiUSAItemHeight = 49;
        selbiUSAFontSize = '14dp';
        break;
};


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
	var selbiUSAObj = {
		createdAt: paginateLastDate,
		categories: categoryArray.length > 0 ? categoryArray : false
	};
	listingManager.getSelbiListings(argsID, selbiUSAObj, function(err, selbiListings){
		selbiListings.listings.length > 0 ? paginateLastDate = selbiListings.listings[selbiListings.listings.length - 1].createdAt : '';
		selbiListings.listings.length < 30 ? endOfListings = true : endOfListings = false;
		var listItems = [];	
		if(err) {
			dynamicElement.defaultLabel('Uh oh! We are experiencing server issues and are having trouble loading all the USA listings! We are working on a fix!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		} else if(selbiListings && selbiListings.listings.length > 0) {
			for(var listing in selbiListings.listings) {
				if(selbiListings.listings[listing].imageUrls){
					var view = Alloy.createController('myitemtemplate');
					var imageUrl = selbiListings.listings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].mylistView + Alloy.CFG.cloudinary.bucket + selbiListings.listings[listing].imageUrls[0] : "";
					var tmp = {
						image :  imageUrl,
						listingItem:{
			        		borderColor: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#E5E5E5",
			        		borderWidth: selbiListings.listings[listing].isSold ? '3dp' : '1dp'
			        	},
			            listingThumb : {
			                image :  imageUrl
			            },
			            listingTitle : {
			                text : selbiListings.listings[listing].title,
			                color: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			            },
			            listingPrice: {
			            	text: selbiListings.listings[listing].price.formatMoney(2),
			            	color: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			            },
			            listingImagesCount: {
			            	text: selbiListings.listings[listing].isSold ? "SOLD" : selbiListings.listings[listing].imageUrls.length > 1 ? "+" + selbiListings.listings[listing].imageUrls.length + " Images" : selbiListings.listings[listing].imageUrls.length + " Image"	,
		        			font: selbiListings.listings[listing].isSold ? {fontFamily: 'Nunito-Bold', fontSize: selbiUSAFontSize } : {fontFamily: 'Nunito-Light', fontSize: selbiUSAFontSize } ,
		        			color: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			            },  
			            template: 'myitemtemplate',
			            properties: {
			            	itemId: selbiListings.listings[listing].id,
			            	userName: selbiListings.firstName +" "+ selbiListings.lastName,
			            	userId: selbiListings.listings[listing].user,
			            	isSold: selbiListings.listings[listing].isSold
			            }
			        };
			        view.updateViews({
			        	'#listingItem':{
			        		borderColor: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#E5E5E5",
			        		borderWidth: selbiListings.listings[listing].isSold ? '3dp' : '1dp'
			        	},
			        	'#listingThumb':{
			        		image: imageUrl
			        	},
			        	'#listingTitle': {
			        		text: helpers.alterTextFormat(selbiListings.listings[listing].title, 14, true),
			        		color: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
			        	},
			        	'#listingPrice':{ 
			        		text: selbiListings.listings[listing].price.formatMoney(2),
			        		color: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"	

		        		},
		        		'#listingImagesCount':{ 
			        		text: selbiListings.listings[listing].isSold ? "SOLD" : selbiListings.listings[listing].imageUrls.length > 1 ? "+" + selbiListings.listings[listing].imageUrls.length + " Images" : selbiListings.listings[listing].imageUrls.length + " Image"	,
		        			font: selbiListings.listings[listing].isSold ? {fontFamily: 'Nunito-Bold', fontSize: selbiUSAFontSize } : {fontFamily: 'Nunito-Light', fontSize: selbiUSAFontSize } ,
		        			color: selbiListings.listings[listing].isSold ? "#1BA7CD" : "#9B9B9B"
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
			
		} else if (selbiListings && selbiListings.listings.length === 0) {
			dynamicElement.defaultLabel('Dang! Nothing was found at the moment :( Check back soon!', function(err, results) {
				$.defaultView.height= Ti.UI.FILL;
				$.defaultView.add(results);
			});
		}
		$.activityIndicator.hide();
		$.activityIndicator.height = '0dp';
		cb(err, []);	
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
	if(!listingIDs.friends) {
		Alloy.Globals.openPage('viewlisting', {
			itemId: listingIDs.itemId,
			userId: listingIDs.userId
		});
	} else {
		Alloy.Globals.openPage('mylistings', [
			listingIDs.userName, listingIDs.userId, listingIDs.friends
		]);
		if(Ti.App.Properties.getString('userId') === listingIDs.userId) {
			clearProxy('mylistings');
			Alloy.Globals.closePage('selbiusa');
		}
	}	
};




/**
 * @method infitineScroll
 * Determines when to load more items on scrolling for SelbiUSA items
 */
function infitineScroll(e) {
	if(!endOfListings) {
		var tolerance = 450;
		if((e.source.children[0].getRect().height - tolerance) <= ($.scrollViewSelbi.getRect().height + e.y) && stopScroll){
			stopScroll = false;
			genUSAItems(function(err, itemsResponse) {
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
	if(e.source.id === 'usernameSearch' || e.source.id === 'selbiUSASearchView') {
		$.usernameSearch.focus();
	} else {
		$.usernameSearch.blur();
	}
};



/**
 * @method filterListings 
 * Opens filter modal for user to filter through listings
 */
function filterListings() {
	modalManager.getFilterModal(categoryArray, function(err, results){
		results.modalFilterButton.addEventListener('click', function(e) {
			var animateWindowClose = Titanium.UI.create2DMatrix();
				animateWindowClose = animateWindowClose.scale(0);
			categoryArray = [];
			paginateLastDate = '';
			for(var i = 0; i < results.filterSwitchView.children.length; i++) {
				if(results.filterSwitchView.children[i].children[0].value) {
					categoryArray.push(results.filterSwitchView.children[i].children[0].id);
				}
			}
			$.fg.clearGrid();
			for(var i in items) {
				items[i].view = null;
				items[i].data = null;
			}
			$.defaultView.height= '0dp';
			if($.defaultView.children.length > 0) {
				$.defaultView.remove($.defaultView.children[0]);	
			}
			genUSAItems(function(err, itemsResponse) {
				
			});
			results.modalWindow.close({transform:animateWindowClose, duration:300});
			animateWindowClose = null;
		});
		return;
	});
}


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
	$.scrollViewSelbi.removeEventListener('scroll', infitineScroll);
	$.filterButton.removeEventListener('click', filterListings);
	$.selbiUSAView.removeEventListener('click', blurTextField);
	$.usernameSearch.removeEventListener('return', keyboardSearch);
	$.searchUserButton.removeEventListener('click', findUserListings);
};



/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off();
	$.destroy();
	removeEventListeners();
	$.selbiUSAView.remove($.activityIndicator);
	$.activityIndicator = null;
	/*if(e !== 'mylistings') {
		this.removeEventListener('click', clearProxy);	
	}*/
	$.fg.clearGrid();
	for(var i in items) {
		items[i].view = null;
		items[i].data = null;
	}
	//$.selbiUSAView = null;
	
	console.log('solve anything yet?^ ', e);
}



//-------------------------------------------Initializing Views/Styles----------------------------------------------------//

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
    	itemId:e.source.data.properties.itemId,
    });
});





/*-------------------------------------------------Event Listeners---------------------------------------------------*/


$.scrollViewSelbi.addEventListener('scroll', infitineScroll);
$.filterButton.addEventListener('click', filterListings);
$.selbiUSAView.addEventListener('click', blurTextField);
$.usernameSearch.addEventListener('return', keyboardSearch); 
$.searchUserButton.addEventListener('click', findUserListings);

/*$.selbiUSAView.addEventListener('click', function(e) {
	$.selbiUSAView.parent.parent.children[0].addEventListener('click', clearProxy);
});*/

exports.cleanup = function () {
	Ti.API.info('Cleaning selbiUSAView');
	clearProxy();
	$.removeListener();
	$.selbiUSAView.removeAllChildren();
	$.selbiUSAView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};


