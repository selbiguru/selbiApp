var httpManager = require('managers/httpmanager');



/***************************************************GET CALLS***************************************************************/



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


/**
 * @method getManagedAccount
 * Gets managed account from stripe for user
 * @param {Function} cb Callback function
 */
var getManagedAccount = exports.getManagedAccount = function(cb) {
	httpManager.execute('/payments/getManagedAccount/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, managedAccount){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, managedAccount);
		}
	});
};


/**
 * @method getCustomer
 * Gets customer account from stripe for user
 * @param {Function} cb Callback function
 */
var getCustomer = exports.getCustomer = function(cb) {
	httpManager.execute('/payments/getCustomer/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, customerAccount){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, customerAccount);
		}
	});
};



/**
 * @method getBalance
 * Gets managed account balance from stripe for user
 * @param {Function} cb Callback function
 */
var getBalance = exports.getBalance = function(cb) {
	httpManager.execute('/payments/bankBalance/'+Ti.App.Properties.getString('userId'), 'GET', null, true, function(err, managedBalance){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, managedBalance);
		}
	});
};


/***************************************************POST/UPDATE CALLS**************************************************************/


/**
 * @method createCustomerAndPaymentMethod
 * @param {Object} paymentObject Object containing the following:
 * 		@param {String} userId Id of the user adding a credit card
 * 		@param {String} firstName firstName of the user adding a credit card
 * 		@param {String} lastName lastName of the user adding a credit card
 * 		@param {String} email email of the user adding a credit card
 * 		@param {String} paymentStripeCardResponse Stripe token received with encrypted credit card info 
 * @param {Function} cb Callback function
 */
var createCustomerAndPaymentMethod = exports.createCustomerAndPaymentMethod = function(paymentObject, cb) {
	httpManager.execute('/payments/createCustomerAndPaymentMethod', 'POST', paymentObject, true, function(err, userPaymentObj){
		if(err) {
			cb(err, null);
		} else {
			cb(err, userPaymentObj);
		}
	});
};




var createManagedAccount = exports.createManagedAccount = function(managedObject, cb) {
	httpManager.execute('/payments/createManagedAccount/'+Ti.App.Properties.getString('userId'), 'POST', managedObject, true, function(err, userPaymentObj){
		if(err) {
			cb(err, null);
			} 
		else {
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
			cb(err, completedOrder);
		}
	});
};






/***************************************************DELETE CALLS***************************************************************/


/**
 * @method deletePayment
 * Delete the CC payment info from Selbi Servers and Stripe
 * @param {Function} cb Callback function
 */
var deletePayment = exports.deletePayment = function(cb) {
	httpManager.execute('/payments/deletePaymentMethod/'+Ti.App.Properties.getString('userId'), 'DELETE', null, true, function(err, deletePaymentResponse){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, deletePaymentResponse);
		}
	});
};



/**
 * @method deleteExternalAccount
 * Delete the managed external account from Selbi Servers and Stripe 
 * @param {Function} cb Callback function
 */
var deleteExternalAccount = exports.deleteExternalAccount = function(cb) {
	httpManager.execute('/payments/deleteExternalAccount/'+Ti.App.Properties.getString('userId'), 'DELETE', null, true, function(err, deleteExternalAccountResponse){
		if(err) {
			cb(err, null);
			} 
		else {
			cb(err, deleteExternalAccountResponse);
		}
	});
};


