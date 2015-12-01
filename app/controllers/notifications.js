var args = arguments[0] || {};
var helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement'),
	friendsManager = require('managers/friendsmanager');
	notificationManager = require('managers/notificationmanager');
var dataArray = [];

$.activityIndicator.show();




notificationManager.getNotificationByUserId(function(err, notificationResults) {
	console.log('++++++++++ ', notificationResults);
	console.log('---------- ', err);
	if(err) {
		dynamicElement.defaultLabel('Dang! We are having trouble getting your notifications. Please try again shortly.', function(err, results) {
			$.defaultView.height= Ti.UI.FILL;
			$.defaultView.add(results);
		});
	} else if(notificationResults.length > 0) {
		showNotifications(notificationResults);	
	} else {
		dynamicElement.defaultLabel('No new notifications!', function(err, results) {
			$.defaultView.height= Ti.UI.FILL;
			$.defaultView.add(results);
		});
	}
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
	return;
});

/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/



function showNotifications(notificationsArray) {
	for (var i in notificationsArray) {
		switch(Alloy.Globals.userDevice) {
		    case 0: //iphoneFour
		        mainViewHeight = '65dp';
		        mainViewTop = '2dp';
		        horizontalViewHeight = '59dp';
		        imgViewHeight = '50dp';
		        imgViewWidth = '50dp';
		        imgViewTop = '4dp';
		        imgViewLeft = '5dp';
		        imgViewBorderRadius = '25dp';
		        notificationFontSize = '12dp';
		        nameLabelViewTop = '2dp';
		        nameLabelViewLeft = '7dp';
		        friendButtonHeight = '20dp';
		        friendButtonWidth = '75dp';
		        declineButtonRight = '105dp';
		        acceptButtonRight = '15dp';
		        underlineViewTop = '5dp';
		        break;
		    case 1: //iphoneFive
		        mainViewHeight = '65dp';
		        mainViewTop = '2dp';
		        horizontalViewHeight = '59dp';
		        imgViewHeight = '50dp';
		        imgViewWidth = '50dp';
		        imgViewTop = '4dp';
		        imgViewLeft = '5dp';
		        imgViewBorderRadius = '25dp';
		        notificationFontSize = '12dp';
		        nameLabelViewTop = '2dp';
		        nameLabelViewLeft = '7dp';
		        friendButtonHeight = '20dp';
		        friendButtonWidth = '75dp';
		        declineButtonRight = '105dp';
		        acceptButtonRight = '15dp';
		        underlineViewTop = '5dp';
		        break;
		    case 2: //iphoneSix
		        mainViewHeight = '70dp';
		        mainViewTop = '2dp';
		        horizontalViewHeight = '64dp';
		        imgViewHeight = '55dp';
		        imgViewWidth = '55dp';
		        imgViewTop = '4dp';
		        imgViewLeft = '5dp';
		        imgViewBorderRadius = '27dp';
		        notificationFontSize = '14dp';
		        nameLabelViewTop = '2dp';
		        nameLabelViewLeft = '7dp';
		        friendButtonHeight = '25dp';
		        friendButtonWidth = '85dp';
		        declineButtonRight = '115dp';
		        acceptButtonRight = '15dp';
		        underlineViewTop = '5dp';
		        break;
		    case 3: //iphoneSixPlus
		        mainViewHeight = '77dp';
		        mainViewTop = '2dp';
		        horizontalViewHeight = '69dp';
		        imgViewHeight = '60dp';
		        imgViewWidth = '60dp';
		        imgViewTop = '4dp';
		        imgViewLeft = '5dp';
		        imgViewBorderRadius = '30dp';
		        notificationFontSize = '15dp';
		        nameLabelViewTop = '2dp';
		        nameLabelViewLeft = '7dp';
		        friendButtonHeight = '28dp';
		        friendButtonWidth = '90dp';
		        declineButtonRight = '120dp';
		        acceptButtonRight = '15dp';
		        underlineViewTop = '5dp';
		        break;
		    case 4: //android currently same as iphoneSix
		        mainViewHeight = '70dp';
		        mainViewTop = '2dp';
		        horizontalViewHeight = '64dp';
		        imgViewHeight = '55dp';
		        imgViewWidth = '55dp';
		        imgViewTop = '4dp';
		        imgViewLeft = '5dp';
		        imgViewBorderRadius = '27dp';
		        notificationFontSize = '14dp';
		        nameLabelViewTop = '2dp';
		        nameLabelViewLeft = '7dp';
		        friendButtonHeight = '25dp';
		        friendButtonWidth = '85dp';
		        declineButtonRight = '115dp';
		        acceptButtonRight = '15dp';
		        underlineViewTop = '5dp';
		        break;
		};
		var mainView = Titanium.UI.createView({
			layout: 'vertical',
			height: mainViewHeight,
			top: mainViewTop,
			id: notificationsArray[i].id
		});
		var horizontalView = Titanium.UI.createView({
			layout: 'horizontal',
			height: horizontalViewHeight,
		});
		var imgView = Titanium.UI.createImageView({
			top: imgViewTop,
			left: imgViewLeft,
			height: imgViewHeight,
			width: imgViewWidth,
			borderRadius: imgViewBorderRadius,
			image: notificationsArray[i].profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + notificationsArray[i].profileImage: "http://www.lorempixel.com/600/600/"
		});
		var subView = Titanium.UI.createView({});
		var nameLabel = Titanium.UI.createLabel({
	        font: {
				fontSize: notificationFontSize,
				fontFamily: 'Nunito-Light'
			},
			color: "#9B9B9B",
			top: nameLabelViewTop,
			left: nameLabelViewLeft,
	        text: createText(notificationsArray[i])
		});
		var buttonsView = Titanium.UI.createView({
			height: Ti.UI.SIZE,
			bottom: '0dp'
		});
		var declineFriendButton = Titanium.UI.createButton({
			height: friendButtonHeight,
			width: friendButtonWidth,
			font: {
				fontSize: notificationFontSize,
				fontFamily: 'Nunito-Light'
			},
			textAlign: 'center',
			borderColor: '#9B9B9B',
			color: '#9B9B9B',
			bottom: '0dp',
			right: declineButtonRight,
			title: 'Decline',
			data: {
				isSold: notificationsArray[i].type === 'sold' ? true : false,
				userFrom: notificationsArray[i].userFrom,
				userTo: notificationsArray[i].userTo,
				notificationId: notificationsArray[i].id			
			},
			ext: mainView
		});
		var acceptFriendButton = Titanium.UI.createButton({
			height: friendButtonHeight,
			width: friendButtonWidth,
			font: {
				fontSize: notificationFontSize,
				fontFamily: 'Nunito-Light'
			},
			textAlign: 'center',
			backgroundColor: '#1BA7CD',
			color: '#fff',
			bottom: '0dp',
			right: acceptButtonRight,
			title: notificationsArray[i].type === 'sold' ? 'Cool!' : 'Add',
			data: {
				isSold: notificationsArray[i].type === 'sold' ? true : false,
				userFrom: notificationsArray[i].userFrom,
				userTo: notificationsArray[i].userTo,
				notificationId: notificationsArray[i].id
			},
			ext: mainView
		});
		var underline = Titanium.UI.createView({
			height: "1dp",
			backgroundColor:"#E5E5E5",
			top: underlineViewTop,
			width:Titanium.UI.FILL
		});
		if(notificationsArray[i].type === 'friendrequest') {
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
			if(e.source.data.isSold) {
				var deleteObj = {
					notificationId: e.source.data.id
				};
				notificationManager.deleteNotification(deleteObj, function(err, deleteResults) {
					console.log('-------' , err);
					console.log('++++++++' , deleteResults);
					if(err) {
						helpers.alertUser('Oops','We are having trouble processing your request!');
						return;
					} else {
						$.viewNotifications.remove(e.source.ext);
					}
				});
			} else {
				var invitationObject = {
					userFrom: e.source.data.userTo,
					userTo: e.source.data.userFrom,
					status: 'approved',
					notificationId: e.source.data.notificationId
				};
				friendsManager.updateFriendInvitationByUserIds( invitationObject, function(err, updateResult) {
					console.log('-------' , err);
					console.log('++++++++' , updateResult);
					if(err) {
						helpers.alertUser('Oops','We are having trouble processing your request!');
						return;
					} else {
						$.viewNotifications.remove(e.source.ext);
					}
				});
			}
		});
		declineFriendButton.addEventListener('click', function(e) {
			var invitationObject = {
				userFrom: e.source.data.userTo,
				userTo: e.source.data.userFrom,
				status: 'denied',
				notificationId: e.source.data.notificationId
			};
			friendsManager.updateFriendInvitationByUserIds( invitationObject, function(err, updateResult) {
				console.log('=========== ' , err);
				console.log('&&&&&&&&&&& ' , updateResult);
				if(err) {
					helpers.alertUser('Oops','We are having trouble processing your request!');
					return;
				} else {
					$.viewNotifications.remove(e.source.ext);
				}
			});
		});
	}
	$.viewNotifications.add(dataArray);
};



function createText(notification) {
	var newText = '';
	if(notification.type === 'sold') {
		newText = notification.user.firstName +" "+ notification.user.lastName + " added you!";	
	} else {
		newText = notification.user.firstName +" "+ notification.user.lastName + ' purchased your item!';
	}
	return newText;
}


