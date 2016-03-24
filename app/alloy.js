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

//Help to determine which iPhone is being used
var iPhoneFreeze = Object.freeze({
	0 : 'iPhoneFour',
	1 : 'iPhoneFive',
	2 : 'iPhoneSix',
	3 : 'iPhoneSixPlus',
	4 : 'android'
});

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
Alloy.Globals.iPhone = iPhoneFreeze[Alloy.Globals.userDevice];
console.log('+++++++++++ ', Alloy.CFG.keychain.account, '=====', Alloy.CFG.keychain.password);
console.log("width :", Ti.Platform.displayCaps.platformWidth);
console.log("height :", Ti.Platform.displayCaps.platformHeight);

Alloy.Globals.removeChildren = function(view) {
	if (view) {
		if (view.length) {
			// it's an array of views (eg. the views of a scrollableView)
			for (var i = 0; i < view.length; i++) {
				Alloy.Globals.removeChildren(view[i]);
			}
		} else {
			if (view.children) {
				// https://developer.appcelerator.com/question/78311/removing-all-child-objects-from-a-view
				var removeData = [];
				for (var i = view.children.length; i > 0; i--) {
					removeData.push(view.children[i - 1]);
				}
				for (var i = 0; i < removeData.length; i++) {
					view.remove(removeData[i]);
					Alloy.Globals.removeChildren(removeData[i]);
				}
				removeData = null;
			}

			// handle special cases
			switch(view.apiName) {
			case 'Ti.UI.ScrollableView':
				// useless because the views are automatically removed (?) from the scrollableView if the parent window is being closed
				// views is always an empty array
				var views = view.views;
				for (var i = 0; i < views.length; i++) {
					Alloy.Globals.removeChildren(views[i]);
				}
				break;
			}
		}
		view = null;
	}
};

Alloy.Globals.deallocate = function(_obj) {
	try {
		// we know that waht we pass inside this function is going to be an object
		// but let's check first
		if (_.isObject(_obj)) {
			//console.log('cleaning object! '+_obj +' type '+typeof _obj);
			// iterate through the object and deallocate memory from all the children
			_.each(_obj, function(child) {

				// children could be only propeties, or other UI objects/controllers or functions
				if (_.isObject(child) && !_.isFunction(child) && !_.isEmpty(child)) {
					Alloy.Globals.deallocate(child);
				}
			});
			_obj = null;
		} else {
			Ti.API.info('passed in _obj to be cleaned is not an object!');
		}
	} catch(error) {
		Ti.API.error('Error: ' + error);
	}
};

