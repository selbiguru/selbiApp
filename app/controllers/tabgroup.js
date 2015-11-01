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
var allListingsWindow = controls.createWindow({ title: 'Selbi USA', backgroundColor: '#FAFAFA', navBarHidden:true }, tabGroup);
allListingsWindow.add(controls.getCustomView('listings', ['selbiUSA', Ti.App.Properties.getString('userId')]).getView());
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
var friendsListingView = controls.getCustomView('listings', ['friends', Ti.App.Properties.getString('userId')]);
friendsListingsWindow.add(friendsListingView.getView());

var friendsListingsTab = Ti.UI.createTab({
	title: 'My Friends',
    icon: Ti.UI.iPhone.SystemIcon.DOWNLOADS,
    backgroundColor: 'FAFAFA',
    window: friendsListingsWindow
});
tabGroup.addTab(friendsListingsTab);

/*
 My Listings tab.
 */
var myListingsWindow  = controls.createWindow({ title: 'My Listings', backgroundColor: '#FAFAFA' , navBarHidden:true }, tabGroup);
myListingsWindow.add(controls.getCustomView('listings', ['mylistings', Ti.App.Properties.getString('userId')]).getView());
var myListingsTab = Ti.UI.createTab({
	title: 'My Listings',
	backgroundColor: '#FAFAFA',
    icon: Ti.UI.iPhone.SystemIcon.RECENTS,
    window: myListingsWindow
});
tabGroup.addTab(myListingsTab);


allListingsWindow.addEventListener('click', function(e){
	var myListingsWindow  = controls.createWindow({ title: 'My Listings', backgroundColor: '#FAFAFA' , navBarHidden:true}, tabGroup);
	myListingsWindow.add(controls.getCustomView('listings', ['mylistings', e.source.data.properties.userId]).getView());
	allListingsTab.open(myListingsWindow);
	myListingsWindow.addEventListener('blur', function(){
		allListingsTab.close(myListingsWindow);
	});
	
});
friendsListingsWindow.addEventListener('click', function(e){
	var myListingsWindow  = controls.createWindow({ title: 'My Listings', backgroundColor: '#FAFAFA' , navBarHidden:true}, tabGroup);
	myListingsWindow.add(controls.getCustomView('listings', ['mylistings', e.source.data.properties.userId]).getView());
	friendsListingsTab.open(myListingsWindow);
	console.log("more importantly what is 'e' ", e.source.data.properties.userId);
	myListingsWindow.addEventListener('blur', function(){
		friendsListingsTab.close(myListingsWindow);
	});
	
});


// Open Tab group
tabGroup.setActiveTab(1);
tabGroup.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});