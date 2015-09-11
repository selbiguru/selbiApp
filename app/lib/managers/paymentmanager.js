var httpManager = require('managers/httpmanager');

var getClientToken = exports.getClientToken = function(cb) {
	httpManager.execute('/payments/getClientToken', 'GET', null, true, function(err, responseToken){
		var a = Titanium.UI.createAlertDialog({
        	title : 'Payment Token'
    	});

		if(err) {
	    	a.setMessage("Failed to get payment token, please try again later!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
			cb(err, responseToken);
		}
	});
};



var createCustomerAndpaymentMethod = exports.createCustomerAndpaymentMethod = function(paymentObject, cb) {
	//console.log("paymentObject ", paymentObject);
	httpManager.execute('/payments/createCustomerAndpaymentMethod', 'POST', paymentObject, true, function(err, responseObj){
		console.log("#$@#$@#$## :", responseObj);
		var a = Titanium.UI.createAlertDialog({
        	title : 'Save Payment Method'
    	});

		if(err) {
	    	a.setMessage("Failed to save your credit card, please try again later!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, responseObj);
		}
	});
};




/*var createSubMerchant = exports.createSubMerchant = function(subMerchantObject, cb) {
	//console.log("paymentObject ", paymentObject);
	httpManager.execute('/payments/createSubMerchant', 'POST', subMerchantObject, true, function(err, responseObj){
		var a = Titanium.UI.createAlertDialog({
        	title : 'Save Bank Info'
    	});

		if(err) {
	    	a.setMessage("Failed to connect your bank account, please try again later!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, responseObj);
		}
	});
};*/