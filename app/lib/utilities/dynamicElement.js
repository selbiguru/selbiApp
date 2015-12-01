/**
 * @class dynamicElements
 * This class deals with creating dynamic elements
 */

var aboutUsFontSize, defaultLabelWidth;


/**
 * @switch dynamicElements
 * Switch statement that determines dynamic styling for all devices.
 */

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
	        defaultLabelWidth = '85%';
	        break;
	    case 3: //iphoneSixPlus
	        aboutUsFontSize = 20;
	        defaultLabelWidth = '85%';
	        break;
	    case 4: //android currently same as iphoneSix
	        aboutUsFontSize = 18;
	        defaultLabelWidth = '85%';
	        break;
};




/**
 * @method defaultLabel 
 * @param {String} defaultText Text string for About Us in case of error
 * @param {cb} cb CB function to return dynamic label
 * If error occurs fetching data for a view, this method dynamically adds a default label.
 */
var defaultLabel = exports.defaultLabel = function(defaultText, cb) {
	var aboutUsDefault = Titanium.UI.createLabel({
		color: "#1BA7CD",
		height: Ti.UI.FILL,
		font: {
			fontSize: aboutUsFontSize,
			fontFamily: "Nunito-Bold"
		},
		text: defaultText
	});
	cb(null, aboutUsDefault);
};