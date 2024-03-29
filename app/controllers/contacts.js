/**
 * @class Contact Page where users can import their phone contact and Add/invite them to be their friends.
 */

var args = arguments[0] || {};
var friendsManager = require('managers/friendsmanager'),
    userManager = require('managers/usermanager'),
    dynamicElement = require('utilities/dynamicElement'),
    notificationManager = require('managers/notificationmanager');
var helpers = require('utilities/helpers');
var currentUser = null;
var currentContacts = [];
var contactsOnSelbi = null;
var heightDataView,
    fontSizeCheckMark,
    rightCheckMark,
    fontSizeTitleLabel,
    topTitleLabel,
    fontSizeSubtitleLabel,
    topSubtitleLabel,
    fontSizeHeader,
    heightHeader,
    leftLabel;

$.activityIndicator.show();

/**
 * @method getContactListTemplate
 * Returns a template used by contact list
 */
function getContactListTemplate() {
	return {
		childTemplates : [{
			type : 'Ti.UI.View',
			properties : {
				width : Ti.UI.FILL,
				height : heightDataView,
				backgroundColor : '#FAFAFA'
			},
		}, {// Title
			type : 'Ti.UI.Label', // Use a label for the title
			bindId : 'title', // Maps to a custom title property of the item data
			properties : {// Sets the label properties
				color : '#9B9B9B',
				font : {
					fontSize : fontSizeTitleLabel,
					fontFamily : 'Nunito-Bold'
				},
				left : leftLabel,
				top : topTitleLabel
			},
		}, {// Subtitle
			type : 'Ti.UI.Label', // Use a label for the subtitle
			bindId : 'subtitle', // Maps to a custom subtitle property of the item data
			properties : {// Sets the label properties
				color : '#9B9B9B',
				font : {
					fontSize : fontSizeSubtitleLabel,
					fontFamily : 'Nunito-Light'
				},
				left : leftLabel,
				top : topSubtitleLabel
			},
		}, {
			type : 'Ti.UI.View',
			bindId : 'data',
			properties : {
				width : Ti.UI.SIZE,
				height : heightCheckView,
				right : rightCheckMark,
				borderRadius: dataBorderRadius,
				borderColor: '#AFAFAF',
				layout: 'horizontal',
				backgroundColor:'#FAFAFA'
			},
			childTemplates : [{
				// View subcomponents can also have subcomponents
				type : 'Ti.UI.Label',
				bindId : 'checkmark',
				properties : {
					touchEnabled : false,
					font : {
						fontFamily : "FontAwesome",
						fontSize : fontSizeCheckMark,
					},
					top: checkmarkTop,
					left: checkmarkLeft,
					color : '#1BA7CD'
				},
			}],
			events : {
				// Bind event callbacks only to the subcomponent
				click : function(e) {
					if (e.source.status === 'new') {
						friendRequestDynamic(e, 'pending');
					} else if (e.source.status === 'denied') {
						friendRequestDynamic(e, 'pending');
					} else if (e.source.status === 'pending' && e.source.invitation[0].userTo === Ti.App.Properties.getString('userId')) {
						friendRequestDynamic(e, 'approved');
					} else if (e.source.status === 'pending' && e.source.invitation[0].userFrom === Ti.App.Properties.getString('userId')) {
						friendRequestDynamic(e, 'denied');
					} else if (e.source.status === 'approved') {
						friendRequestDynamic(e, 'denied');
					} else if (e.source.status === 'notOnSelbi') {
						inviteNewContact(e.source.data);
					}
				}
			},
		}
		]
	};
};


/**
 * @method friendRequestDynamic
 * @param {Object} e is the clicked object returned by Appcelerator
 * @param {String} newStatus Stringed status that invitation should be updated to
 * Returns friend invitation and corresponding icon to be displayed
 */
function friendRequestDynamic(e, newStatus) {
	var createInvitationObject = {
		userFrom : Ti.App.Properties.getString('userId'),
		userTo : e.source.data.id,
		status : newStatus,
	};
	var item = e.section && e.section.getItemAt(e.itemIndex) ? e.section.getItemAt(e.itemIndex).match : e.source.data.username;
	if (!e.section) {
		e.source.remove(e.source.children[0]);
		e.source.children[0] = null;
	}
	if (e.source.status === 'new') {
		friendsManager.createFriendInvitation(createInvitationObject, function(err, createInviteResult) {
			if (err) {
				return;
			} else {
				if (!e.section) {
					var checkSquare = Ti.UI.createLabel({
						width : Ti.UI.SIZE,
						color : '#FAFAFA',
						font : {
							fontSize : fontSizeCheckMark,
						},
						top: checkmarkTop,
						left: checkmarkLeft,
						touchEnabled : false
					});
					e.source.status = createInviteResult.invitation.status;
					e.source.invitation = [createInviteResult.invitation];
					$.fa.add(checkSquare, 'fa-check');
					e.source.add(checkSquare);
					checkSquare = null;
				}
				var userIndex = findIndexByKeyValue(currentContacts, 'match', item);
				if (userIndex != null) {
					var userContactData = currentContacts[userIndex];
					userContactData.data.status = createInviteResult.invitation.status;
					userContactData.data.invitation = [createInviteResult.invitation];
					userContactData.data.backgroundColor = '#1BA7CD';
					userContactData.checkmark.color = '#FAFAFA';
					userContactData.checkmark.text = '\uf00c  Pending   ';
					contactsOnSelbi.setItems(currentContacts);
				}
			}
		});
	} else if (newStatus === 'denied') {
		friendsManager.updateFriendInvitation(createInvitationObject, e.source.invitation[0].id, function(err, updateInvitationResult) {
			if (err) {
				return;
			} else {
				if (!e.section) {
					var plusSquare = Ti.UI.createLabel({
						width : Ti.UI.SIZE,
						color : '#1BA7CD',
						font : {
							fontSize : fontSizeCheckMark,
						},
						top: checkmarkTop,
						left: checkmarkLeft,
						touchEnabled : false
					});
					e.source.status = updateInvitationResult.invitation[0].status;
					e.source.invitation = updateInvitationResult.invitation;
					$.fa.add(plusSquare, 'fa-check');
					e.source.add(plusSquare);
					plusSquare = null;
				}
				var userIndex = findIndexByKeyValue(currentContacts, 'match', item);
				if (userIndex != null) {
					var userContactData = currentContacts[userIndex];
					userContactData.data.status = updateInvitationResult.invitation[0].status;
					userContactData.data.invitation = updateInvitationResult.invitation;
					userContactData.data.backgroundColor = determineStatusBoolean(updateInvitationResult.invitation) ? '#FAFAFA' : '#1BA7CD';
					userContactData.checkmark.color = determineStatusBoolean(updateInvitationResult.invitation) ? '#1BA7CD' : '#FAFAFA';
					userContactData.checkmark.text = determineStatus(updateInvitationResult.invitation);
					contactsOnSelbi.setItems(currentContacts);
				}
			}
		});
	} else {
		friendsManager.updateFriendInvitation(createInvitationObject, e.source.invitation[0].id, function(err, updateInvitationResult) {
			if (err) {
				return;
			} else {
				if (!e.section) {
					var checkSquare = Ti.UI.createLabel({
						width : Ti.UI.SIZE,
						color : '#FAFAFA',
						font : {
							fontSize : fontSizeCheckMark,
						},
						top: checkmarkTop,
						left: checkmarkLeft,
						touchEnabled : false
					});
					e.source.status = updateInvitationResult.invitation[0].status;
					e.source.invitation = updateInvitationResult.invitation;
					$.fa.add(checkSquare, 'fa-plus');
					e.source.add(checkSquare);
					checkSquare = null;
				}
			}
			if (newStatus === "approved") {
				notificationManager.countNotifications(function(err, notificationCount) {
					if (err) {

					} else {
						currentUser.set({
							'notificationCount' : notificationCount
						});
					}
				});
			}
			var userIndex = findIndexByKeyValue(currentContacts, 'match', item);
			if (userIndex != null) {
				var userContactData = currentContacts[userIndex];
				userContactData.data.status = updateInvitationResult.invitation[0].status;
				userContactData.data.invitation = updateInvitationResult.invitation;
				userContactData.data.backgroundColor = determineStatusBoolean(updateInvitationResult.invitation) ? '#FAFAFA' : '#1BA7CD';
				userContactData.checkmark.color = determineStatusBoolean(updateInvitationResult.invitation) ? '#1BA7CD' : '#FAFAFA';
				userContactData.checkmark.text = determineStatus(updateInvitationResult.invitation);
				contactsOnSelbi.setItems(currentContacts);
			}
		});
	}
}

function findIndexByKeyValue(obj, key, value) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i][key] == value) {
			return i;
		}
	}
	return null;
}

/**
 * @method createCustomView
 * Returns a template used by contact list
 */
var createCustomView = function(title) {
	var view = Ti.UI.createView({
		backgroundColor : '#E5E5E5',
		height : heightHeader
	});
	view.add(Ti.UI.createLabel({
		text : title,
		font : {
			fontSize : fontSizeHeader,
			fontFamily : 'Nunito-Bold'
		},
		left : leftLabel,
		color : '#9B9B9B',
	}));
	return view;
};

/**
 * @method loadContacts
 * Fetches the contacts from the users contact list and displays them
 */
function loadContacts() {
	var contactListView = Ti.UI.createListView({
		templates : {
			'template' : getContactListTemplate()
		},
		defaultItemTemplate : 'template',
		backgroundColor : '#FAFAFA',
		allowsSelection : false
	});
	contactsOnSelbi = Ti.UI.createListSection({
		headerView : createCustomView('Contacts on Selbi'),
	});
	contactsNotUsers = Ti.UI.createListSection({
		headerView : createCustomView('Invite to Selbi'),
		footerView : Ti.UI.createView({
			backgroundColor : '#E5E5E5',
			height : '1dp'
		})
	});
	currentContacts = [];
	var nonUsers = [];
	var phoneArray = [];
	var people = Ti.Contacts.getAllPeople();
	if (people) {
		
		for (var person in people) {
			if ((people[person].phone.mobile && people[person].phone.mobile.length > 0) || (people[person].phone.work && people[person].phone.work.length > 0) || (people[person].phone.home && people[person].phone.home.length > 0) || (people[person].phone.other && people[person].phone.other.length > 0)) {
				var phone = people[person].phone.mobile && people[person].phone.mobile.length > 0 ? people[person].phone.mobile[0] : people[person].phone.work && people[person].phone.work.length > 0 ? people[person].phone.work[0] : people[person].phone.home && people[person].phone.home.length > 0 ? people[person].phone.home[0] : people[person].phone.other && people[person].phone.other.length > 0 ? people[person].phone.other[0] : "";
				var newPhone = phone.replace(/\D+/g, "");
				if( newPhone.toString().length >= 10 && newPhone.toString().length <= 11) {
					if (newPhone.toString().length == 11 && newPhone.toString()[0] == '1') {
						newPhone = newPhone.slice(1);
					}
					if(Alloy.Globals.currentUser && (parseFloat(Alloy.Globals.currentUser.attributes.phoneNumber) != parseFloat(newPhone))) {
						var userPhoneObject = {
							newNumber : parseFloat(newPhone),
							originalNumber : phone,
							contactName : people[person] ? people[person].firstName + " " + people[person].lastName : "",
						};
						if(userPhoneObject.contactName.length > 1 ) {
							phoneArray.push(userPhoneObject);
						}	
					}
				}
			};
		};
		friendsManager.getSelbiUsersByPhones(phoneArray, function(err, results) {
			if(currentContacts==null){
				return;
			}
			if (err) {
				helpers.alertUser('Oops', 'Having trouble getting your phone contacts. Please try again later');
				addressBookDisallowed();
			}
			if (results) {
				results.sort(function(a, b) {
					var textA = a.contactName.toUpperCase();
					var textB = b.contactName.toUpperCase();
					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
				for (var user in results) {
					if (results[user].isActiveUser) {
						currentContacts.push({
							title : {
								text : helpers.alterTextFormat(results[user].contactName, 28, false)
							},
							subtitle : {
								text : results[user].username,
								color : '#AFAFAF'
							},
							data : {
								data : {
									invitation : results[user].invitation,
									id : results[user].id
								},
								id : results[user].username,
								status : results[user].invitation.length <= 0 ? "new" : results[user].invitation[0].status,
								invitation : results[user].invitation,
								backgroundColor : determineStatusBoolean(results[user].invitation) ? '#FAFAFA' : '#1BA7CD'
							},
							checkmark : {
								data : results[user].invitation,
								text : results[user].invitation.length <= 0 ? '\uf067  Add   ' : determineStatus(results[user].invitation),
								visible : true,
								ext : results[user].username,
								color : determineStatusBoolean(results[user].invitation) ? '#1BA7CD' : '#FAFAFA'
							},
							properties : {
								height : heightDataView
							},
							match : results[user].username
						});
					} else {
						nonUsers.push({
							title : {
								text : helpers.alterTextFormat(results[user].contactName, 28, false)
							},
							subtitle : {
								text : results[user].originalNumber
							},
							data : {
								data : {
									invitation : results[user].invitation,
									id : results[user].id,
									newNumber : results[user].newNumber,
									status : 'notOnSelbi'
								},
								id : results[user].username,
								invitation : results[user].invitation,
								newNumber : results[user].newNumber,
								status : 'notOnSelbi',
								backgroundColor : '#FAFAFA'
							},
							checkmark : {
								data : results[user].invitation,
								text : '\uf067  Invite   ',
								visible : true,
								ext : results[user].username,
								touchEnabled : false
							},
							properties : {
								height : heightDataView
							}
						});
					}
				}
				if (currentContacts.length === 0) {
					currentContacts.push({
						properties : {
							height : heightDataView
						},
						checkmark: {
							top: '',
							left: '',
						},
						match : 'empty'
					});
				}
				contactsOnSelbi.setItems(currentContacts);
				contactsNotUsers.setItems(nonUsers);
				contactListView.setSections([contactsOnSelbi, contactsNotUsers]);
				$.addContactsView.add(contactListView);
				$.activityIndicator.hide();
				$.activityIndicator.height = '0dp';
			}
		});
	}
}

/**
 * @method addressBookDisallowed
 * Delegate callback executed when access to contacts is not allowed
 */
function addressBookDisallowed() {
	dynamicElement.defaultLabel('Go to your phone\'s settings and turn on Contacts for Selbi.', function(err, results) {
		$.defaultView.height = Ti.UI.FILL;
		$.defaultView.add(results);
	});
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
}

/**
 * @method importContacts
 * Get access to contact list
 */
function importContacts() {
	if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
		loadContacts();
	} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN) {
		Ti.Contacts.requestAuthorization(function(e) {
			if (e.success) {
				loadContacts();
			} else {
				addressBookDisallowed();
			}
		});
	} else {
		addressBookDisallowed();
	}
};

/**
 * @method determineStatus
 * @param {Array} invitation is the invitation object returned by Selbi
 * Determines invitation status for dynamic fontawesome elements
 */
function determineStatus(invitation) {
	if (invitation.length <= 0) {
		return '\uf067  Add   ';
	} else if (invitation[0].status === 'denied') {
		return '\uf067  Add   ';
	} else if (invitation[0].status === 'pending' && invitation[0].userTo === Ti.App.Properties.getString('userId')) {
		return '\uf067  Add   ';
	} else if (invitation[0].status === 'pending' && invitation[0].userFrom === Ti.App.Properties.getString('userId')) {
		return '\uf00c  Pending   ';
	} else if (invitation[0].status === 'approved') {
		return '\uf00c  Added   ';
	}
};


/**
 * @method determineStatusBoolean
 * @param {Array} invitation is the invitation object returned by Selbi
 * Determines invitation status for dynamic properties (backgroundColor etc)
 */
function determineStatusBoolean(invitation) {
	if (invitation.length <= 0 || (invitation[0].status === 'denied') || (invitation[0].status === 'pending' && invitation[0].userTo === Ti.App.Properties.getString('userId'))) {
		return true;
	}
	return false;
};

/**
 * @private inviteNewContact
 *  Opens SMS text to send a text telling new user to join Selbi
 *  @param {Object} Data is an object containing the user's number to invite with SMS text
 */

function inviteNewContact(data) {
	var module = require('com.omorandi');

	//create the smsDialog object
	var smsDialog = module.createSMSDialog();
	//check if the feature is available on the device at hand
	if (!smsDialog.isSupported()) {
		//falls here when executed on iOS versions < 4.0 and in the emulator
		var a = Ti.UI.createAlertDialog({
			title : 'Oops!',
			message : 'This feature is not available on your device!'
		});
		a.show();
	} else {
		//pre-populate the dialog with the info provided in the following properties
		smsDialog.recipients = [''+data.newNumber+''];
		smsDialog.messageBody = 'Get ready for Selbi! The premier friend to friend marketplace, coming soon to the App Store!';

		//set the color of the title-bar
		smsDialog.barColor = '#1BA7CD';

		//add an event listener for the 'complete' event, in order to be notified about the result of the operation
		smsDialog.addEventListener('complete', function(e) {
			if (e.result == smsDialog.SENT) {
				//do something
			} else if (e.result == smsDialog.FAILED) {
				//do something else
				var a = Ti.UI.createAlertDialog({
					title : 'Oops',
					message : 'Your message failed to send!'
				});
				a.show();
			} else if (e.result == smsDialog.CANCELLED) {
				//don't bother
			}
		});

		//open the SMS dialog window with slide-up animation
		smsDialog.open({
			animated : true
		});

	}
	//Ti.Platform.openURL('sms://'+data.newNumber);
	return;
};

/**
 * @method openFriends
 * Opens addFriends page so user can add friends and accept pending friends on Selbi
 */
function openFriends(e) {
	Alloy.Globals.openPage('addfriends');
};

/**
 * @method clearProxy
 * Clears up memory leaks from dynamic elements created when page closes
 */
function clearProxy(e) {
	$.off();
	$.destroy();
	if (contactsOnSelbi) {
		contactsOnSelbi.items = [];
		contactsNotUsers.items = [];
		$.addContactsView.children[$.addContactsView.children.length - 1].sections = [];
		contactsOnSelbi = null;
		contactsNotUsers = null;
	}
	$.addContactsView.children[$.addContactsView.children.length - 1].hide();
	currentContacts = null;
	contactsOnSelbi = null;
}

/*----------------------------------------------Dynamic Elements---------------------------------------------*/

switch(Alloy.Globals.userDevice) {
case 0:
	//iphoneFour
	heightDataView = '45dp';
	heightCheckView = '24dp';
	fontSizeCheckMark = '10dp';
	rightCheckMark = '15dp';
	fontSizeTitleLabel = '15dp';
	topTitleLabel = '6dp';
	fontSizeSubtitleLabel = '11dp';
	topSubtitleLabel = '25dp';
	fontSizeHeader = '13dp';
	heightHeader = '25dp';
	leftLabel = '15dp';
	checkmarkTop = '7dp';
	checkmarkLeft = '8dp';
	dataBorderRadius = '12dp';
	break;
case 1:
	//iphoneFive
	heightDataView = '55dp';
	heightCheckView = '26dp';
	fontSizeCheckMark = '12dp';
	rightCheckMark = '15dp';
	fontSizeTitleLabel = '17dp';
	topTitleLabel = '7dp';
	fontSizeSubtitleLabel = '13dp';
	topSubtitleLabel = '29dp';
	fontSizeHeader = '15dp';
	heightHeader = '28dp';
	leftLabel = '15dp';
	checkmarkTop = '7dp';
	checkmarkLeft = '9dp';
	dataBorderRadius = '13dp';
	break;
case 2:
	//iphoneSix
	heightDataView = '65dp';
	heightCheckView = '30dp';
	fontSizeCheckMark = '14dp';
	rightCheckMark = '20dp';
	fontSizeTitleLabel = '19dp';
	topTitleLabel = '10dp';
	fontSizeSubtitleLabel = '15dp';
	topSubtitleLabel = '34dp';
	fontSizeHeader = '16dp';
	heightHeader = '28dp';
	leftLabel = '20dp';
	checkmarkTop = '8dp';
	checkmarkLeft = '10dp';
	dataBorderRadius = '15dp';
	break;
case 3:
	//iphoneSixPlus
	heightDataView = '75dp';
	heightCheckView = '32dp';
	fontSizeCheckMark = '15dp';
	rightCheckMark = '20dp';
	fontSizeTitleLabel = '20dp';
	topTitleLabel = '12dp';
	fontSizeSubtitleLabel = '16dp';
	topSubtitleLabel = '38dp';
	fontSizeHeader = '17dp';
	heightHeader = '30dp';
	leftLabel = '20dp';
	checkmarkTop = '8dp';
	checkmarkLeft = '10dp';
	dataBorderRadius = '16dp';
	break;
case 4:
	//android currently same as iphoneSix
	heightDataView = '65dp';
	heightCheckView = '30dp';
	fontSizeCheckMark = '15dp';
	rightCheckMark = '20dp';
	fontSizeTitleLabel = '19dp';
	topTitleLabel = '10dp';
	fontSizeSubtitleLabel = '16dp';
	topSubtitleLabel = '34dp';
	fontSizeHeader = '16dp';
	heightHeader = '28dp';
	leftLabel = '20dp';
	checkmarkTop = '7dp';
	checkmarkLeft = '10dp';
	dataBorderRadius = '15dp';
	break;
};

/*----------------------------------------------On page load calls---------------------------------------------*/

importContacts();

//Load the user model
Alloy.Models.user.fetch({
	success : function(data) {
		currentUser = data;
	},
	error : function(data) {
	}
});

/*-------------------------------------------------Event Listeners---------------------------------------------------*/


exports.cleanup = function() {
	clearProxy();
	Alloy.Globals.removeChildren($.addContactsView);
	$.addContactsView = null;
	Alloy.Globals.deallocate($);
	$ = null;
}; 