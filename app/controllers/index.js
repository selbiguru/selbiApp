/**
* this is the main index.js file
* @class Index
*/

var authManager = require('managers/authmanager');
var controls = require('controls');
 
// Source: https://github.com/FokkeZB/UTiL/blob/master/XCallbackURL/XCallbackURL.js
var XCallbackURL = require('utilities/XCallbackURL');
 
function handleURL(url) {
	if(!url) return;
    var URL = XCallbackURL.parse(url),
        controller = URL.action(),
        args = URL.params();
        
    if(controller) {    
	    // Add some better logic here ;)
	    Alloy.createController(controller, args || {}).getView().open();
    }
}



if (authManager.isLoggedIn() == 1) {
	Alloy.createController('masterlayout').getView().open();		
} else {
	$.index.open();
}

function signIn(){
	Alloy.createController('login').getView().open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}

function register(){
	Alloy.createController('register').getView().open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
}

/*function learnMore() {	 
	var introController = Alloy.createController('intro').getView();	
}*/


function openURL(e) {
	console.log("URL", Ti.App.getArguments().url);
    if (OS_IOS) {
        
        // Handle the URL in case it opened the app
        handleURL(Ti.App.getArguments().url);
        
        // Handle the URL in case it resumed the app
        Ti.App.addEventListener('resume', resumeURL);
        
    } else if (OS_ANDROID) {
        
        // On Android, somehow the app always opens as new
        handleURL(Alloy.globals.url);
    }
}


function resumeURL(e) {
	handleURL(Ti.App.getArguments().url);
}

/*************************************************Event Listeners***********************************************************/


// We don't want our URL to do anything before our main window is open
$.index.addEventListener('open', openURL);