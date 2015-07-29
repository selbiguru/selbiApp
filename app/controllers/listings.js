var args = arguments[0] || {};
var listingManager = require('managers/listingmanager'),
	helper = require('utilities/helpers');

$.fg.init({
    columns:2,
    space:5,
    gridBackgroundColor:'#fff',
    itemHeightDelta: 40,
    itemBackgroundColor:'#fff',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});

$.fg.setOnItemClick(function(e){
    openListing(e.source.data.properties.itemId);
});

var items = [];

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

//$.listingListView.sections = [listingSection];
//$.listingListView.refreshControl = control;
//$.listingListView.addEventListener('itemclick', itemClickListener);

var obj = [];

function itemClickListener(e){
	 var item = listingSection.getItemAt(e.itemIndex);
	 openListing(item.properties.itemId);
}

function genItems(cb){
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			
			for(var listing in userListings) {
				var view = Alloy.createController('itemtemplates');
				var imageUrl = userListings[listing].imageUrls ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.listView + Alloy.CFG.cloudinary.bucket + userListings[listing].imageUrls[0] : "";
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
		            template: 'itemtemplates',
		            properties: {
		            	height: 100,
		            	bottom: 5,
		            	itemId: userListings[listing].id
		            }
		        };
		        view.updateViews({
		        	'#listingThumb':{
		        		image: imageUrl
		        	},
		        	'#listingTitle': {
		        		text: helper.getListingTitle(userListings[listing].title)
		        	},
		        	'#listingPrice':{ 
		        		text: userListings[listing].price.formatMoney(2)	
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
}




function openListing(listingId){
	Alloy.Globals.openPage('viewlisting', listingId);
}
