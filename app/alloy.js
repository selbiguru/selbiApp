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

//Determine which device device is being used to display Selbi App
<<<<<<< HEAD
Alloy.Globals.iPhoneFour = (Ti.Platform.displayCaps.platformHeight === 480);
Alloy.Globals.iPhoneFive = (Ti.Platform.displayCaps.platformHeight === 568);
Alloy.Globals.iPhoneSix = (Ti.Platform.displayCaps.platformHeight === 667);
Alloy.Globals.iPhoneSixPlus = (Ti.Platform.displayCaps.platformHeight === 736);
Alloy.Globals.android = (Ti.Platform.osname === 'android');
Alloy.Globals.social = require('alloy/social');
=======
Alloy.Globals.iPhoneFour = (Ti.Platform.displayCaps.platformHeight === 480); // width: 320
Alloy.Globals.iPhoneFive = (Ti.Platform.displayCaps.platformHeight === 568); // width: 320
Alloy.Globals.iPhoneSix = (Ti.Platform.displayCaps.platformHeight === 667); // width: 375
Alloy.Globals.iPhoneSixPlus = (Ti.Platform.displayCaps.platformHeight === 736); // width: 414
Alloy.Globals.android = (Ti.Platform.osname === 'android');
console.log("Height: ", Ti.Platform.displayCaps.platformHeight);
console.log("Height: ", Ti.Platform.displayCaps.platformWidth);

>>>>>>> 3a7739d857cd52ea4f057d9313327f1520dc3ff9
