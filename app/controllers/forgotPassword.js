var args = arguments[0] || {};

function closeForgotPassword(){
	$.register.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}