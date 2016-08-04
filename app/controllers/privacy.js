// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;



/**
 * @private backButton 
 *  Closes the current view to reveal the previous still opened view.
 */
function backButton() {
	Alloy.Globals.closePage('privacy');
};


exports.cleanup = function () {
	$.off();
	$.destroy();
	$.privacyButtonIcon.removeEventListener('click', backButton);
	$.removeListener();
	Alloy.Globals.removeChildren($.privacyView);
	$.privacyView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};