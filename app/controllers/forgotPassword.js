var args = arguments[0] || {};

function closeForgotPassword(){
	$.forgotPassword.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}