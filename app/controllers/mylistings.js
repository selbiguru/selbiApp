/**
 * @class MyListings 
 * Listing controller class for managing listing tab groups
 */

var args = arguments[0] || {};

var tabGroup = Ti.UI.createTabGroup();
var controls = require('controls');

/*
 All Listings tab.
 */
var allListingsWindow = controls.createWindow({ title: 'All Listings', backgroundColor: '#fff', navBarHidden:true  }, tabGroup);
allListingsWindow.add(controls.getCustomView('listings').getView());
var allListingsTab = Ti.UI.createTab({
	title: 'All',
	backgroundColor: 'black',
    icon: Ti.UI.iPhone.SystemIcon.TOP_RATED,
    window: allListingsWindow
});


tabGroup.addTab(allListingsTab);

/*
 Friends Listing tab.
 */
var friendsListingsWindow  = controls.createWindow({ title: 'Friends Listings', backgroundColor: '#000', navBarHidden:true }, tabGroup);
var friendsListingView = controls.getCustomView('listings');
friendsListingsWindow.add(friendsListingView.getView());

tabGroup.addTab(Ti.UI.createTab({
	title: 'Friends',
    icon: Ti.UI.iPhone.SystemIcon.DOWNLOADS,
    backgroundColor: 'black',
    window: friendsListingsWindow
}));


/*
 My Listings tab.
 */
var myListingsWindow  = controls.createWindow({ title: 'My Listings', backgroundColor: '#000' , navBarHidden:true}, tabGroup);
myListingsWindow.add(controls.getCustomView('listings').getView());
tabGroup.addTab(Ti.UI.createTab({
	title: 'My Listing',
	backgroundColor: '#000',
    icon: Ti.UI.iPhone.SystemIcon.RECENTS,
    window: myListingsWindow
}));


// Open Tab group
tabGroup.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});