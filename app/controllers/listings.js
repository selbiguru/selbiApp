var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');


var control = Ti.UI.createRefreshControl({
    tintColor:'#1BA7CD'
});
control.addEventListener('refreshstart',function(e){
    Ti.API.info('refreshstart');
    genItems(function(err, items){
		listingSection.setItems(items);
		control.endRefreshing();
	});
});

var listingSection = Ti.UI.createListSection({ headerTitle: ''});
genItems(function(err, items){
	listingSection.setItems(items);
});

$.listingListView.sections = [listingSection];
$.listingListView.refreshControl = control;
$.listingListView.addEventListener('itemclick', itemClickListener);

function itemClickListener(e){
	 var item = listingSection.getItemAt(e.itemIndex);
	 openListing(item.properties.itemId);
}

function genItems(cb){
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.listView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
				var tmp = {
		            listingThumb : {
		                image :  imageUrl
		            },
		            listingTitle : {
		                text : userListings[listing].title
		            },
		            listingPrice: {
		            	text: userListings[listing].price.formatMoney(2)
		            },   
		            template: 'listingitem',
		            properties: {
		            	height: 100,
		            	bottom: 5,
		            	itemId: userListings[listing].id
		            }
		        };
				listItems.push(tmp);
			}
		}	
		cb(err, listItems);	
	});
}


function openListing(listingId){
	Alloy.Globals.openPage('viewlisting', listingId);
}
