// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

exports.cleanup = function () {
	Ti.API.info('Cleaning privacy');
	$.off();
	$.destroy();
	$.removeListener();
	Alloy.Globals.removeChildren($.privacyView);
	$.privacyView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};