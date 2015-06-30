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

var listingSection = Ti.UI.createListSection({ headerTitle: 'Listings'});
genItems(function(err, items){
	listingSection.setItems(items);
});

$.listingListView.sections = [listingSection];
$.listingListView.refreshControl = control;
$.listingListView.addEventListener('itemclick', itemClickListener);

function itemClickListener(e){
	 var item = listingSection.getItemAt(e.itemIndex);
	 console.log(item.properties.itemId);
	 openListing(item.properties.itemId);
}

function genItems(cb){
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				listItems.push({properties: { title: userListings[listing].title, itemId: userListings[listing].id }});
			}
		}	
		cb(err, listItems);	
	});
}

function openListing(listingId){
	Alloy.Globals.openPage('viewlisting', listingId);
}
