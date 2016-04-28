// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

exports.cleanup = function () {
	Ti.API.info('Cleaning terms & conditions');
	$.off();
	$.destroy();
	$.removeListener();
	Alloy.Globals.removeChildren($.termsConditionsView);
	$.termsConditionsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};