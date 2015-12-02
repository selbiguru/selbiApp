var httpManager = require('managers/httpmanager');



/***************************************************GET CALLS***************************************************************/

/**
 * @method getClientToken
 * Gets getClientToken from braintree for hosted fields
 * @param {Function} cb Callback function
 */
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



/**
 * @method getPaymentMethods
 * Gets paymentMethods of user including credit card and banking info if available
 * @param {Function} cb Callback function
 */
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


/**
 * @method createCustomerAndPaymentMethod
 * @param {Object} paymentObject Object containing the following:
 * 		@param {String} userId Id of the user adding a credit card
 * 		@param {String} firstName firstName of the user wadding a credit card
 * 		@param {String} lastName lastName of the user wadding a credit card
 * 		@param {String} paymentMethodNonce Braintree nonce received with encrypted credit card info 
 * @param {Function} cb Callback function
 */
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



/**
 * @method createOrder
 * Creates an order when an item is purchased and updates corresponding db models
 * @param {Object} orderObject Object containing the following:
 * 		@param {String} listingId Id of the listing you are buying
 * 		@param {String} sellerId Id of the seller who's item it is
 * 		@param {String} buyerId Id of the buyer buying the item
 * @param {Function} cb Callback function
 */
var createOrder = exports.createOrder = function(orderObject, cb) {
	httpManager.execute('/payments/createOrder', 'POST', orderObject, true, function(err, completedOrder){
		if(err) {
			cb(err, null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, completedOrder);
		}
	});
};






/***************************************************DELETE CALLS***************************************************************/


/**
 * @method deletePayment
 * Delete the CC payment info from Selbi Servers and BrainTree
 * @param {Function} cb Callback function
 */
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



/**
 * @method deleteMerchant
 * Delete the merchant from Selbi Servers not BrainTree
 * @param {Function} cb Callback function
 */
var deleteMerchant = exports.deleteMerchant = function(cb) {
	httpManager.execute('/payments/merchant/'+Ti.App.Properties.getString('userId'), 'DELETE', null, true, function(err, deleteMerchantResponse){
		if(err) {
			cb(err, null);
			} 
		else {
			// add to user object when we know what to save it as
			cb(err, deleteMerchantResponse);
		}
	});
};


