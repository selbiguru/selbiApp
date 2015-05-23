var AuthManager = require('managers/authManager'),
	args = arguments[0] || {};



function loginUser(){
	// Todo: validation
	
	AuthManager.login($.username.value, $.password.value, function(err, loginResult){
		if(loginResult) {
			console.log("Successfully logged in");
		}
	});	
}

function closeWindow(){
	$.login.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}
