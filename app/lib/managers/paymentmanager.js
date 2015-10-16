var httpManager = require('managers/httpmanager');



/***************************************************GET CALLS***************************************************************/

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


var getPaymentMethods = exports.getPaymentMethods = function(cb) {
	httpManager.execute('/payments/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, paymentMethodObj){
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





/***************************************************POST/UPDATE CALLS**************************************************************/
var createCustomerAndPaymentMethod = exports.createCustomerAndPaymentMethod = function(paymentObject, cb) {
	httpManager.execute('/payments/createCustomerAndPaymentMethod', 'POST', paymentObject, true, function(err, userPaymentObj){
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
			//var userModel = Alloy.Models.instance('user');
			//userModel.set({username: userPaymentObj.userPaymentMethod.flag});
			//userModel.save();
			//Alloy.Globals.currentUser = userModel;
			cb(err, Alloy.Globals.currentUser);
		}
	});
};




/*var createSubMerchant = exports.createSubMerchant = function(subMerchantObject, cb) {
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







/***************************************************DELETE CALLS***************************************************************/

var deletePayment = exports.deletePayment = function(deletePaymentObject, cb) {
	httpManager.execute('/payments/paymentMethod/'+Ti.App.Properties.getString('userId'), 'DELETE', deletePaymentObject, true, function(err, deletePaymentResponse){
		var a = Titanium.UI.createAlertDialog({
        	title : 'Payment Info'
    	});

		if(err) {
	    	a.setMessage("Failed to delete your payment info!  Please try again or contact us!");
	    	a.show();
			if(cb) cb(new Error(err.message), null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, deletePaymentResponse);
		}
	});
};



