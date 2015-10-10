var httpManager = require('managers/httpmanager');


var sendValidationMessage = exports.sendValidationMessage = function(verifyObject, cb) {
	console.log("WHAT IS MY VERIFYOBJECT ", verifyObject);
	httpManager.execute('/twilio/sendValidationMessage', 'POST', verifyObject, true, function(err, response){
		console.log("just hit your mark please ", err);
		console.log("PLEASE WORK FOR ONCE ", response);
		var a = Titanium.UI.createAlertDialog({
        	title : 'Payment Token'
    	});

		if(err) {
	    	a.setMessage("Failed to send SMS text, please check your phone number and try again!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
		} else {
			cb(err, response);
		}
	});
};