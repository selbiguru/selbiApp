var httpManager = require('managers/httpmanager');



/***************************************************GET CALLS***************************************************************/

var getClientToken = exports.getClientToken = function(cb) {
	httpManager.execute('/payments/getClientToken', 'GET', null, true, function(err, responseToken){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, responseToken);
		}
	});
};


var getPaymentMethods = exports.getPaymentMethods = function(cb) {
	httpManager.execute('/payments/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, paymentMethodObj){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, paymentMethodObj);
		}
	});
};





/***************************************************POST/UPDATE CALLS**************************************************************/
var createCustomerAndPaymentMethod = exports.createCustomerAndPaymentMethod = function(paymentObject, cb) {
	httpManager.execute('/payments/createCustomerAndPaymentMethod', 'POST', paymentObject, true, function(err, userPaymentObj){
		if(err) {
			cb(err, null);
		} else {
			// add to user object when we know what to save it as
			//var userModel = Alloy.Models.instance('user');
			//userModel.set({username: userPaymentObj.userPaymentMethod.flag});
			//userModel.save();
			//Alloy.Globals.currentUser = userModel
			console.log("this is my repsone finally", userPaymentObj);
			cb(err, userPaymentObj);
		}
	});
};




var createSubMerchantAccount = exports.createSubMerchantAccount = function(subMerchantObject, cb) {
	httpManager.execute('/payments/createSubMerchantAccount/'+Ti.App.Properties.getString('userId'), 'POST', subMerchantObject, true, function(err, userPaymentObj){
		if(err) {
			cb(err, null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, userPaymentObj);
		}
	});
};







/***************************************************DELETE CALLS***************************************************************/

var deletePayment = exports.deletePayment = function(cb) {
	httpManager.execute('/payments/paymentMethod/'+Ti.App.Properties.getString('userId'), 'DELETE', null, true, function(err, deletePaymentResponse){
		if(err) {
			cb(err, null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, deletePaymentResponse);
		}
	});
};



