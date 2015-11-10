/**
 * @class FAQManager
 * FAQManager class to perform email manipulation related operations
 */
var httpManager = require('managers/httpmanager');


/**
 * @method getFAQ
 * Get the FAQs from the  server
 * @param {Function} cb Callback function
 */
var getFAQ = exports.getFAQ = function(cb) {
	httpManager.execute('/faq', 'GET', null, true, function(err, faqResponse){
		if(err) {
			cb(err, null);
		} else {
			cb(err, faqResponse);
		}
	});
};