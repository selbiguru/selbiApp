var Alloy=require('alloy');

exports.getMainView=function(){
	return Alloy.createController('mainview');
};

exports.getMenuView=function(){
	return Alloy.createController('menuview');	
};

/*exports.getMenuButton=function(args){
	var v=Ti.UI.createView({
		height: args.h,
		width: args.w,
		backgroundColor: '#FAFAFA'
	});
	
	var b=Ti.UI.createView({
		height: "20dp",
		width: "20dp"
	});
	
	v.add(b);
	console.log("Menu button = " + v);
	return v;
};*/

//Get the Controllers

exports.getConfigView=function(){
    return Alloy.createController('config');
};

exports.getListingView=function(){
    return Alloy.createController('listings');
};

exports.getPostListingView = function(){
	return Alloy.createController('createlisting');
};
exports.getNotificationsView = function(){
	return Alloy.createController('notifications');
};
exports.getMyListingView = function(){
	return Alloy.createController('mylistings');
};
exports.getInviteFriendsView = function(){
	return Alloy.createController('invitefriends');
};
exports.getSettingsView = function(){
	return Alloy.createController('settings');
};
exports.getEditUserProfileView = function(){
	return Alloy.createController('edituserprofile');
};