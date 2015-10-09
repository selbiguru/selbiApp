/**
 * @class Contact Page where users can import their phone contact and Add/invite them to be their friends.
 */

var args = arguments[0] || {};
/**
 * @method getContactListTemplate
 * Returns a template used by contact list
 */
function getContactListTemplate() {
	return {
		 childTemplates: [
	        {                            // Title
	            type: 'Ti.UI.Label',     // Use a label for the title
	            bindId: 'title',         // Maps to a custom title property of the item data
	            properties: {            // Sets the label properties
	                color: 'black',
	                font: { fontFamily:'Arial', fontSize: '12dp', fontWeight:'bold' },
	                left: '15dp', top: 5,
	            },
	        },
	        {                            // Subtitle
	            type: 'Ti.UI.Label',     // Use a label for the subtitle
	            bindId: 'subtitle',      // Maps to a custom subtitle property of the item data
	            properties: {            // Sets the label properties
	                color: 'gray',
	                font: { fontFamily:'Arial', fontSize: '10dp' },
	                left: '15dp', top: '20dp',
	            }
	        },
	        {
	        	type: 'Ti.UI.ImageView',     // Use a label for the subtitle
	            bindId: 'inviteIcon',      // Maps to a custom subtitle property of the item data
	            properties: { 
	                right: '0dp', top: '2dp', width: 50
	            }
	        },
	        {
	        	type: 'Ti.UI.ImageView',     // Use a label for the subtitle
	            bindId: 'addIcon',      // Maps to a custom subtitle property of the item data
	            properties: { 
	                right: '40dp', top: '10dp', width: 25
	            }
	        }
	    ]
	};
}

/**
 * @method loadContacts
 * Fetches the contacts from the users contact list and displays them
 */
function loadContacts() {
	var contactListView = Ti.UI.createListView({
		templates: {
			'template': getContactListTemplate()
		},
		defaultItemTemplate: 'template'
	});
	var contactList = Ti.UI.createListSection();
	var contacts = [];
	var people = Ti.Contacts.getAllPeople();
	if(people) {
		for(var person in people) {	
			contacts.push({
					title: { text: people[person] ? people[person].firstName + " " + people[person].lastName: "NA"},
				 	subtitle: {text: people[person].email.work && people[person].email.work.length > 0 ? people[person].email.work[0]: ""},
				 	inviteIcon: {image: 'https://cdn0.iconfinder.com/data/icons/communication-technology/500/black_envelope-128.png'},
				 	addIcon: {image: 'https://cdn3.iconfinder.com/data/icons/social-media-2-2/256/Add_Friend-512.png'}
			});
		}
	}
	Titanium.API.info(JSON.stringify(contacts));
	contactList.setItems(contacts);  
	contactListView.sections = [contactList];
	$.mainView.add(contactListView);
}

/**
 * @method addressBookDisallowed
 * Delegate callback executed when access to contacts is not allowed
 */
function addressBookDisallowed() {	
	$.mainView.add(Ti.UI.createLabel({
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

importContacts();
