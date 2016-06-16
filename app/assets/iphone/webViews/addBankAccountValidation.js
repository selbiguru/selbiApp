// Trigger submit form from appcelerator
Ti.App.addEventListener("app:fromTitaniumPaymentSaveBankAccount", createBankToken);



function createBankToken(bankObject) {
	
	// Validate Routing Number with Stripe validation
	var routingNumber = Stripe.bankAccount.validateRoutingNumber(bankObject.funding.routingNumber, 'US'); // US routing number
	
	// Validate Account Number with Stripe validation
	var accountNumber = Stripe.bankAccount.validateAccountNumber(bankObject.funding.accountNumber, 'US');

	
	if(!routingNumber || !accountNumber) {
		Ti.App.fireEvent('app:stripeBankValidation', {routing: routingNumber, account: accountNumber});
		return;
	} else {
		// Converts sensitive bank account data to a single-use token which you can safely pass to Selbi server to use in an API call.
		Stripe.bankAccount.createToken({
		  country: 'US',
		  currency: 'USD',
		  routing_number: bankObject.funding.routingNumber,
		  account_number: bankObject.funding.accountNumber,
		  account_holder_name: bankObject.individual.firstName + ' ' + bankObject.individual.lastName,
		  account_holder_type: 'individual'
		}, stripeResponseHandler);	
	}
}


// Callback for Stripe Tokenization of Bank Info
function stripeResponseHandler(status, response) {

	// Send the token to appcelerator:
	Ti.App.fireEvent('app:createStripeManagedAccount', { responseObj: response, statusObj: status });
    

}