/**
 * @class tabGroup 
 * Listing controller class for managing listing tab groups
 */

var args = arguments[0] || {};

var tabGroup = Ti.UI.createTabGroup({
	backgroundColor : 'transparent',
    activeTabIconTint: '1BA7CD'
});
var controls = require('controls');

/*
 All Listings tab.
 */
var allListingsWindow = controls.createWindow({ title: 'Selbi USA', backgroundColor: '#FAFAFA', navBarHidden:true  }, tabGroup);
allListingsWindow.add(controls.getCustomView('listings', 'selbiUSA').getView());
var allListingsTab = Ti.UI.createTab({
	title: 'Selbi USA',
	backgroundColor: '#FAFAFA',
    icon: Ti.UI.iPhone.SystemIcon.TOP_RATED,
    window: allListingsWindow
});


tabGroup.addTab(allListingsTab);

/*
 Friends Listing tab.
 */
var friendsListingsWindow  = controls.createWindow({ title: 'My Friends', backgroundColor: '#FAFAFA', navBarHidden:true }, tabGroup);
var friendsListingView = controls.getCustomView('listings', 'friends');
friendsListingsWindow.add(friendsListingView.getView());

tabGroup.addTab(Ti.UI.createTab({
	title: 'My Friends',
    icon: Ti.UI.iPhone.SystemIcon.DOWNLOADS,
    backgroundColor: 'FAFAFA',
    window: friendsListingsWindow
}));


/*
 My Listings tab.
 */
var tabGroupWindow  = controls.createWindow({ title: 'My Listings', backgroundColor: '#FAFAFA' , navBarHidden:true}, tabGroup);
tabGroupWindow.add(controls.getCustomView('listings', 'mylistings').getView());
tabGroup.addTab(Ti.UI.createTab({
	title: 'My Listings',
	backgroundColor: '#FAFAFA',
    icon: Ti.UI.iPhone.SystemIcon.RECENTS,
    window: tabGroupWindow
}));


// Open Tab group
tabGroup.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});