var args = arguments[0] || {};

function closeForgotPassword(){
	$.forgotpassword.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}