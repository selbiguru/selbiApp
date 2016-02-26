var args = arguments[0] || {};
var address = [];

function cancelAddressWebView(){
	$.off();
	$.destroy();
	Ti.App.removeEventListener('app:getAddressWebView', getAddressWebView);
	Alloy.Globals.closePage('addressgooglemap');
	address = [];
	return;
}
function verifyAddressWebView(){
	//verify that an address has been chosen via google places.
	if (!address || !address.length) {
		alert("You must fill out an Address before you can verify!");
	} else {
		if (address[0].postal_code === "short_name") {
			alert("This address does not have an associated Zip Code! Please enter a valid address.");
			address = [];
			return;
		}
		Ti.App.removeEventListener('app:getAddressWebView', getAddressWebView);
		Alloy.Globals.openPage('verifyaddress', address);
		address = [];
	}	
	return;
}

Ti.App.addEventListener('app:getAddressWebView', getAddressWebView);

function getAddressWebView(e){
	address.push(e.address);
}
