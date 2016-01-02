/**
 * @class FriendsManager
 * FriendsManager class to perform friends manipulation related operations
 */

var httpManager = require('managers/httpmanager');




/***************************************************GET CALLS***************************************************************/

/**
 * @method getInvitationByUsername
 * @param {Object} usernameObject Object containing the following:
 * 		@param {String} username String of the username you are trying to find
 * @param {Function} cb Callback function
 */
var getInvitationByUsername = exports.getInvitationByUsername = function(usernameObject, cb) {
	httpManager.execute('/friend/username/'+Ti.App.Properties.getString('userId')+'/'+usernameObject.username, 'GET', null, true, function(err, invitationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, invitationResponse);
		}
	});
};


/**
 * @method getSelbiUsersByPhones
 * Create a listing for a given user and upload the images
 * @param {Array} phoneArray Array containing phone numbers
 * @param {Function} cb Callback function
 */
var getSelbiUsersByPhones = exports.getSelbiUsersByPhones = function(phoneArray, cb) {
	httpManager.execute('/user/byphone/'+ Ti.App.Properties.getString('userId'), 'POST', phoneArray, true, function(err, phoneResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, phoneResponse);
		}
	});
};






/***************************************************POST/UPDATE CALLS*******************************************************/





/**
 * @method createFriendInvitation
 * @param {Object} invitationObject Object containing the following:
 * 		@param {String} userFrom Id of the user sending friendRequest
 * 		@param {String} userTo Id of the user receiving friendRequest
 * 		@param {String} status String of the status being sent (Default is approved)
 * @param {Function} cb Callback function
 */
var createFriendInvitation = exports.createFriendInvitation = function(invitationObject, cb) {
	httpManager.execute('/friend/request', 'POST', invitationObject, true, function(err, invitationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, invitationResponse);
		}
	});
};




/**
 * @method updateFriendInvitation
 * @param {Object} invitationObject Object containing the following:
 * 		@param {String} userFrom Id of the user updating friendRequest
 * 		@param {String} userTo Id of the user receiving friendRequest
 * 		@param {String} status String of the status being sent (Default is approved)
 * @param {String} invitationId String of the invitationId that corresponds to the invitation to be updated
 * @param {Function} cb Callback function
 */
var updateFriendInvitation = exports.updateFriendInvitation = function(invitationObject, invitationId, cb) {
	httpManager.execute('/friend/request/'+invitationId, 'PUT', invitationObject, true, function(err, invitationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, invitationResponse);
		}
	});
};




/**
 * @method updateFriendInvitationByUserIds
 * @param {Object} invitationObject Object containing the following:
 * 		@param {String} userFrom Id of the user updating friendRequest
 * 		@param {String} userTo Id of the user receiving friendRequest
 * 		@param {String} status String of the status being sent (Default is approved)
 * @param {Function} cb Callback function
 */
var updateFriendInvitationByUserIds = exports.updateFriendInvitationByUserIds = function(invitationObject, cb) {
	httpManager.execute('/friend/friendinvitation', 'PUT', invitationObject, true, function(err, invitationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, invitationResponse);
		}
	});
};




/**
 * @method addFriendsByPhone
 * @param {Array} phoneArray array containing the user's contact's phone numbers
 * @param {Function} cb Callback function
 */
var addFriendsByPhone = exports.addFriendsByPhone = function(phoneArray, cb) {
	httpManager.execute('/friends/phonenumber/'+ Ti.App.Properties.getString('userId'), 'POST', phoneArray, true, function(err, phoneResponse){
		console.log('------', err);
		console.log('++++++', phoneResponse);
		if(err) {
			cb(err, null);
		} else {
			cb(err, phoneResponse);
		}
	});
};