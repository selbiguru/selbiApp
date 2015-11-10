/**
 * @class AboutUsManager
 * AboutUsManager class to perform email manipulation related operations
 */
var httpManager = require('managers/httpmanager');


/**
 * @method getAboutUs
 * Get the AboutUs from the  server
 * @param {Function} cb Callback function
 */
var getAboutUs = exports.getAboutUs = function(cb) {
	httpManager.execute('/aboutus', 'GET', null, true, function(err, AboutUsResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, AboutUsResponse);
		}
	});
};