/**
* this is the main index.js file
* @class Index
*/

var AuthManager = require('managers/authmanager');
var controls=require('controls');
 
// Source: https://github.com/FokkeZB/UTiL/blob/master/XCallbackURL/XCallbackURL.js
var XCallbackURL = require('utilities/XCallbackURL');
 
function handleURL(url) {
    var URL = XCallbackURL.parse(url),
        controller = URL.action(),
        args = URL.params();
        
    // Add some better logic here ;)
    Alloy.createController(controller, args || {}).getView().open();
}


// We don't want our URL to do anything before our main window is open
$.index.addEventListener('open', function (e) {
    console.log("URL", Ti.App.getArguments().url);
    if (OS_IOS) {
        
        // Handle the URL in case it opened the app
        handleURL(Ti.App.getArguments().url);
        
        // Handle the URL in case it resumed the app
        Ti.App.addEventListener('resume', function () {
            handleURL(Ti.App.getArguments().url);
        });
        
    } else if (OS_ANDROID) {
        
        // On Android, somehow the app always opens as new
        handleURL(Alloy.globals.url);
    }
});

if (AuthManager.isLoggedIn() == 1) {
	var mainController = Alloy.createController('masterlayout').getView();
	mainController.open();		
} else {
	$.index.open();
}

function signIn(){
	var controller = Alloy.createController('login').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}

function register(){
	var controller = Alloy.createController('register').getView();
	controller.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}
