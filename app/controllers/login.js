var httpClient = require('managers/httpManager'),
	args = arguments[0] || {};


function loginUser(){
	// Todo: validation
	
	
	// Prepare request
	var loginRequest = {
		"identifier": $.username.value,
		"password": $.password.value
	};
	
	// Execute Request
	httpClient.execute("/login", "POST", loginRequest, function(err, loginResult){
		console.log(err, loginResult);
	});
}

function closeWindow(){
	$.login.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}
