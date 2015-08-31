//Ti.App.addEventListener("app:fromTitaniumPaymentGetTokenFromServer", function(e) {
  //              alert(e.message);
	braintree.setup("eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJiMThkMDdjZmE0YjJmOWRjNTEwYmM5OTNjMTJiNWNiZmIyZDEzYmJhY2E5MzA5YWU5ODAxMDRjMjBlNzQ3MDM4fGNyZWF0ZWRfYXQ9MjAxNS0wOC0yM1QyMzo1OTozMy4xNDEyOTc5MjIrMDAwMFx1MDAyNm1lcmNoYW50X2lkPXp3NjdqNG5zdDhyMzN3bXNcdTAwMjZwdWJsaWNfa2V5PW5rdHpyOTk1dnkyc3h3cngiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvenc2N2o0bnN0OHIzM3dtcy9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3p3NjdqNG5zdDhyMzN3bXMvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIn0sInRocmVlRFNlY3VyZUVuYWJsZWQiOmZhbHNlLCJwYXlwYWxFbmFibGVkIjp0cnVlLCJwYXlwYWwiOnsiZGlzcGxheU5hbWUiOiJzZWxiaSIsImNsaWVudElkIjpudWxsLCJwcml2YWN5VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3BwIiwidXNlckFncmVlbWVudFVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS90b3MiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOnRydWUsImVudmlyb25tZW50Tm9OZXR3b3JrIjp0cnVlLCJlbnZpcm9ubWVudCI6Im9mZmxpbmUiLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjpmYWxzZSwibWVyY2hhbnRBY2NvdW50SWQiOiJzZWxiaSIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoienc2N2o0bnN0OHIzM3dtcyIsInZlbm1vIjoib2ZmIn0=", "custom", {
		id: "my-sample-form",
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
	            placeholder: "MM/YY"
	        },
	        postalCode: {
	        	selector: "#postalCode",
	          	placeholder: "ZIP"
	       	},
	        styles: {
	          	'input': {
	          	'font-family': 'sans-serif',
	       		'font-size': '14pt',
	        	'color': 'black',
	          	}
	        }
		},
		onPaymentMethodReceived: function(obj) {
    		// This will be called when the user submits the form
    		//Ti.App.fireEvent('app:fromWebViewPaymentGetNonceFromBraintree', { message: 'event fired from Titanium, handled in WebView' });
		
  		},
  		onError : function(obj) {
  			// This will be called when the user submits the form and an error occurs
  		}
	});  
//});


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
			$(".credit-card-group").addClass("invalid shake");
		} else if(event.target.container.className.indexOf('braintree-hosted-fields-valid') !== -1) {
			$(".credit-card-group").removeClass("invalid shake");
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
			$(".credit-card-group").removeClass("invalid shake");
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
		if (event.type === 'focus') {
			$("#"+event.target.container.id + " iframe").removeClass("transitioning-out")
				.addClass("transitioning-in");
					
			//setTimeout(function () {
			// Hide the rest of the payment info fields now that the credit card
			// has been 'clicked' on to edit.
			$("." + defaults.fieldsetClass)
				.find("div:gt(2)")
				.addClass("hide");
			$("#"+event.target.container.id).removeClass("full");
			//}, defaults.focusDelay);
		} else {
			// Once this function is fired, we need to add a "transitioning" class to credit
			// card element so that we can take advantage of our CSS animations.
			$("#"+event.target.container.id + " iframe").addClass("transitioning-out");
			$("#"+event.target.container.id).addClass("full");			

			setTimeout(function () {
				// Expose the rest of the payment info fields now that the credit card
				// has been filled out.
				$("." + defaults.fieldsetClass)
					.find("div")
					.removeClass("hide");
				}, defaults.animationWait);
					
		}
	},

	expirationDateComplete: function() {

	},

	cvvComplete: function() {

	},

	postalCodeComplete: function() {

	}

};
		