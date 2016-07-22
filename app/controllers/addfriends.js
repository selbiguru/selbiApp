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
var textFieldObj = null;
var friendsPending = null;
var addFriendSection = null;
var nameFontSize, iconSize, labelTop, labelLeft, 
	iconRight, headerViewHeight, headerLabelFontSize,
	heightCheckView, checkmarkTop, checkmarkLeft;

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
		 		events: {
		 			click: function(e) {
		 				if(textFieldObj) {
		 					textFieldObj.source.blur();
		 				}		 				
		 			}
		 		}
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
					height: heightCheckView,
		 			right: rightCheckMark,
		 			borderRadius: dataBorderRadius,
					borderColor: '#AFAFAF',
					layout: 'horizontal',
					backgroundColor:'#FAFAFA'	
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
					    top: checkmarkTop,
						left: checkmarkLeft,
					    color: '#1BA7CD'
			 		},
            	}],
		 		events: {
	                // Bind event callbacks only to the subcomponent
	                click: function(e){
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
	            	id: 'userNameSearch',
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
	                focus: function(e) {
	                	textFieldObj = e;
	                },
	                change: function(e){
	                	var uniqueUserRegEx = e.value.length > 0 ? (e.value).match(/^[a-zA-Z\s\d\_]+$/) : '';
                		var usernameObject = {
							username: helpers.trim(e.value, true).toLowerCase()
						};
						if(e.source.children.length > 0 && (!uniqueUserRegEx || uniqueUserRegEx)){
							 e.source.children[0].removeEventListener('click', e.source.listener);
							 e.source.listener=null;
						     Alloy.Globals.removeChildren(e.source);
						};
						if(uniqueUserRegEx === null) {
							helpers.alertUser('Oops','Usernames are only letters and numbers!');
	                		return;
	                	}
						if(helpers.trim(e.value, true).length > 6){
							friendsManager.getInvitationByUsername( usernameObject, function(err, results) {
								if(results && results.id != Ti.App.Properties.getString('userId')) {
									if(e.source.children.length > 0 ){
										e.source.children[0].removeEventListener('click', e.source.listener);
										e.source.listener=null;
										Alloy.Globals.removeChildren(e.source);
									};
								    var hiddenView = Ti.UI.createView({
										width: Ti.UI.SIZE,
										height: heightCheckView,
										right: rightCheckMark,
										borderRadius: dataBorderRadius,
										borderColor: '#AFAFAF',
										layout: 'horizontal',
										backgroundColor: results.invitation.length <= 0 ? '#FFF' : results.invitation[0].status === 'denied' ? '#FFF' :  results.invitation[0].status === 'pending' && results.invitation[0].userFrom != Ti.App.Properties.getString('userId') ? '#FFF' : '#1BA7CD',
										data: results,
										invitation: results.invitation,
										status: results.invitation.length <= 0 ? "new" : results.invitation[0].status 
									});
									var labelStuff = Ti.UI.createLabel({
										width: Ti.UI.SIZE,
				                		font: {
				                			fontFamily : "FontAwesome",
				                			fontSize: fontSizeCheckMark,
				                		},
				                		top: checkmarkTop,
										left: checkmarkLeft,
										color: results.invitation.length <= 0 ? '#1BA7CD' : results.invitation[0].status === 'denied' ? '#1BA7CD' :  results.invitation[0].status === 'pending' && results.invitation[0].userFrom != Ti.App.Properties.getString('userId') ? '#1BA7CD' : '#FAFAFA',
				                		text: results.invitation.length <= 0 ? '\uf067  Add   ' : results.invitation[0].status === 'denied' ? '\uf067  Add   ' :  results.invitation[0].status === 'pending' && results.invitation[0].userFrom != Ti.App.Properties.getString('userId') ? '\uf067  Add   ' : results.invitation[0].status === 'approved' ? '\uf00c  Added   ' : '\uf00c  Pending   ',
				                		touchEnabled: false
									});
									
									hiddenView.add(labelStuff);
									e.source.add(hiddenView);
									e.source.listener = function(e) {										
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
									};
									hiddenView.addEventListener('click', e.source.listener);
									textFieldObj = e;
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
            		color: '#FAFAFA',
            		font: {
            			fontFamily : "FontAwesome",
            			fontSize: fontSizeCheckMark,
            		},
            		top: checkmarkTop,
					left: checkmarkLeft,
					text: '\uf00c  Pending   ',
            		touchEnabled: false
				});
				e.source.status = createInviteResult.invitation.status;
				e.source.invitation = [createInviteResult.invitation];
				e.source.backgroundColor = '#1BA7CD';
				e.source.add(checkSquare);
				var emptySectionIndex = findIndexByKeyValue(pendingFriends, 'match', 'empty');
				if(emptySectionIndex != null) {
					pendingFriends = [];
				}
				pendingFriends.push({
					title: { text: helpers.alterTextFormat(e.source.data.firstName + ' ' + e.source.data.lastName, 28, false) },
				 	subtitle: {text: "Pending To...", color:'#1BA7CD' },
					data: { data: {invitation: [createInviteResult.invitation], id: e.source.data.id }, id: e.source.data.username, status: "pending", invitation: [createInviteResult.invitation], backgroundColor : '#1BA7CD' },
					checkmark : {data: [createInviteResult.invitation], text: '\uf00c  Pending   ', visible: true, ext: e.source.data.username, color: '#FAFAFA'},
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
					friendsUserData[0].subtitle.text = friendsUserData[0].data.id;
					friendsUserData[0].subtitle.color = '#AFAFAF';					
					friendsUserData[0].data.status = updateInvitationResult.invitation[0].status;
					friendsUserData[0].data.invitation = updateInvitationResult.invitation;
					friendsUserData[0].data.backgroundColor = determineStatusBoolean(updateInvitationResult.invitation) ? '#FAFAFA' : '#1BA7CD';
					friendsUserData[0].checkmark.color = determineStatusBoolean(updateInvitationResult.invitation) ? '#1BA7CD' : '#FAFAFA';
					friendsUserData[0].checkmark.text = determineStatus(updateInvitationResult.invitation);
					var emptySectionIndex = findIndexByKeyValue(currentFriends, 'match', 'empty');
					if(emptySectionIndex != null) {
						currentFriends = [];
					}
					if(pendingFriends.length === 0) {
						pendingFriends.push({
							properties: {
								height: heightDataView,
							},
							checkmark: {
								top: '',
								left: '',
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
								height: heightDataView,
							},
							checkmark: {
								top: '',
								left: '',
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
								height: heightDataView,
							},
							checkmark: {
								top: '',
								left: '',
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
						fontFamily : "FontAwesome",
						fontSize: fontSizeCheckMark,
					},
					top: checkmarkTop,
					left: checkmarkLeft,
					text: '\uf067  Add   ',
					touchEnabled: false
				});
				e.source.status = updateInvitationResult.invitation[0].status;
				e.source.invitation = updateInvitationResult.invitation;
				e.source.backgroundColor = '#FFF';
				e.source.add(plusSquare);
				var pendingFriendsIndex = findIndexByKeyValue(pendingFriends, 'match', e.source.data.username);
				var currentFriendsIndex = findIndexByKeyValue(currentFriends, 'match', e.source.data.username);
				if(currentFriendsIndex != null) {
					var friendsUserData = currentFriends.splice(currentFriendsIndex, 1);
					if(currentFriends.length === 0) {
						currentFriends.push({
							properties: {
								height: heightDataView,
							},
							checkmark: {
								top: '',
								left: '',
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
								height: heightDataView,
							},
							checkmark: {
								top: '',
								left: '',
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
				friendsUserData[0].subtitle.text = friendsUserData[0].data.id;	
				friendsUserData[0].subtitle.color = '#AFAFAF';				
				friendsUserData[0].data.status = updateInvitationResult.invitation[0].status;
				friendsUserData[0].data.invitation = updateInvitationResult.invitation;
				friendsUserData[0].data.backgroundColor = determineStatusBoolean(updateInvitationResult.invitation) ? '#FAFAFA' : '#1BA7CD';
				friendsUserData[0].checkmark.color = determineStatusBoolean(updateInvitationResult.invitation) ? '#1BA7CD' : '#FAFAFA';
				friendsUserData[0].checkmark.text = determineStatus(updateInvitationResult.invitation);
				var emptySectionIndex = findIndexByKeyValue(currentFriends, 'match', 'empty');
				if(emptySectionIndex != null) {
					currentFriends = [];
				}
				if(pendingFriends.length === 0) {
					pendingFriends.push({
						properties: {
							height: heightDataView,
						},
						checkmark: {
								top: '',
								left: '',
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
							height: heightDataView,
						},
						data: {
							borderRadius: '',
							borderColor: '',
						},
						checkmark: {
							top: '',
							left: '',
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
					data: { data: {invitation: updateInvitationResult.invitation, id: e.source.data.id }, id: e.source.data.username, status: "pending", invitation: updateInvitationResult.invitation, backgroundColor : '#1BA7CD' },
					checkmark : {data: updateInvitationResult.invitation, text: '\uf00c  Pending   ', visible: true, ext: e.source.data.username, color: '#FAFAFA'},
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
            		color: '#FAFAFA',
            		font: {
            			fontFamily : "FontAwesome",
            			fontSize: fontSizeCheckMark,
            		},
            		top: checkmarkTop,
					left: checkmarkLeft,
					text: '\uf00c  Pending   ',
            		touchEnabled: false
				});
				e.source.status = updateInvitationResult.invitation[0].status;
				e.source.invitation = updateInvitationResult.invitation;
				e.source.backgroundColor = '#1BA7CD';
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
		allowsSelection: false,
		events: {
			click: function(e) {
				
			}
		}
	});
	friendsOnSelbi = Ti.UI.createListSection({
		headerView: createCustomView('Friends on Selbi'),
		events: {
			click: function(e) {
				
			}
		}
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
		if(friendsOnSelbi==null){
			return;
		}
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
						title: { 
							text: helpers.alterTextFormat(results[user].firstName + ' ' + results[user].lastName, 28, false)
						},
					 	subtitle: {
					 		text: results[user].username,
					 		color:'#AFAFAF'
					 	},
					 	data: {
					 		data: {invitation: results[user].invitation, id: results[user].id },
					 		id: results[user].username,
					 		status: "approved",
					 		invitation: results[user].invitation,
					 		backgroundColor : '#1BA7CD'
					 	},
					 	checkmark : {
					 		data: results[user].invitation,
					 		text : '\uf00c  Added   ',
					 		visible: true,
					 		ext: results[user].username,
					 		color: '#FAFAFA'
					 	},
					 	properties: {
							height: heightDataView
						},
						match: results[user].username
					});
				} else {
					pendingFriends.push({
						title: {
							text: helpers.alterTextFormat(results[user].firstName + ' ' + results[user].lastName, 28, false)
						},
					 	subtitle: {
					 		text: results[user].invitation[0].userFrom === Ti.App.Properties.getString('userId') ? "Pending To..." : "Pending From...", color:'#1BA7CD'
					 	},
						data: {
							data: {invitation: results[user].invitation, id: results[user].id },
							id: results[user].username,
							status: "pending",
							invitation: results[user].invitation,
							backgroundColor : determineStatusBoolean(results[user].invitation) ? '#FAFAFA' : '#1BA7CD'
						},
						checkmark : {
							data: results[user].invitation,
							text : results[user].invitation.length <= 0 ? '\uf067  Add   ' : determineStatus(results[user].invitation),
							visible: true,
							ext: results[user].username,
							color : determineStatusBoolean(results[user].invitation) ? '#1BA7CD' : '#FAFAFA'
						},
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
						height: heightDataView,
					},
					data: {
						borderRadius: '',
						borderColor: '',
					},
					checkmark: {
						top: '',
						left: '',
					},
					match: 'empty'
				});
			}
			if(pendingFriends.length === 0) {
				pendingFriends.push({
					properties: {
						height: heightDataView,
					},
					data: {
						borderRadius: '',
						borderColor: '',
					},
					checkmark: {
						top: '',
						left: '',
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
	dynamicElement.defaultLabel('Dang, we are having trouble getting your friends. Please try again later!', function(err, results) {
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
		return '\uf067  Add   ';
	} else if(invitation[0].status === 'denied') {
		return '\uf067  Add   ';
	} else if(invitation[0].status === 'pending' && invitation[0].userTo === Ti.App.Properties.getString('userId')) {
		return '\uf067  Add   ';
	} else if(invitation[0].status === 'pending' && invitation[0].userFrom === Ti.App.Properties.getString('userId') ) {
		return '\uf00c  Pending   ';
	} else if(invitation[0].status === 'approved') {
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
 * @private backButton 
 *  Closes the current view and opens the previous view by reloading it to update for changes.
 */
function backButton() {
	$.off();
	$.destroy();
	$.addFriendsTopBar.removeEventListener('click', blurTextField);
	Alloy.Globals.closePage('addfriends');
};



/**
 * @method blurTextField
 * Blurs text field to clear keyboard if topbar is clicked
 */
function blurTextField(e) {
	if(textFieldObj) {
		textFieldObj.source.blur();
	}
};


/*----------------------------------------------Dynamic Elements---------------------------------------------*/

switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
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
	    case 1: //iphoneFive
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
	    case 2: //iphoneSix
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
	    case 3: //iphoneSixPlus
	    	heightDataView = '75dp';
	    	heightCheckView = '32dp';
	        fontSizeCheckMark = '15dp';
	        rightCheckMark = '20dp';
	        fontSizeTitleLabel = '21dp';
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
	    case 4: //android currently same as iphoneSix
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

loadFriends();

//Load the user model
Alloy.Models.user.fetch({
	success: function(data){
		currentUser = data;
	},
	error: function(data){		
	}
});




/*-------------------------------------------------Event Listeners---------------------------------------------------*/


$.addFriendsTopBar.addEventListener('click', blurTextField);

exports.cleanup = function () {
	if(textFieldObj){
		textFieldObj.source.value = '';
		if(textFieldObj.source.children.length>0){
	 		textFieldObj.source.children[0].removeEventListener('click', textFieldObj.source.listener);
     		Alloy.Globals.removeChildren(textFieldObj.source);
        }
        textFieldObj.source.listener = null;
        textFieldObj.source = null;
        Alloy.Globals.deallocate(textFieldObj);
        textFieldObj = null;	
	};
	if(contactListView){
		friendsOnSelbi.items=[];
		friendsPending.items=[];
		addFriendSection.items=[];
		contactListView.sections = [];
		friendsOnSelbi = null;
		friendsPending = null;
		addFriendSection = null;
		contactListView = null;
	}
	Alloy.Globals.removeChildren($.addFriendsView);
	$.addFriendsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};
