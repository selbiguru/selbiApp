/**
 * @class NotificationManager
 * NotificationManager class to perform friends manipulation related operations
 */

var httpManager = require('managers/httpmanager');




/***************************************************GET CALLS***************************************************************/

/**
 * @method getNotificationByUserId
 * @param {Function} cb Callback function
 */
var getNotificationByUserId = exports.getNotificationByUserId = function(cb) {
	httpManager.execute('/notification/userid/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, notificationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, notificationResponse);
		}
	});
};




/**
 * @method getNotificationByUserId
 * @param {Object} notificationObject Object containing the following:
 * 		@param {String} notificationId Id of the notification
 * @param {Function} cb Callback function
 */
var getByNotificationId = exports.getByNotificationId = function(notificationObject, cb) {
	httpManager.execute('/notification/notificationid/'+notificationObject.notificationId, 'GET', null, true, function(err, notificationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, notificationResponse);
		}
	});
};






/***************************************************POST/UPDATE CALLS*******************************************************/





/**
 * @method createNotification
 * @param {Object} notificationObject Object containing the following:
 * 		@param {String} userFrom Id of the user sending friendRequest
 * 		@param {String} userTo Id of the user receiving friendRequest
 * 		@param {String} type String of the type of notification being sent ('default','sold','friendrequest')
 * @param {Function} cb Callback function
 */
var createNotification = exports.createNotification = function(notificationObject, cb) {
	httpManager.execute('/notification/create', 'POST', notificationObject, true, function(err, notificationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, notificationResponse);
		}
	});
};






/**
 * @method updateNotificationById
 * @param {Object} notificationObject Object containing the following:
 * 		@param {String} userFrom Id of the user sending friendRequest
 * 		@param {String} userTo Id of the user receiving friendRequest
 * 		@param {String} status String of the status being sent ('default','sold','friendrequest')
 * @param {String} notificationId String of the notificationId that corresponds to the notification to be updated
 * @param {Function} cb Callback function
 */
var updateNotificationById = exports.updateNotificationById = function(notificationObject, notificationId, cb) {
	httpManager.execute('/notification/update/'+notificationId, 'PUT', notificationObject, true, function(err, notificationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, notificationResponse);
		}
	});
};






/**
 * @method updateNotificationByUsers
 * @param {Object} notificationObject Object containing the following:
 * 		@param {String} userFrom Id of the user sending friendRequest
 * 		@param {String} userTo Id of the user receiving friendRequest
 * 		@param {String} status String of the status being sent ('default','sold','friendrequest')
 * @param {Function} cb Callback function
 */
var updateNotificationByUsers = exports.updateNotificationByUsers = function(notificationObject, cb) {
	httpManager.execute('/notification/update/userids', 'PUT', notificationObject, true, function(err, notificationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, notificationResponse);
		}
	});
};





/***************************************************DELETE CALLS*******************************************************/


/**
 * @method deleteNotification
 * @param {Object} notificationObject Object containing the following:
 * 		@param {String} notificationId Id of the notification to delete
 * @param {Function} cb Callback function
 */
var deleteNotification = exports.deleteNotification = function(notificationObject, cb) {
	httpManager.execute('/notification/delete/'+ notificationObject.notificationId, 'DELETE', null, true, function(err, notificationResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, notificationResponse);
		}
	});
};
