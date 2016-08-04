// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	Alloy.Globals.closePage('termsconditions');
};

exports.cleanup = function () {
	$.off();
	$.destroy();
	$.termsConditionsButtonIcon.removeEventListener('click', backButton);
	$.removeListener();
	Alloy.Globals.removeChildren($.termsConditionsView);
	$.termsConditionsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};