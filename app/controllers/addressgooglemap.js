var args = arguments[0] || {};
var address = [];

function cancelAddressWebView(){
	Alloy.Globals.closePage('addressgooglemap');
	address = [];
	return;
}
function verifyAddressWebView(){
	//verify that an address has been chosen via google places.
	if (!address || !address.length) {
		alert("You must fill out an Address before you can verify!");
	} else {
		Alloy.Globals.openPage('verifyaddress', address);
		console.log("verify adddress", address);
		address = [];
	}	
	return;
}

Ti.App.addEventListener('app:getAddressWebView', function(e) {
	address.push(e.address);
	return;
});
