var httpManager = require('managers/httpmanager');


var sendValidationMessage = exports.sendValidationMessage = function(verifyObject, cb) {
	console.log("WHAT IS MY VERIFYOBJECT ", verifyObject);
	httpManager.execute('/twilio/sendValidationMessage', 'POST', verifyObject, true, function(err, response){
		console.log("just hit your mark please ", err);
		console.log("PLEASE WORK FOR ONCE ", response);
		if(err) {
			cb(err, null);
		} else {
			cb(err, response);
		}
	});
};