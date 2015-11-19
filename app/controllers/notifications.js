var args = arguments[0] || {};
var helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement');//,
	//notificationManager = require('managers/notificationmanager');
var dataArray = [];

//$.activityIndicator.show();
$.activityIndicator.hide();
$.activityIndicator.height = '0dp';




/*notificationManager.getFAQ(function(err, faqResults) {
	if(err) {
		dynamicElement.defaultLabel('Oh no!  We are asking ourselves too many questions! Not to fear, FAQ\'s will be back soon!', function(err, results) {
			$.viewFAQ.add(results);
		});
	} else {
		showFAQ(faqResults);	
	}
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
	return;
});*/

/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

var notificationsArray = [
		{
			name: 'Jordan Burrows purchased your item!',
			type: 'sold',
			userId: '11111111',
			requesterId: '1010101',
			id: 6
		},
		{
			name: 'Johnny Benchman added you!',
			type: 'friend',
			userId: '4444444',
			requesterId: '4040404',
			id: 9
		},
		{
			name: 'Bernie King purchased your item!',
			type: 'sold',
			userId: '7777777',
			requesterId: '707070707',
			id: 11
		},
		{
			name: 'Larry Browns purchased your item!',
			type: 'friend',
			userId: '888888',
			requesterId: '80808080',
			id: 11
		}
	];

function showNotifications(notificationsArray) {
	for (var i in notificationsArray) {
		switch(Alloy.Globals.userDevice) {
		    case 0: //iphoneFour
		        notificationFontSizeAnswer = 14;
		        notificationFontSizeQuestion = 15;
		        notificationTop = '8dp';
		        notificationLeft = '7dp';
		        break;
		    case 1: //iphoneFive
		        notificationFontSizeAnswer = 15;
		        notificationFontSizeQuestion = 16;
		        notificationTop = '8dp';
		        notificationLeft = '7dp';
		        break;
		    case 2: //iphoneSix
		        notificationFontSizeAnswer = 17;
		        notificationFontSizeQuestion = 18;
		        notificationTop = '10dp';
		        notificationLeft = '10dp';
		        break;
		    case 3: //iphoneSixPlus
		        notificationFontSizeAnswer = 19;
		        notificationFontSizeQuestion = 20;
		        notificationTop = '10dp';
		        notificationLeft = '10dp';
		        break;
		    case 4: //android currently same as iphoneSix
		        notificationFontSizeAnswer = 17;
		        notificationFontSizeQuestion = 18;
		        notificationTop = '10dp';
		        notificationLeft = '10dp';
		        break;
		};
		var mainView = Titanium.UI.createView({
			layout: 'vertical',
			height: '65dp',
			top: '2dp',
			id: notificationsArray[i].id
		});
		var horizontalView = Titanium.UI.createView({
			layout: 'horizontal',
			height: '59dp',
		});
		var imgView = Titanium.UI.createImageView({
			top: '4dp',
			left: '5dp',
			height: '50dp',
			width: '50dp',
			borderRadius: "25dp",
			image: "http://www.lorempixel.com/600/600/"
		});
		var subView = Titanium.UI.createView({});
		var nameLabel = Titanium.UI.createLabel({
	        font: {
				fontSize: '12dp',
				fontFamily: 'Nunito-Light'
			},
			color: "#9B9B9B",
			top: '2dp',
			left: '7dp',
	        text: notificationsArray[i].name
		});
		var buttonsView = Titanium.UI.createView({
			height: Ti.UI.SIZE,
			bottom: '0dp'
		});
		var declineFriendButton = Titanium.UI.createButton({
			height: '20dp',
			width: '85dp',
			font: {
				fontSize: '12dp',
				fontFamily: 'Nunito-Light'
			},
			textAlign: 'center',
			borderColor: '#9B9B9B',
			color: '#9B9B9B',
			bottom: '0dp',
			right: '115dp',
			title: 'Decline',
			data: {
				isSold: notificationsArray[i].type === 'sold' ? true : false,
				requesterId: notificationsArray[i].requesterId,
				userId: notificationsArray[i].userId,			
			},
			ext: mainView
		});
		var acceptFriendButton = Titanium.UI.createButton({
			height: '20dp',
			width: '85dp',
			font: {
				fontSize: '12dp',
				fontFamily: 'Nunito-Light'
			},
			textAlign: 'center',
			backgroundColor: '#1BA7CD',
			color: '#fff',
			bottom: '0dp',
			right: '15dp',
			title: notificationsArray[i].type === 'sold' ? 'Cool!' : 'Add',
			data: {
				isSold: notificationsArray[i].type === 'sold' ? true : false,
				requesterId: notificationsArray[i].requesterId,
				userId: notificationsArray[i].userId,			
			},
			ext: mainView
		});
		var underline = Titanium.UI.createView({
			height: "1dp",
			backgroundColor:"#E5E5E5",
			top: '5dp',
			width:Titanium.UI.FILL
		});
		if(notificationsArray[i].type === 'friend') {
			buttonsView.add(declineFriendButton);
		}
		buttonsView.add(acceptFriendButton);
		subView.add(nameLabel);
		subView.add(buttonsView);
		horizontalView.add(imgView);
		horizontalView.add(subView);
		mainView.add(horizontalView);
		mainView.add(underline);
		dataArray.push(mainView);
		acceptFriendButton.addEventListener('click', function(e) {
			if(e.source.data) {
				console.log("is sold", e.source.data.userId);
			} else {
				console.log("is friend request");
			}
			$.viewNotifications.remove(e.source.ext);
		});
		declineFriendButton.addEventListener('click', function(e) {
			console.log("declinging friend", e.owner);
			console.log("is sold", e.source.ext);
			$.viewNotifications.remove(e.source.ext);
		});
	}
	$.viewNotifications.add(dataArray);
}


showNotifications(notificationsArray);


