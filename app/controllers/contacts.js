/**
 * @class Contact Page where users can import their phone contact and Add/invite them to be their friends.
 */

var args = arguments[0] || {};
var friendsManager = require('managers/friendsmanager'),
	userManager = require('managers/usermanager');
var helpers = require('utilities/helpers');
var nameFontSize, iconSize, labelTop, labelLeft, 
	iconRight, headerViewHeight, headerLabelFontSize;



/**
 * @method getContactListTemplate
 * Returns a template used by contact list
 */
function getContactListTemplate() {
	return {
		 childTemplates: [
		 	{
		 		type: 'Ti.UI.View',
		 		bindId: 'data',
		 		properties: {
		 			width: Ti.UI.FILL,
		 			height: heightDataView,
		 			backgroundColor: '#FAFAFA'
		 		},
		 		events: {
	                // Bind event callbacks only to the subcomponent
	                click: function(e){
	                	//console.log('DATA', e.bindId);
	                	if(e.source.children && e.source.children.length > 0 && e.bindId === 'data' ) {
	                		e.source.remove(e.source.children[0]);
	                	} else {
	                		var checkMark = Ti.UI.createLabel({
		                		width: Ti.UI.SIZE,
		                		color: '#1BA7CD',
		                		right: rightCheckMark,
		                		font: {
		                			fontSize: fontSizeCheckMark,
		                		},
		                		touchEnabled:false
		                	});
		                	$.fa.add(checkMark, 'fa-check');
		                	e.source.add(checkMark);
	                	}
	                }
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
	        }
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
	            bindId: 'bear',         	// Maps to a custom title property of the item data
	            properties: { 	         	// Sets the label properties
	            	width: Ti.UI.FILL,
					height: heightDataView,	            		            	
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
                		var usernameObject = {
							username: e.value
						};
						if(e.source.children.length > 0 ){
								e.source.remove(e.source.children[0]);
						};
						if(e.value.length > 5){
							friendsManager.getInvitationByUsername( usernameObject, function(err, results) {
								console.log('Results of username Search', results,'errererrrr' ,err);
								if(results || err) {
									if(e.source.children.length > 0 ){
										e.source.remove(e.source.children[0]);
									};
									var hiddenView = Ti.UI.createView({
										width: Ti.UI.SIZE,
										height: Ti.UI.SIZE,
										ext: e.source,
										right: rightCheckMark,
										data: 1
									});
									var labelStuff = Ti.UI.createLabel({
										width: Ti.UI.SIZE,
				                		color: '#1BA7CD',
				                		font: {
				                			fontSize: fontSizeCheckMark,
				                		},
				                		touchEnabled: false
									});
									$.fa.add(labelStuff, 'fa-plus-square-o');
									hiddenView.add(labelStuff);
									e.source.add(hiddenView);
									hiddenView.addEventListener('click', function(e) {
										if(e.source.data === 1) {
											e.source.remove(e.source.children[0]);
											var checkSquare = Ti.UI.createLabel({
												width: Ti.UI.SIZE,
						                		color: '#1BA7CD',
						                		font: {
						                			fontSize: fontSizeCheckMark,
						                		},
						                		data: 0,
						                		touchEnabled: false
											});
											e.source.data = 0;
											$.fa.add(checkSquare, 'fa-check-square');
											e.source.add(checkSquare);
										} else {
											e.source.remove(e.source.children[0]);
											var plusSquare = Ti.UI.createLabel({
												width: Ti.UI.SIZE,
						                		color: '#1BA7CD',
						                		font: {
						                			fontSize: fontSizeCheckMark,
						                		},
							                	touchEnabled: false
											});
											e.source.data = 1;
											$.fa.add(plusSquare, 'fa-plus-square-o');
											e.source.add(plusSquare);
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
	var usersContactList = Ti.UI.createListSection({
		headerView: createCustomView('Invite friends to Selbi'),
		footerView: Ti.UI.createView({
		        backgroundColor: '#E5E5E5',
		        height: '1dp'
		})	
	});
	var addFriendSection = Ti.UI.createListSection({
		headerView: createCustomView('Add friends on Selbi'),
		/*footerView: Ti.UI.createView({
		        backgroundColor: '#E5E5E5',
		        height: '1dp'
		})*/	
	});
	var currentUsers = [];
	var nonUser = [];
	var phoneArray = [];
	var people = Ti.Contacts.getAllPeople();
	if(people) {
		for(var person in people) {
			if((people[person].phone.mobile && people[person].phone.mobile.length > 0) || (people[person].phone.work && people[person].phone.work.length > 0) || (people[person].phone.home && people[person].phone.home.length > 0) || (people[person].phone.other && people[person].phone.other.length > 0)) {
				var phone = people[person].phone.mobile && people[person].phone.mobile.length > 0 ? people[person].phone.mobile[0] : people[person].phone.work && people[person].phone.work.length > 0 ? people[person].phone.work[0] : people[person].phone.home && people[person].phone.home.length > 0 ? people[person].phone.home[0] : people[person].phone.other && people[person].phone.other.length > 0 ? people[person].phone.other[0] : "";
				var newPhone = phone.replace(/\D+/g, "");
				var userPhoneObject = {
					newNumber: newPhone,
					originalNumber: phone,
					contactName: people[person] ? people[person].firstName + " " + people[person].lastName: "NA",
				};
				phoneArray.push(userPhoneObject);
			};
		};
		friendsManager.getSelbiUsersByPhones(phoneArray,function(err, results){
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
							title: { text: results[user].contactName },
						 	subtitle: {text: "Using Selbi", color:'#1BA7CD'},
						 	data: { data: 1},
						 	properties: {
								height: heightDataView
							}
						});
					} else {
						currentUsers.push({
							title: { text: results[user].contactName },
						 	subtitle: {text: results[user].originalNumber },
							data: { data: 0},
							properties: {
								height: heightDataView
							}
						});
					}
				}
				nonUser.push({
					properties: {
						height: heightDataView
					},
					template: 'getFriendsSection'	
				});
				usersContactList.setItems(currentUsers);
				addFriendSection.setItems(nonUser);
				contactListView.sections = [addFriendSection, usersContactList];
				$.addFriendsView.add(contactListView);
			}	
		});
	}
}

/**
 * @method addressBookDisallowed
 * Delegate callback executed when access to contacts is not allowed
 */
function addressBookDisallowed() {	
	$.addFriendsView.add(Ti.UI.createLabel({
		text: 'No contacts imported'
	}));
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
}





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
