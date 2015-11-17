/**
 * @class FriendsManager
 * FriendsManager class to perform friends manipulation related operations
 */

var httpManager = require('managers/httpmanager');



/**
 * @method getSelbiUsersByPhones
 * Create a listing for a given user and upload the images
 * @param {Array} phoneArray Array containing phone numbers
 * @param {Function} cb Callback function
 */
var getSelbiUsersByPhones = exports.getSelbiUsersByPhones = function(phoneArray, cb) {
	httpManager.execute('/user/byphone', 'POST', phoneArray, true, function(err, phoneResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, phoneResponse);
		}
	});
};