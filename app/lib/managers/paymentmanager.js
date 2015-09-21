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


var getCustomerPaymentMethod = exports.getCustomerPaymentMethod = function(cb) {
	httpManager.execute('/payments/findCustomer/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, paymentMethodObj){
		console.log("^^^^^^^^^^^^: ",paymentMethodObj, err);
		var a = Titanium.UI.createAlertDialog({
        	title : 'Payment Method'
    	});

		if(err) {
	    	a.setMessage("Failed to get payment method, please try again later!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
			cb(err, paymentMethodObj);
		}
	});
};


var createCustomerAndpaymentMethod = exports.createCustomerAndpaymentMethod = function(paymentObject, cb) {
	//console.log("paymentObject ", paymentObject);
	httpManager.execute('/payments/createCustomerAndpaymentMethod', 'POST', paymentObject, true, function(err, userPaymentObj){
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
			var userModel = Alloy.Models.instance('user');
			userModel.set({username: userPaymentObj.userPaymentMethod.flag});
			userModel.save();
			console.log("USERMODEL: ", userModel);
			Alloy.Globals.currentUser = userModel;
			cb(err, Alloy.Globals.currentUser);
		}
	});
};




/*var createSubMerchant = exports.createSubMerchant = function(subMerchantObject, cb) {
	//console.log("paymentObject ", paymentObject);
	httpManager.execute('/payments/createSubMerchant', 'POST', subMerchantObject, true, function(err, userPaymentObj){
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
			cb(err, userPaymentObj);
		}
	});
};*/