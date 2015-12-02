/**
 * @class Contact Page where users can import their phone contact and Add/invite them to be their friends.
 */

var args = arguments[0] || {};
var friendsManager = require('managers/friendsmanager'),
	userManager = require('managers/usermanager'),
	dynamicElement = require('utilities/dynamicElement');
var helpers = require('utilities/helpers');
var nameFontSize, iconSize, labelTop, labelLeft, 
	iconRight, headerViewHeight, headerLabelFontSize;

$.activityIndicator.show();


/**
 * @method getContactListTemplate
 * Returns a template used by contact list
 */
function getContactListTemplate() {
	return {
		 childTemplates: [
		 	{
		 		type: 'Ti.UI.View',
		 		properties: {
		 			width: Ti.UI.FILL,
		 			height: heightDataView,
		 			backgroundColor: '#FAFAFA'
		 		},
		 	},
	        {                            // Title
	            type: 'Ti.UI.Label',     // Use a label for the title
	            bindId: 'title',         // Maps to a custom title property of the item data
	            properties: {            // Sets the label properties
	                color: '#9B9B9B',
	                font: {
						fontSize: fontSizeTitleLabel,
						fontFamily: 'Nunito-Bold'
					},
	                left: leftLabel, 
	                top: topTitleLabel
	            },
	        },
	        {                            // Subtitle
	            type: 'Ti.UI.Label',     // Use a label for the subtitle
	            bindId: 'subtitle',      // Maps to a custom subtitle property of the item data
	            properties: {            // Sets the label properties
	                color: '#9B9B9B',
	                font: {
						fontSize: fontSizeSubtitleLabel,
						fontFamily: 'Nunito-Light'
					},
	                left: leftLabel, 
	                top: topSubtitleLabel
	            },
	        },
	        {
		 		type: 'Ti.UI.View',
		 		bindId: 'data',
		 		properties: {
		 			width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
		 			right: rightCheckMark
		 			
		 		},
		 		childTemplates: [ {
                // View subcomponents can also have subcomponents
	               	type: 'Ti.UI.Label',
	               	bindId: 'checkmark',
			 		properties: {
			 			touchEnabled:false,
					    font : {
					        fontFamily : "FontAwesome",
					        fontSize: fontSizeCheckMark,
					    },
					    color: '#1BA7CD'
			 		},
            	}],
		 		events: {
	                // Bind event callbacks only to the subcomponent
	                click: function(e){
	                	//console.log('DATA', e.bindId);
                		if(e.source.status === 'new') {
							friendRequestDynamic(e, 'pending');
						} else if(e.source.status === 'denied') {
							friendRequestDynamic(e, 'pending');
						} else if(e.source.status === 'pending' && e.source.invitation[0].userTo === Ti.App.Properties.getString('userId')) {
							friendRequestDynamic(e, 'approved');
						} else if(e.source.status === 'pending' && e.source.invitation[0].userFrom === Ti.App.Properties.getString('userId') ) {
							friendRequestDynamic(e, 'denied');
						} else if(e.source.status === 'approved') {
							friendRequestDynamic(e, 'denied');
						}
	                }
            	},
		 	},
		 	
	    ]
	};
};



/**
 * @method getContactListTemplate
 * Returns a template used by contact list
 */
function getFriendsSection() {
	return {
		 childTemplates: [
	        {                           	// Title
	            type: 'Ti.UI.TextField',    // Use a label for the title
	            bindId: 'userNameSearch',   // Maps to a custom title property of the item data
	            properties: { 	         	// Sets the label properties
	            	width: Ti.UI.FILL,
					height: heightDataView,
					maxLength: "20",	            		            	
	                color: '#9B9B9B',
	                font: {
						fontSize: fontSizeTitleLabel,
						fontFamily: 'Nunito-Light'
					},
	                left: leftLabel,
	                hintText: 'Enter a username to add a friend!'
	            },
	            events: {
	                // Bind event callbacks only to the subcomponent
	                change: function(e){
	                	var uniqueUserRegEx = e.value.length > 0 ? (e.value).match(/^[a-zA-Z\d\_]+$/) : '';
                		var usernameObject = {
							username: helpers.trim(e.value, true).toLowerCase()
						};
						if(e.source.children.length > 0 && (!uniqueUserRegEx || uniqueUserRegEx)){
								e.source.remove(e.source.children[0]);
						};
						if(uniqueUserRegEx === null) {
							helpers.alertUser('Oops','Usernames are only letters and numbers!');
	                		return;
	                	}
						if(helpers.trim(e.value, true).length > 6){
							friendsManager.getInvitationByUsername( usernameObject, function(err, results) {
								//console.log('Results of username Search', results,'errererrrr' ,err);
								if(results && results.id != Ti.App.Properties.getString('userId')) {
									if(e.source.children.length > 0 ){
										e.source.remove(e.source.children[0]);
									};
									var hiddenView = Ti.UI.createView({
										width: Ti.UI.SIZE,
										height: Ti.UI.SIZE,
										ext: e.source,
										right: rightCheckMark,
										data: results,
										invitation: results.invitation,
										status: results.invitation.length <= 0 ? "new" : results.invitation[0].status 
									});
									var labelStuff = Ti.UI.createLabel({
										width: Ti.UI.SIZE,
				                		color: '#1BA7CD',
				                		font: {
				                			fontSize: fontSizeCheckMark,
				                		},
				                		touchEnabled: false
									});
									var labelIcon = results.invitation.length <= 0 ? 'fa-plus-square-o' : results.invitation[0].status === 'denied' ? 'fa-plus-square-o' :  results.invitation[0].status === 'pending' && results.invitation[0].userFrom != Ti.App.Properties.getString('userId') ? 'fa-plus-square-o' : 'fa-check-square';
									$.fa.add(labelStuff, labelIcon);
									hiddenView.add(labelStuff);
									e.source.add(hiddenView);
									hiddenView.addEventListener('click', function(e) {										
										if(e.source.status === 'new') {
											friendRequestDynamic(e, 'pending');
										} else if(e.source.status === 'denied') {
											friendRequestDynamic(e, 'pending');
										} else if(e.source.status === 'pending' && e.source.invitation[0].userTo === Ti.App.Properties.getString('userId')) {
											friendRequestDynamic(e, 'approved');
										} else if(e.source.status === 'pending' && e.source.invitation[0].userFrom === Ti.App.Properties.getString('userId') ) {
											friendRequestDynamic(e, 'denied');
										} else if(e.source.status === 'approved') {
											friendRequestDynamic(e, 'denied');
										}
									});
								}
							});
						}
	                }
            	},
	        },
	    ]
	};
}



/**
 * @method friendRequestDynamic
 * @param {Object} e is the clicked object returned by Appcelerator
 * @param {String} newStatus Stringed status that invitation should be updated to
 * Returns friend invitation and corresponding icon to be displayed
 */
function friendRequestDynamic(e, newStatus){
	var createInvitationObject = {
			userFrom: Ti.App.Properties.getString('userId'),
			userTo: e.source.data.id,
			status: newStatus,
	};
	e.source.remove(e.source.children[0]);
	if(e.source.status === 'new') {
		friendsManager.createFriendInvitation( createInvitationObject, function(err, createInviteResult) {
			if(err) {
				return;
			} else {
				var checkSquare = Ti.UI.createLabel({
					width: Ti.UI.SIZE,
            		color: '#1BA7CD',
            		font: {
            			fontSize: fontSizeCheckMark,
            		},
            		touchEnabled: false
				});
				e.source.status = createInviteResult.invitation.status;
				e.source.invitation = [createInviteResult.invitation];
				$.fa.add(checkSquare, 'fa-check-square');
				e.source.add(checkSquare);
			}
		});
	} else if(newStatus === 'denied') {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.invitation[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			} else {
				var plusSquare = Ti.UI.createLabel({
					width: Ti.UI.SIZE,
					color: '#1BA7CD',
					font: {
						fontSize: fontSizeCheckMark,
					},
					touchEnabled: false
				});
				e.source.status = updateInvitationResult.invitation[0].status;
				e.source.invitation = updateInvitationResult.invitation;
				$.fa.add(plusSquare, 'fa-plus-square-o');
				e.source.add(plusSquare);
			}
		});
	} else {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.invitation[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			} else {
				var checkSquare = Ti.UI.createLabel({
					width: Ti.UI.SIZE,
            		color: '#1BA7CD',
            		font: {
            			fontSize: fontSizeCheckMark,
            		},
            		touchEnabled: false
				});
				e.source.status = updateInvitationResult.invitation[0].status;
				e.source.invitation = updateInvitationResult.invitation;
				$.fa.add(checkSquare, 'fa-check-square');
				e.source.add(checkSquare);
			}
		});
	}
}





/**
 * @method createCustomView
 * Returns a template used by contact list
 */
var createCustomView = function(title) {
    var view = Ti.UI.createView({
        backgroundColor: '#E5E5E5',
        height: heightHeader
    });
    var text = Ti.UI.createLabel({
        text: title,
        font: {
			fontSize: fontSizeHeader,
			fontFamily: 'Nunito-Bold'
		},
        left: leftLabel,
        color: '#9B9B9B',
    });
    view.add(text);
    return view;
};


/**
 * @method loadContacts
 * Fetches the contacts from the users contact list and displays them
 */
function loadContacts() {
	var contactListView = Ti.UI.createListView({
		templates: {
			'template': getContactListTemplate(),
			'getFriendsSection': getFriendsSection()
		},
		defaultItemTemplate: 'template',
		backgroundColor: '#FAFAFA',
		allowsSelection: false
	});
	var contactsOnSelbi = Ti.UI.createListSection({
		headerView: createCustomView('Contacts on Selbi'),
	});
	var contactsNotUsers = Ti.UI.createListSection({
		headerView: createCustomView('Not on Selbi'),
		footerView: Ti.UI.createView({
		        backgroundColor: '#E5E5E5',
		        height: '1dp'
		})	
	});
	var addFriendSection = Ti.UI.createListSection({
		headerView: createCustomView('Add friends on Selbi'),
	});
	var currentUsers = [];
	var searchUsers = [];
	var nonUsers = [];
	var phoneArray = [];
	var people = Ti.Contacts.getAllPeople();
	if(people) {
		var practiceToDelete = {
			newNumber: '5551112222',
			originalNumber: '5551112222',
			contactName: 'Steven Collins'
		};
		phoneArray.push(practiceToDelete);
		for(var person in people) {
			if((people[person].phone.mobile && people[person].phone.mobile.length > 0) || (people[person].phone.work && people[person].phone.work.length > 0) || (people[person].phone.home && people[person].phone.home.length > 0) || (people[person].phone.other && people[person].phone.other.length > 0)) {
				var phone = people[person].phone.mobile && people[person].phone.mobile.length > 0 ? people[person].phone.mobile[0] : people[person].phone.work && people[person].phone.work.length > 0 ? people[person].phone.work[0] : people[person].phone.home && people[person].phone.home.length > 0 ? people[person].phone.home[0] : people[person].phone.other && people[person].phone.other.length > 0 ? people[person].phone.other[0] : "";
				var newPhone = phone.replace(/\D+/g, "");
				var userPhoneObject = {
					newNumber: newPhone,
					originalNumber: phone,
					contactName: people[person] ? people[person].firstName + " " + people[person].lastName: "NA",
				};
				if(Alloy.Globals.currentUser && Alloy.Globals.currentUser.attributes.phoneNumber != newPhone) {
					phoneArray.push(userPhoneObject);
				}
			};
		};
		friendsManager.getSelbiUsersByPhones(phoneArray,function(err, results){
			//console.log('!2121212121212 ', results);
			if(err) {
				helpers.alertUser('Oops','Having trouble getting your phone contacts. Please try again later!');
				addressBookDisallowed();
			}
			if(results) {
				results.sort(function(a, b) {
				    var textA = a.contactName.toUpperCase();
				    var textB = b.contactName.toUpperCase();
				    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
				for(var user in results) {
					if(results[user].isActiveUser){
						currentUsers.push({
							title: { text: helpers.alterTextFormat(results[user].contactName, 28, false) },
						 	subtitle: {text: "Using Selbi", color:'#1BA7CD'},
						 	data: { data: {invitation: results[user].invitation, id: results[user].id }, id: results[user].username, status: results[user].invitation.length <= 0 ? "new" : results[user].invitation[0].status, invitation: results[user].invitation },
						 	checkmark : {data: results[user].invitation, text : results[user].invitation.length <= 0 ? '\uf196' : determineStatus(results[user].invitation), visible: true, ext: results[user].username},
						 	properties: {
								height: heightDataView
							}
						});
					} else {
						nonUsers.push({
							title: { text: helpers.alterTextFormat(results[user].contactName, 28, false) },
						 	subtitle: {text: results[user].originalNumber },
							data: { data: {invitation: results[user].invitation, id: results[user].id }, id: results[user].username, invitation: results[user].invitation},
							checkmark : {data: results[user].invitation, text : '\uf196', visible: false , ext: results[user].username, touchEnabled: false},
							properties: {
								height: heightDataView
							}
						});
					}
				}
				if(currentUsers.length === 0) {
					currentUsers.push({
						properties: {
							height: heightDataView
						}
					});
			}
				searchUsers.push({
					properties: {
						height: heightDataView
					},
					template: 'getFriendsSection'	
				});
				contactsOnSelbi.setItems(currentUsers);
				contactsNotUsers.setItems(nonUsers);
				addFriendSection.setItems(searchUsers);
				contactListView.sections = [addFriendSection, contactsOnSelbi, contactsNotUsers];
				$.addFriendsView.add(contactListView);
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
	dynamicElement.defaultLabel('No access to contacts!', function(err, results) {
		$.defaultView.height= Ti.UI.FILL;
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
	if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED){
    	loadContacts();
	} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN){
	    Ti.Contacts.requestAuthorization(function(e){
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
	if(invitation.length <= 0 ) {
		return '\uf196';
	} else if(invitation[0].status === 'denied') {
		return '\uf196';
	} else if(invitation[0].status === 'pending' && invitation[0].userTo === Ti.App.Properties.getString('userId')) {
		return '\uf196';
	} else if(invitation[0].status === 'pending' && invitation[0].userFrom === Ti.App.Properties.getString('userId') ) {
		return '\uf14a';
	} else if(invitation[0].status === 'approved') {
		return '\uf14a';
	}
};


/*----------------------------------------------Dynamic Elements---------------------------------------------*/

switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        heightDataView = '40dp';
	        fontSizeCheckMark = '14dp';
	        rightCheckMark = '15dp';
	        fontSizeTitleLabel = '14dp';
	        topTitleLabel = '3dp';
			fontSizeSubtitleLabel = '11dp';
			topSubtitleLabel = '22dp';
			fontSizeHeader = '13dp';
			heightHeader = '25dp';
			leftLabel = '15dp';
	        break;
	    case 1: //iphoneFive
	    	heightDataView = '45dp';
	        fontSizeCheckMark = '16dp';
	        rightCheckMark = '15dp';
	        fontSizeTitleLabel = '16dp';
	        topTitleLabel = '4dp';
			fontSizeSubtitleLabel = '13dp';
			topSubtitleLabel = '24dp';
			fontSizeHeader = '14dp';
			heightHeader = '28dp';
			leftLabel = '15dp';
	        break;
	    case 2: //iphoneSix
	        heightDataView = '50dp';
	        fontSizeCheckMark = '18dp';
	        rightCheckMark = '20dp';
	        fontSizeTitleLabel = '18dp';
	        topTitleLabel = '4dp';
			fontSizeSubtitleLabel = '15dp';
			topSubtitleLabel = '27dp';
			fontSizeHeader = '16dp';
			heightHeader = '28dp';
			leftLabel = '20dp';
	        break;
	    case 3: //iphoneSixPlus
	    	heightDataView = '55dp';
	        fontSizeCheckMark = '20dp';
	        rightCheckMark = '20dp';
	        fontSizeTitleLabel = '20dp';
	        topTitleLabel = '4dp';
			fontSizeSubtitleLabel = '16dp';
			topSubtitleLabel = '29dp';
			fontSizeHeader = '17dp';
			heightHeader = '30dp';
			leftLabel = '20dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        heightDataView = '50dp';
	        fontSizeCheckMark = '18dp';
	        rightCheckMark = '20dp';
	        fontSizeTitleLabel = '18dp';
	        topTitleLabel = '4dp';
			fontSizeSubtitleLabel = '16dp';
			topSubtitleLabel = '27dp';
			fontSizeHeader = '16dp';
			heightHeader = '28dp';
			leftLabel = '20dp';
	        break;
	};







/*----------------------------------------------On page load calls---------------------------------------------*/

importContacts();

