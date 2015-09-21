// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};


//Determine which device is being used to display Selbi App
Alloy.Globals.iPhoneFour = (Ti.Platform.displayCaps.platformHeight === 480);
Alloy.Globals.iPhoneFive = (Ti.Platform.displayCaps.platformHeight === 568);
Alloy.Globals.iPhoneSix = (Ti.Platform.displayCaps.platformHeight === 667);
Alloy.Globals.iPhoneSixPlus = (Ti.Platform.displayCaps.platformHeight === 736);
Alloy.Globals.android = (Ti.Platform.osname === 'android');
Alloy.Globals.social = require('alloy/social');

//Assign a digit to the device being used for creating xml elements dynamically to the userDevice global variable
//Aids in tss markup.
Alloy.Globals.userDevice = Alloy.Globals.iPhoneFour ? 0 : Alloy.Globals.iPhoneFive ? 1 : Alloy.Globals.iPhoneSix ? 2 : Alloy.Globals.iPhoneSixPlus ? 3 : Alloy.Globals.android ? 4 : false;
	
	
console.log("width :", Ti.Platform.displayCaps.platformWidth);
