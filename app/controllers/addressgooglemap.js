var args = arguments[0] || {};
var address = [];
console.log("&&&&&&&&&&&", address);
Ti.App.addEventListener('app:cancelAddressWebView', function(e) {
	Alloy.Globals.closePage('addressgooglemap');
	address = [];
	return;
});

Ti.App.addEventListener('app:verifyAddressWebView', function(e) {
	//verify that an address has been chosen via google places.
	if (!address || !address.length) {
		console.log("WE IN HERE");
		alert("You must fill out an Address before you can verify!");
	} else {
		Alloy.Globals.openPage('verifyaddress');
		console.log("verify adddress", address);
		address = [];
	}
	return;
});

Ti.App.addEventListener('app:getAddressWebView', function(e) {
	address.push(e.address);
	console.log("getting adddress",address);
	return;
});
