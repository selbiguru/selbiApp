// Payment Info Component
// Author: Zachary Forrest, modified by Brad Frost
// Requires: jQuery, Modernizer, jQuery.inputmask

(function ($) {

	"use strict";

	$.fn.paymentInfo = function (method) {

		// Global variables.
		var methods,
			events,
			opts;

		

		methods = {

			init: function (options) {

				// Get a copy of our configuration options
				opts = $.extend({}, $.fn.paymentInfo.defaults, options);


				// Loop through our fieldset, find our inputs and initialize them.
				return this.each(function () {

					$(this)
						.find("label")
							.addClass("hide")
						.end()
						.find("." + opts.cardNumberClass)

							.before("<span class='" + opts.cardImageClass + "'></span>")
						.end()
						.find("." + opts.cardExpirationClass)

							.addClass("hide")
						.end()
						.find("." + opts.cardCvvClass)
							.addClass("hide")
						.end()
						.find("." + opts.cardZipClass)
							.addClass("hide")
						.end();

						if(opts.cardInstruction) {
							$(this).
								after("<span class='" + opts.cardInstructionClass + "'>"+ opts.messageEnterCardNumber + "</span>");
						}					

				});
			},

		};

		// Plugin methods API
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		if (typeof method === "object" || !method) {
			return methods.init.apply(this, arguments);
		}
		return $.error("Method does not exist in plugin");

	};

	// Plugin config options.
	$.fn.paymentInfo.defaults = {
		cardImageClass: "card-image",
		cardCvvClass: "card-cvv",
		cardExpirationClass: "card-expiration",
		cardZipClass: "card-zip",
		cardNumberClass: "card-number",
		cardInstruction : true,
		cardInstructionClass: "card-instruction",
		messageEnterCardNumber : "Please enter your credit card number",
	};

}(jQuery));

$(".credit-card-group").paymentInfo();