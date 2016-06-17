// Trigger submit form from appcelerator
Ti.App.addEventListener("app:fromTitaniumPaymentSaveCreditCard", submitCard);


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

	cardImage: function (event) {
		// If the credit card field has a value and we know what type of card it is,
		// then add the appropriate class to the card image <span>. This will allow us
		// to see the correct card. If we don't know the type, then revert back to the
		// default image. If the credit card field doesn't have a value, then we revert
		// back to the default image and erase any credit card number we might have stored.

		if (event.objId === 'cc-number' || event.objId === 'cc-exp') {
			$("." + defaults.cardImageClass)
				.removeClass()
				.addClass(defaults.cardImageClass)
				.addClass(""+event.card+"");	
		} else if (event.objId === 'cc-cvc' || event.objId === 'cc-zip'){
			$("." + defaults.cardImageClass)
				.addClass("cvv2");
		}
	},
};

		


jQuery(function($) {
  // Setup Stripe validtion on inputs
  $('.cc-zip').payment('restrictNumeric');
  $('.cc-number').payment('formatCardNumber');
  $('.cc-exp').payment('formatCardExpiry');
  $('.cc-cvc').payment('formatCardCVC');
  $.fn.toggleInputError = function(erred) {
    this.parent('.form-group').toggleClass('has-error', erred);
    return this;
  };
  var $form = $('#payment-form');
  
  	$('input').on('keyup', function(e) {
	  	if(e.target.id === 'cc-number') {
	  		if ($.payment.cardType(this.value)) {
				// visa|mastercard|amex|diners-club|discover|jcb|unionpay|maestro
		      	helpers.cardImage({objId: e.target.id, card: $.payment.cardType(this.value) });
		    } else {
				$("." + defaults.cardImageClass)
				.removeClass()
				.addClass(defaults.cardImageClass);
			}	
	  	} else {
	  		helpers.cardImage({objId: e.target.id, card: $.payment.cardType($('#cc-number').val()) });
	  	}
	});
  
	$('input').on('focus', function(e) {
		if(e.target.id === 'cc-number') {
			if ($.payment.cardType(this.value)) {
				// visa|mastercard|amex|diners-club|discover|jcb|unionpay|maestro
		      	helpers.cardImage({objId: e.target.id, card: $.payment.cardType(this.value) });
		    } else {
				$("." + defaults.cardImageClass)
				.removeClass()
				.addClass(defaults.cardImageClass);
			}	
		} else {
			helpers.cardImage({objId: e.target.id, card: $.payment.cardType($('#cc-number').val()) });
		}
	});
  
  $('form').submit(function(e) {
    e.preventDefault();
    // Disable the submit button to prevent repeated clicks:
  	$form.find('.submit').prop('disabled', true);
    var cardType = $.payment.cardType($('.cc-number').val());
    var cardNumber = $.payment.validateCardNumber($('.cc-number').val());
    var cardExp = $.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal'));
    var cardCVC = $.payment.validateCardCVC($('.cc-cvc').val(), cardType);
    var cardZip = (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($('.cc-zip').val()));
    
    // CC Strip validation
    $('.cc-number').toggleInputError(!cardNumber);
    $('.cc-exp').toggleInputError(!cardExp);
    $('.cc-cvc').toggleInputError(!cardCVC);
    $('.cc-zip').toggleInputError(!cardZip);
    $('.cc-brand').text(cardType);
    $('.validation').removeClass('text-danger text-success');
    $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
     
	// Make sure no errors before sending request to Stripe
	if(cardNumber && cardExp && cardCVC && cardZip) {
		Ti.App.fireEvent('app:fromWebTriggerSaveSpinner', {obj:"true"});
		// Request a token from Stripe:
    	Stripe.card.createToken($form, stripeResponseHandler);
	} else {
		$form.find('.submit').prop('disabled', false);
		Ti.App.fireEvent('app:fromWebTriggerButtonsOn');
	}
    // Prevent the form from being submitted:
    return false;
  });
});

function stripeResponseHandler(status, response) {
  // Grab the form:
  var $form = $('#payment-form');
    // Enable the submit button:
    $form.find('.submit').prop('disabled', false);
    
    var token = response.id;

    // Send the token to appcelerator:
    Ti.App.fireEvent('app:fromWebViewPaymentGetStripeToken', { responseObj: response, statusObj: status });
};


// Trigger the submit button on the form
function submitCard(e) {
	document.getElementById("submit").click();
}