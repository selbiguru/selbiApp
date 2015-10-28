var args = arguments[0] || {};
var listingManager = require('managers/listingmanager'),
	helper = require('utilities/helpers');
var paddingContainer, 
	itemHeight;




switch(Alloy.Globals.userDevice) {
    case 0: //iphoneFour
        paddingContainer = 7;
        itemHeight = 44;
        break;
    case 1: //iphoneFive
        paddingContainer = 7;
        itemHeight = 45;
        break;
    case 2: //iphoneSix
        paddingContainer = 10;
        itemHeight = 47;
        break;
    case 3: //iphoneSixPlus
        paddingContainer = 13;
        itemHeight = 49;
        break;
    case 4: //android currently same as iphoneSix
        paddingContainer = 10;
        itemHeight = 47;
        break;
};
$.fg.init({
    columns:2,
    space: paddingContainer,
    gridBackgroundColor:'#FAFAFA',
    itemHeightDelta: itemHeight,
    itemBackgroundColor:'#FAFAFA',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});
$.fg.setOnItemClick(function(e){
	console.log("used 1");
    openListing(e.source.data.properties.itemId);
});

var items = [];

var control = Ti.UI.createRefreshControl({
    tintColor:'#1BA7CD'
});
/*control.addEventListener('refreshstart',function(e){
	console.log("used 2");
    Ti.API.info('refreshstart');
    genItems(function(err, items){
		listingSection.setItems(items);
		control.endRefreshing();
	});
});*/

var listingSection = Ti.UI.createListSection({ headerTitle: ''});
genItems(function(err, items){
	console.log("used 3");
	//listingSection.setItems(items);
});

var parentWindow = Titanium.UI.currentWindow;
// $.menuButton.addEventListener('click', function(){
	// console.log("menu button click", parentWindow);
	// Titanium.API.currentTabGroup.getActiveTab().close();
// });

//$.listingListView.sections = [listingSection];
//$.listingListView.refreshControl = control;
//$.listingListView.addEventListener('itemclick', itemClickListener);

var obj = [];

function itemClickListener(e){
	console.log("used 4");
	 var item = listingSection.getItemAt(e.itemIndex);
	 openListing(item.properties.itemId);
}

function genItems(cb){
	console.log("used 5");
	listingManager.getUserListings(Ti.App.Properties.getString('userId'), function(err, userListings){
		//console.log("################## ", userListings);
		var listItems = [];		
		if(userListings && userListings.length > 0) {
			for(var listing in userListings) {
				var view = Alloy.createController('myitemtemplates');
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
		            listingImages: {
		            	text: userListings[listing].imageUrls.length > 1 ? "+" + userListings[listing].imageUrls.length + " Images" : userListings[listing].imageUrls.length + " Image"
		            },  
		            template: 'myitemtemplates',
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
	        		},
	        		'#listingImages':{ 
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
			
		}	
		cb(err, listItems);	
	});
}




function openListing(listingId){
	console.log("used 6");
	Alloy.Globals.openPage('viewlisting', {id: listingId});
}
