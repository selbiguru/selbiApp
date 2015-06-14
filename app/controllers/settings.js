var args = arguments[0] || {};
var controls=require('controls');

// get all the view as objects
var mainView = controls.getMainView();
var postListingView = controls.getPostListingView();
var notificationsView = controls.getNotificationsView();
var myListingsView = controls.getMyListingView();
var inviteFriendsView = controls.getInviteFriendsView();
var editUserProfileView = controls.getEditUserProfileView();


// setup the list of views 
var settingsList = {
	"payments": mainView,
	"editProfile": editUserProfileView,
	"FAQ": postListingView,
	"feedbackHelp": inviteFriendsView,
	"privacyPolicy": notificationsView,
	"userAgreement": myListingsView
};

$.settingsTable.addEventListener("click", function(e){
	console.log("IM CLICKING ON THIS DAMN PAGE",e.rowData.id);
	//var controller = Alloy.createController('forgotpassword').getView();
	//controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
	function drawView(row){
		for (var property in settingsList) {
		    if (property === row) {
		     var horse = settingsList[row];
		    settingsList[row].getView();
		     console.log("row ", row);
		     console.log("property", property);
		    // var controller = Alloy.createController('login').getView();
			 //controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
		     //type.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
		    }
		}
	};
    drawView(e.rowData.id);
    
    // on Android the event is received by the label, so watch out!
    Ti.API.info(e.rowData.id); 
	
});


