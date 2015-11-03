/**
 * @class EmailManager
 * EmailManager class to perform email manipulation related operations
 */
var httpManager = require('managers/httpmanager');


/**
 * @method sendContactSelbiEmail
 * Create a listing for a given user and upload the images
 * @param {Object} emailObject Object containing the four following key/values:
 * 		{String} subject Subject of the given email
 * 		{String} body Body (message) for the given email
 *		{String} email Email of the sender
 *  	{String} name Name of the sender (Full Name)
 * @param {Function} cb Callback function
 */
var sendContactSelbiEmail = exports.sendContactSelbiEmail = function(emailObject, cb) {
	httpManager.execute('/email/contactSelbi', 'POST', emailObject, true, function(err, emailResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, emailResponse);
		}
	});
};