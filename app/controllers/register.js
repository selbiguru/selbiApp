var args = arguments[0] || {};

function closeRegisterWindow(){
	$.register.close({ transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
}