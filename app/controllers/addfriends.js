/**
 * @class Add Friends Page where users can see all their friends and Add/invite others to be their friends.
 */

var args = arguments[0] || {};
var friendsManager = require('managers/friendsmanager'),
	userManager = require('managers/usermanager'),
	dynamicElement = require('utilities/dynamicElement'),
	notificationManager = require('managers/notificationmanager');
var helpers = require('utilities/helpers');
var currentUser = null;
var contactListView = null;
var currentFriends = [];
var searchUsers = [];
var pendingFriends = [];
var friendsOnSelbi = null;
var friendsPending = null;
var addFriendSection = null;
var nameFontSize, iconSize, labelTop, labelLeft, 
	iconRight, headerViewHeight, headerLabelFontSize;

$.activityIndicator.show();


/**
 * @method getFriendsListTemplate
 * Returns a template used by contact list
 */
function getFriendsListTemplate() {
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
 * @method getFriendsSection
 * Returns a template used to search for friends
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
	var item = e.section && e.section.getItemAt(e.itemIndex) ? e.section.getItemAt(e.itemIndex) : '';
	if(!item) {
		e.source.remove(e.source.children[0]);
	}	
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
				var emptySectionIndex = findIndexByKeyValue(pendingFriends, 'match', 'empty');
				if(emptySectionIndex != null) {
					pendingFriends = [];
				}
				pendingFriends.push({
					title: { text: helpers.alterTextFormat(e.source.data.firstName + ' ' + e.source.data.lastName, 28, false) },
				 	subtitle: {text: "Pending To...", color:'#1BA7CD' },
					data: { data: {invitation: e.source.data.invitation, id: e.source.data.id }, id: e.source.data.username, status: "pending", invitation: e.source.data.invitation },
					checkmark : {data: e.source.data.invitation, text: '\uf14a', visible: true, ext: e.source.data.username},
					properties: {
						height: heightDataView
					},
					match: e.source.data.username
				});
				friendsPending.setItems(pendingFriends);
				contactListView.sections[0].value;
				//$.addFriendsView.remove(contactListView);
				//loadFriends();
			}
		});
	} else if(newStatus === 'denied') {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.invitation[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			}
			if(item) {
				var pendingFriendsIndex = findIndexByKeyValue(pendingFriends, 'match', item.match);
				var currentFriendsIndex = findIndexByKeyValue(currentFriends, 'match', item.match);
				if(pendingFriendsIndex != null && item.data.data.invitation[0].userFrom != Ti.App.Properties.getString('userId')) {
					var friendsUserData = pendingFriends.splice(pendingFriendsIndex, 1);
					friendsUserData[0].subtitle.text = "Friends";					
					friendsUserData[0].data.status = updateInvitationResult.invitation[0].status;
					friendsUserData[0].data.invitation = updateInvitationResult.invitation;
					friendsUserData[0].checkmark.text = determineStatus(updateInvitationResult.invitation);
					var emptySectionIndex = findIndexByKeyValue(currentFriends, 'match', 'empty');
					if(emptySectionIndex != null) {
						currentFriends = [];
					}
					if(pendingFriends.length === 0) {
						pendingFriends.push({
							properties: {
								height: heightDataView
							},
							match: 'empty'
						});
					}
					currentFriends.push(friendsUserData[0]);
					friendsOnSelbi.setItems(currentFriends);
					friendsPending.setItems(pendingFriends);
				} else if(pendingFriendsIndex != null && item.data.data.invitation[0].userFrom === Ti.App.Properties.getString('userId')) {
					pendingFriends.splice(pendingFriendsIndex, 1);
					if(pendingFriends.length === 0) {
						pendingFriends.push({
							properties: {
								height: heightDataView
							},
							match: 'empty'
						});
					}
					friendsPending.setItems(pendingFriends);
				} else {
					var friendsUserData = currentFriends.splice(currentFriendsIndex, 1);
					if(currentFriends.length === 0) {
						currentFriends.push({
							properties: {
								height: heightDataView
							},
							match: 'empty'
						});
					}
					friendsOnSelbi.setItems(currentFriends);
				}
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
				var pendingFriendsIndex = findIndexByKeyValue(pendingFriends, 'match', e.source.data.username);
				var currentFriendsIndex = findIndexByKeyValue(currentFriends, 'match', e.source.data.username);
				if(currentFriendsIndex != null) {
					var friendsUserData = currentFriends.splice(currentFriendsIndex, 1);
					if(currentFriends.length === 0) {
						currentFriends.push({
							properties: {
								height: heightDataView
							},
							match: 'empty'
						});
					}
					friendsOnSelbi.setItems(currentFriends);
				} else if(pendingFriendsIndex != null) {
					var friendsUserData = pendingFriends.splice(pendingFriendsIndex, 1);
					if(pendingFriends.length === 0) {
						pendingFriends.push({
							properties: {
								height: heightDataView
							},
							match: 'empty'
						});
					}
					friendsPending.setItems(pendingFriends);
				}
			}
		});
	} else {
		friendsManager.updateFriendInvitation( createInvitationObject, e.source.invitation[0].id, function(err, updateInvitationResult) {
			if(err) {
				return;
			}
			if(newStatus === "approved") {
				notificationManager.countNotifications(function(err, notificationCount) {
					if(err) {
						
					} else {
						currentUser.set({'notificationCount': notificationCount});
					}
				});	
			}
			var pendingFriendsIndex = item ? findIndexByKeyValue(pendingFriends, 'match', item.match) : findIndexByKeyValue(pendingFriends, 'match', e.source.data.username);
			if( pendingFriendsIndex != null && ((item && item.data.data.invitation[0].userFrom != Ti.App.Properties.getString('userId')) || (!item && e.source.data.invitation[0].userFrom != Ti.App.Properties.getString('userId'))) ) {
				var friendsUserData = pendingFriends.splice(pendingFriendsIndex, 1);
				friendsUserData[0].subtitle.text = "Friends";					
				friendsUserData[0].data.status = updateInvitationResult.invitation[0].status;
				friendsUserData[0].data.invitation = updateInvitationResult.invitation;
				friendsUserData[0].checkmark.text = determineStatus(updateInvitationResult.invitation);
				var emptySectionIndex = findIndexByKeyValue(currentFriends, 'match', 'empty');
				if(emptySectionIndex != null) {
					currentFriends = [];
				}
				if(pendingFriends.length === 0) {
					pendingFriends.push({
						properties: {
							height: heightDataView
						},
						match: 'empty'
					});
				}
				currentFriends.push(friendsUserData[0]);
				friendsOnSelbi.setItems(currentFriends);
				friendsPending.setItems(pendingFriends);
			} else if(pendingFriendsIndex != null && ((item && item.data.data.invitation[0].userFrom === Ti.App.Properties.getString('userId')) || (!item && e.source.data.invitation[0].userFrom === Ti.App.Properties.getString('userId')))) {
				var friendsUserData = pendingFriends.splice(pendingFriendsIndex, 1);
				if(pendingFriends.length === 0) {
					pendingFriends.push({
						properties: {
							height: heightDataView
						},
						match: 'empty'
					});
				}
				friendsPending.setItems(pendingFriends);
			} else {
				var emptySectionIndex = findIndexByKeyValue(pendingFriends, 'match', 'empty');
				if(emptySectionIndex != null) {
					pendingFriends = [];
				}
				pendingFriends.push({
					title: { text: helpers.alterTextFormat(e.source.data.firstName + ' ' + e.source.data.lastName, 28, false) },
				 	subtitle: {text: "Pending To...", color:'#1BA7CD' },
					data: { data: {invitation: e.source.data.invitation, id: e.source.data.id }, id: e.source.data.username, status: "pending", invitation: e.source.data.invitation },
					checkmark : {data: e.source.data.invitation, text: '\uf14a', visible: true, ext: e.source.data.username},
					properties: {
						height: heightDataView
					},
					match: e.source.data.username
				});
				friendsPending.setItems(pendingFriends);
			}
			if(!item) {
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

function findIndexByKeyValue(obj, key, value)
{
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
 * @method loadFriends
 * Fetches the contacts from the users contact list and displays them
 */
function loadFriends() {
	contactListView = Ti.UI.createListView({
		templates: {
			'template': getFriendsListTemplate(),
			'getFriendsSection': getFriendsSection()
		},
		defaultItemTemplate: 'template',
		backgroundColor: '#FAFAFA',
		allowsSelection: false
	});
	friendsOnSelbi = Ti.UI.createListSection({
		headerView: createCustomView('Friends on Selbi'),
	});
	friendsPending = Ti.UI.createListSection({
		headerView: createCustomView('Pending Requests'),
		footerView: Ti.UI.createView({
		        backgroundColor: '#E5E5E5',
		        height: '1dp'
		})	
	});
	addFriendSection = Ti.UI.createListSection({
		headerView: createCustomView('Add friends on Selbi'),
	});
	currentFriends = [];
	searchUsers = [];
	pendingFriends = [];
	friendsManager.getUserInvitationsByUserId(function(err, results){
		if(err) {
			addFriendsLoadError();
		}
		if(results) {
			results.sort(function(a, b) {
			    var textA = a.firstName.toUpperCase();
			    var textB = b.firstName.toUpperCase();
			    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});
			for(var user in results) {
				if(results[user].invitation[0].status === 'approved'){
					currentFriends.push({
						title: { text: helpers.alterTextFormat(results[user].firstName + ' ' + results[user].lastName, 28, false) },
					 	subtitle: {text: "Friends", color:'#1BA7CD'},
					 	data: { data: {invitation: results[user].invitation, id: results[user].id }, id: results[user].username, status: "approved", invitation: results[user].invitation },
					 	checkmark : {data: results[user].invitation, text : results[user].invitation.length <= 0 ? '\uf196' : determineStatus(results[user].invitation), visible: true, ext: results[user].username},
					 	properties: {
							height: heightDataView
						},
						match: results[user].username
					});
				} else {
					pendingFriends.push({
						title: { text: helpers.alterTextFormat(results[user].firstName + ' ' + results[user].lastName, 28, false) },
					 	subtitle: {text: results[user].invitation[0].userFrom === Ti.App.Properties.getString('userId') ? "Pending To..." : "Pending From...", color:'#1BA7CD' },
						data: { data: {invitation: results[user].invitation, id: results[user].id }, id: results[user].username, status: "pending", invitation: results[user].invitation },
						checkmark : {data: results[user].invitation, text : results[user].invitation.length <= 0 ? '\uf196' : determineStatus(results[user].invitation), visible: true, ext: results[user].username},
						properties: {
							height: heightDataView
						},
						match: results[user].username
					});
				}
			}
			if(currentFriends.length === 0) {
				currentFriends.push({
					properties: {
						height: heightDataView
					},
					match: 'empty'
				});
			}
			if(pendingFriends.length === 0) {
				pendingFriends.push({
					properties: {
						height: heightDataView
					},
					match: 'empty'
				});
			}
			searchUsers.push({
				properties: {
					height: heightDataView
				},
				template: 'getFriendsSection'	
			});
			friendsOnSelbi.setItems(currentFriends);
			friendsPending.setItems(pendingFriends);
			addFriendSection.setItems(searchUsers);
			contactListView.sections = [addFriendSection, friendsPending, friendsOnSelbi];
			$.addFriendsView.add(contactListView);
			$.activityIndicator.hide();
			$.activityIndicator.height = '0dp';
		}	
	});
}

/**
 * @method addFriendsLoadError
 * Executed when loading page fails
 */
function addFriendsLoadError() {	
	dynamicElement.defaultLabel('Dang! We are having trouble getting your friends. Please try again later!', function(err, results) {
		$.defaultView.height= Ti.UI.FILL;
		$.defaultView.add(results);
	});
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
}




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

/**
 * @private backButton 
 *  Closes the current view and opens the previous view by reloading it to update for changes.
 *  
 */
function backButton() {
	Alloy.Globals.openPage('contacts');
	Alloy.Globals.closePage('addfriends');
};


/*----------------------------------------------Dynamic Elements---------------------------------------------*/

switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        heightDataView = '40dp';
	        fontSizeCheckMark = '20dp';
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
	        fontSizeCheckMark = '20dp';
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
	        fontSizeCheckMark = '24dp';
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
	        fontSizeCheckMark = '26dp';
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
	        fontSizeCheckMark = '24dp';
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

loadFriends();

//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		currentUser = data;
	},
	error: function(data){		
	}
});

//Close contacts page on addfriends.js load to avoid memory leaks
Alloy.Globals.closePage('contacts');