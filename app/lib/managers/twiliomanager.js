var httpManager = require('managers/httpmanager');


var sendSMSPhone = exports.sendSMSPhone = function(verifyobject, cb) {
	httpManager.execute('/twilio/sendSMSMessage', 'POST', verifyObject, true, function(err, response){
		var a = Titanium.UI.createAlertDialog({
        	title : 'Payment Token'
    	});

		if(err) {
	    	a.setMessage("Failed to send SMS text, please try again!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
			cb(err, response);
		}
	});
};