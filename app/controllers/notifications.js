var args = arguments[0] || {};
var helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement'),
	friendsManager = require('managers/friendsmanager'),
	notificationManager = require('managers/notificationmanager'),
	indicator = require('uielements/indicatorwindow');

$.activityIndicator.show();




notificationManager.getNotificationByUserId(function(err, notificationResults) {
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
	var items = [];
	for (var i in notificationsArray) {
		var notificationItem = {
			userImage: {
	            image: notificationsArray[i].userFromInfo.profileImage ? Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + notificationsArray[i].userFromInfo.profileImage : Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize[Alloy.Globals.iPhone].userImgGeneral + Alloy.CFG.cloudinary.bucket + Alloy.CFG.imageSize.facesDefault
	        },
	        labelText: {
	        	text: createText(notificationsArray[i])
	        },
	        cancelButton: {
	            title: 'Decline',
				data: {
					isSold: notificationsArray[i].type === 'sold' || notificationsArray[i].type === 'purchased' ? true : false,
					userFrom: notificationsArray[i].userFrom,
					userTo: notificationsArray[i].user,
					notificationId: notificationsArray[i].id			
				}
	        },
	        acceptButton: {
	            title: notificationsArray[i].type === 'sold' || notificationsArray[i].type === 'purchased' ? 'Cool!' : 'Add',
				data: {
					isSold: notificationsArray[i].type === 'sold' || notificationsArray[i].type === 'purchased' ? true : false,
					userFrom: notificationsArray[i].userFrom,
					userTo: notificationsArray[i].user,
					notificationId: notificationsArray[i].id
				}
	        }
		};
		if(notificationsArray[i].type !== 'friendrequest') {
	    	notificationItem.template = 'purchaseTemplate';
		};
		items.push(notificationItem);

	}
	
	// add the new items to the end of the existing list
	$.notificationSection.items = $.notificationSection.items.concat(items);
};



function createText(notification) {
	var newText = '';
	if(notification.type === 'friendrequest') {
		newText = notification.userFromInfo.firstName +" "+ notification.userFromInfo.lastName + " added you!";	
	} else if(notification.type === 'sold') {
		newText = notification.userFromInfo.firstName +" "+ notification.userFromInfo.lastName + ' purchased your item!';
	} else {
		newText = 'You purchased an item from ' + notification.userFromInfo.firstName +" "+ notification.userFromInfo.lastName + '!';
	}
	return newText;
}


/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off;
	$.destroy;
}


function updateUser(){
	//Load the user model
	Alloy.Models.user.fetch({
		success: function(data){
			var currentUser = data;
			notificationManager.countNotifications(function(err, notificationCount){
				currentUser.set({'notificationCount': notificationCount});
				currentUser.save();
			});
		},
		error: function(data){
			helpers.alertUser('Get User','Failed to get the current user');
		}
	});
};

function cancelNotification(e) {
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Updating"
	});

	indicatorWindow.openIndicator();
	var invitationObject = {
		userFrom: e.source.data.userTo,
		userTo: e.source.data.userFrom,
		status: 'denied',
		notificationId: e.source.data.notificationId
	};
	friendsManager.updateFriendInvitationByUserIds( invitationObject, function(err, updateResult) {
		if(err) {
			helpers.alertUser('Oops','We are having trouble processing your request');
		} else {
			e.section.deleteItemsAt(e.itemIndex,1);
			if(!$.notificationSection.getItemAt(0)) {
				dynamicElement.defaultLabel('No new notifications!', function(err, results) {
					$.defaultView.height= Ti.UI.FILL;
					$.defaultView.add(results);
				});
			};
			updateUser();
		}
		indicatorWindow.closeIndicator();
		indicatorWindow = null;
	});
}

function acceptNotification(e) {
	var indicatorWindow = indicator.createIndicatorWindow({
		message : "Updating"
	});

	indicatorWindow.openIndicator();
	if(e.source.data.isSold) {
		var deleteObj = {
			notificationId: e.source.data.notificationId
		};
		notificationManager.deleteNotification(deleteObj, function(err, deleteResults) {
			if(err) {
				helpers.alertUser('Oops','We are having trouble processing your request');
			} else {
				e.section.deleteItemsAt(e.itemIndex,1);
				if(!$.notificationSection.getItemAt(0)) {
					dynamicElement.defaultLabel('No new notifications!', function(err, results) {
						$.defaultView.height= Ti.UI.FILL;
						$.defaultView.add(results);
					});
				};
				updateUser();
			}
			indicatorWindow.closeIndicator();
			indicatorWindow = null;
		});
	} else {
		var invitationObject = {
			userFrom: e.source.data.userTo,
			userTo: e.source.data.userFrom,
			status: 'approved',
			notificationId: e.source.data.notificationId
		};
		friendsManager.updateFriendInvitationByUserIds( invitationObject, function(err, updateResult) {
			if(err) {
				helpers.alertUser('Oops','We are having trouble processing your request');
			} else {
				e.section.deleteItemsAt(e.itemIndex,1);
				if(!$.notificationSection.getItemAt(0)) {
					dynamicElement.defaultLabel('No new notifications!', function(err, results) {
						$.defaultView.height= Ti.UI.FILL;
						$.defaultView.add(results);
					});
				};
				updateUser();
			}
			indicatorWindow.closeIndicator();
			indicatorWindow = null;
		});
	}
}
//-------------------------------------------Initializing Views/Styles----------------------------------------------------//



exports.cleanup = function () {
	Ti.API.info('Cleaning notificationsView');
	clearProxy();
	$.removeListener();
	$.notificationsView.removeAllChildren();
	$.notificationsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};

