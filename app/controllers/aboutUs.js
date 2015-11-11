/**
 * @class aboutUs
 * This class deals with Selbi's About Us page
 */

var args = arguments[0] || {};
var helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement'),
	AboutUsManager = require('managers/aboutusmanager');
var aboutUsFontSize;



/**
 * @method getAboutUs 
 * Opens addCreditCard view so users can enter in bank account information.
 * If error occurs fetching clientToken, alert modal shows and addCreditCard view is closed automatically.
 */
AboutUsManager.getAboutUs(function(err, aboutUsResults) {
	if(err) {
		dynamicElement.defaultLabel('Guess there isn\'t much to learn about Selbi!  Check back later!', function(err, results) {
			$.aboutUsInfoView.add(results);
		});
		return;
	} else {
		aboutUsBody(aboutUsResults[0].aboutus);
		return;	
	}
});





/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/


switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        aboutUsFontSize = 15;
	        defaultLabelWidth = '85%';
	        break;
	    case 1: //iphoneFive
	        aboutUsFontSize = 16;
	        defaultLabelWidth = '85%';
	        break;
	    case 2: //iphoneSix
	        aboutUsFontSize = 18;
	        defaultLabelWidth = '80%';
	        break;
	    case 3: //iphoneSixPlus
	        aboutUsFontSize = 20;
	        defaultLabelWidth = '80%';
	        break;
	    case 4: //android currently same as iphoneSix
	        aboutUsFontSize = 18;
	        defaultLabelWidth = '80%';
	        break;
};



/**
 * @method aboutUsBody
 * @param {String} aboutUsText Text string from server with About Us paragraph
 * Dynamically creates AboutUs text on app.
 */
function aboutUsBody(aboutUsText) {
	var aboutUsStatement = Titanium.UI.createLabel({
		color: "#1BA7CD",
		bottom: '30dp',
		font: {
			fontSize: aboutUsFontSize,
			fontFamily: "Nunito-light"
		},
		text: aboutUsText
	});
	$.aboutUsInfoView.add(aboutUsStatement);
};
