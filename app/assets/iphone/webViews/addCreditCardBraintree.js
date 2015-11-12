Ti.App.addEventListener("app:fromTitaniumPaymentGetTokenFromServer", paymentToken);
Ti.App.fireEvent('app:BrainTreeHostLoad', { braintree: 'true' });

defaults = {
	fieldsetClass: "credit-card-group",
	cardImageClass: "card-image",
	cardCvvClass: "card-cvv",
	cardExpirationClass: "card-expiration",
	cardZipClass: "card-zip",
	cardNumberClass: "card-number",
	cardInstruction : true,
	cardInstructionClass: "card-instruction",
	animationWait: 600,
	focusDelay: 200,
	messageEnterCardNumber : "Please enter your credit card number",
	messageCardNumberError : "Please enter a valid credit card number",
	messageExpiration : "Please enter your card's expiration month and year",
	messageExpirationError : "Please enter a valid month and year",
	messageCVV : "Please enter the three-digit CVV number found on the back of your card",
	messageCVVAmEx : "Please enter your four-digit CVV number on the front of your card",
	messageZip : "Please enter your billing zip code",
	messageSuccess : "Hooray! You've successfully filled out your credit card information."
};

helpers = {
	validateCardField: function(event) {
		// If the credit card field is invalid.  Braintree adds a custom class,
		// "braintree-hosted-fields-invalid", that we check for to determine if we
		// animate the the fieldset.
		if (event.target.container.className.indexOf('braintree-hosted-fields-invalid') !== -1) {
			//$(".credit-card-group").addClass("invalid shake");
		} else if(event.target.container.className.indexOf('braintree-hosted-fields-valid') !== -1) {
			//$(".credit-card-group").removeClass("invalid shake");
	     	switch (event.target.container.id) {
				case "card-number": 
					helpers.creditCardComplete(event);
			      	break;
				case "expiration-date":
			      	helpers.expirationDateComplete(event);
			   		break;
		   		case "cvv":
			    	helpers.cvvComplete(event);
			      	break;
			    case "postalCode":
			    	helpers.postalCodeComplete(event);
			   		break;	
			    }
		} else {
			//$(".credit-card-group").removeClass("invalid shake");
		}
	},

	cardImage: function (event) {
		// If the credit card field has a value and we know what type of card it is,
		// then add the appropriate class to the card image <span>. This will allow us
		// to see the correct card. If we don't know the type, then revert back to the
		// default image. If the credit card field doesn't have a value, then we revert
		// back to the default image and erase any credit card number we might have stored.

		if (event.target.container.id === 'card-number' || event.target.container.id === 'expiration-date') {
			$("." + defaults.cardImageClass)
				.removeClass()
				.addClass(defaults.cardImageClass)
				.addClass(""+event.card.type+"");	
		} else if (event.target.container.id === 'cvv' || event.target.container.id === 'postalCode'){
			$("." + defaults.cardImageClass)
				.addClass("cvv2");
		}

	},

	creditCardComplete: function(event) {
		
	},

	expirationDateComplete: function() {

	},

	cvvComplete: function() {

	},

	postalCodeComplete: function() {

	}

};

Ti.App.addEventListener("app:fromTitaniumPaymentSaveCreditCard", submitCard);

function paymentToken(e) {
	Ti.App.removeEventListener("app:fromTitaniumPaymentGetTokenFromServer", paymentToken);
	braintree.setup(e.token, "custom", {
		id: "saveCreditCardForm",
	    hostedFields: {
	    	onFieldEvent: function (event) {
				if (event.type) {
					helpers.validateCardField(event);
				} 
				if (event.card) {
				// visa|master-card|american-express|diners-club|discover|jcb|unionpay|maestro
			      	helpers.cardImage(event);
			    } else {
					$("." + defaults.cardImageClass)
						.removeClass()
						.addClass(defaults.cardImageClass);
				}
			},
	       	number: {
	            selector: "#card-number",
	           	placeholder: "XXXXxxxxXXXXxxxx"
	        },
	        cvv: {
	        	selector: "#cvv",
	            placeholder: "CVV"
	        },
	        expirationDate: {
	        	selector: "#expiration-date",
	            placeholder: "MMYY"
	        },
	        postalCode: {
	        	selector: "#postalCode",
	          	placeholder: "ZIP"
	       	},
	        styles: {
	          	'input': {
	          	'font-family': 'sans-serif',
	       		'font-size': '12pt',
	        	'color': 'black',
	          	}
	        }
		},
		onPaymentMethodReceived: function(obj) {
    		// This will be called when the user submits the form
    		Ti.App.fireEvent('app:fromWebViewPaymentGetNonceFromBraintree', { nonceObject: obj });
		
  		},
  		onReady: function(obj) {
  			Ti.App.fireEvent('app:fromWebViewPaymentGetNonceFromBraintree', { onready: obj });
  		},
  		onError : function(obj) {
  			// This will be called when the user submits the form and an error occurs
  			Ti.App.fireEvent('app:fromWebViewPaymentGetNonceFromBraintree', { message: obj });
  		}
	});
};


function submitCard(e) {
	$('#submit').click();
}
		