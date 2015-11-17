/**
 * @class Contact Page where users can import their phone contact and Add/invite them to be their friends.
 */

var args = arguments[0] || {};
var friendsManager = require('managers/friendsmanager');
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
		 			height: Ti.UI.FILL,
		 			backgroundColor: '#FAFAFA'
		 		},
		 		events: {
	                // Bind event callbacks only to the subcomponent
	                click: function(e){
	                	console.log('232424423423423423423', e.source.data);
	                }
            	},
		 	},
	        {                            // Title
	            type: 'Ti.UI.Label',     // Use a label for the title
	            bindId: 'title',         // Maps to a custom title property of the item data
	            properties: {            // Sets the label properties
	                color: '#9B9B9B',
	                font: {
						fontSize: '16dp',
						fontFamily: 'Nunito-Bold'
					},
	                left: '15dp', 
	                top: '3dp',
	            },
	        },
	        {                            // Subtitle
	            type: 'Ti.UI.Label',     // Use a label for the subtitle
	            bindId: 'subtitle',      // Maps to a custom subtitle property of the item data
	            properties: {            // Sets the label properties
	                color: '#9B9B9B',
	                font: {
						fontSize: '12dp',
						fontFamily: 'Nunito-Light'
					},
	                left: '15dp', 
	                top: '25dp',
	            },
	        },
	        {
	        	type: 'Ti.UI.ImageView',     // Use a label for the subtitle
	            bindId: 'addIcon',      // Maps to a custom subtitle property of the item data
	            properties: { 
	            	color: '#E5E5E5',
	                right: '10dp', 
	                font: {
						fontSize: '16dp',
					},
	                top: '10dp', 
	                width: '25dp',
	            }
	        }
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
        height: '25dp'
    });
    var text = Ti.UI.createLabel({
        text: title,
        font: {
			fontSize: '14dp',
			fontFamily: 'Nunito-Bold'
		},
        left: '15dp',
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
			'template': getContactListTemplate()
		},
		defaultItemTemplate: 'template',
		backgroundColor: '#FAFAFA',
		//allowsSelection: false
	});
	var usersContactList = Ti.UI.createListSection({
		headerView: createCustomView('Invite friends Selbi'),
		footerView: Ti.UI.createView({
		        backgroundColor: '#E5E5E5',
		        height: '1dp'
		})
	
	});
	var currentUsers = [];
	var nonUsers = [];
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
						 	subtitle: {text: "Using Selbi"},
						 	data: { data: 1},
						});
					} else {
						currentUsers.push({
							title: { text: results[user].contactName },
						 	subtitle: {text: results[user].originalNumber },
							data: { data: 0},
						});
					}
				}
				usersContactList.setItems(currentUsers); 
				contactListView.sections = [usersContactList];
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
	        nameFontSize = '14dp';
	        iconSize = '14dp';
	        labelTop = '35dp';
	        labelLeft = '35dp';
	        iconRight = '35dp';
	        headerViewHeight = '40dp';
			headerLabelFontSize = '14dp';
	        break;
	    case 1: //iphoneFive
	        nameFontSize = '14dp';
	        iconSize = '14dp';
	        labelTop = '35dp';
	        labelLeft = '35dp';
	        iconRight = '35dp';
	        headerViewHeight = '40dp';
			headerLabelFontSize = '14dp';
	        break;
	    case 2: //iphoneSix
	        nameFontSize = '14dp';
	        iconSize = '14dp';
	        labelTop = '35dp';
	        labelLeft = '35dp';
	        iconRight = '35dp';
	        headerViewHeight = '40dp';
			headerLabelFontSize = '14dp';
	        break;
	    case 3: //iphoneSixPlus
	        nameFontSize = '14dp';
	        iconSize = '14dp';
	        labelTop = '35dp';
	        labelLeft = '35dp';
	        iconRight = '35dp';
	        headerViewHeight = '40dp';
			headerLabelFontSize = '14dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        nameFontSize = '14dp';
	        iconSize = '14dp';
	        labelTop = '35dp';
	        labelLeft = '35dp';
	        iconRight = '35dp';
	        headerViewHeight = '40dp';
			headerLabelFontSize = '14dp';
	        break;
	};







/*----------------------------------------------On page load calls---------------------------------------------*/

importContacts();
