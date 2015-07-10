var args = arguments[0] || {};
var address;

Ti.App.addEventListener('app:cancelAddressWebView', function(e) {
	Alloy.Globals.closePage('addressgooglemap');
	address = {};
});

Ti.App.addEventListener('app:verifyAddressWebView', function(e) {
	//verify that an address has been chosen via google places.
	if (!address) {
		alert("You must fill out an Address before you can verify!");
		return;
	} else {
		//addd stuff here
		address = {};
	}
	console.log("verify adddress", address);
});

Ti.App.addEventListener('app:getAddressWebView', function(e) {
	address = e.address;
	console.log("getting adddress",address);
});
