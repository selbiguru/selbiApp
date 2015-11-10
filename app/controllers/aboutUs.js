var args = arguments[0] || {};
var helpers = require('utilities/helpers'),
	AboutUsManager = require('managers/aboutusmanager');


AboutUsManager.getAboutUs(function(err, aboutUsResults) {
	if(err) {
		//helpers.alertUser('Oops!')
		//build out no AboutUs template
		return;
	}
	$.aboutUsBody.text = aboutUsResults[0].aboutus;
	return;
});
