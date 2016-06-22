var httpManager = require('managers/httpmanager');


var sendValidationMessage = exports.sendValidationMessage = function(verifyObject, cb) {
	httpManager.execute('/twilio/sendValidationMessage', 'POST', verifyObject, true, function(err, response){
		if(err) {
			cb(err, null);
		} else {
			cb(err, response);
		}
	});
};