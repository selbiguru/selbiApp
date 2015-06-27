var baseUrl = "http://sails-server.herokuapp.com";
var keychain = require('com.obscure.keychain');
var keychainItem = keychain.createKeychainItem(Alloy.CFG.keychain.account, Alloy.CFG.keychain.password);

exports.execute = function(relativePath, method, objectToSend, isAuth, callback) {
    var xhr = Titanium.Network.createHTTPClient(),
        url = baseUrl + relativePath; 

    xhr.onerror = function(e) {
        Ti.API.error('Bad Sever =>' + e.error);
        alert('Bad Sever =>' + e.error);
        callback(e.error, null);
    };

    xhr.open(method, url);
    xhr.setRequestHeader("content-type", "application/json");
    
    if(isAuth) {
    	var authHeader = "Bearer " + keychainItem.valueData;
    	xhr.setRequestHeader("Authorization", authHeader);
    }
	
	var objectJSON = objectToSend ? JSON.stringify(objectToSend) : {};
    Ti.API.info('Params' + objectJSON);
    xhr.send(objectJSON);
	
    xhr.onload = function() {
        Ti.API.info('RAW =' + this.responseText);
        if (this.status == 200 || this.status == 201) {
            Ti.API.info('got my response, http status code ' + this.status);
            if (this.readyState == 4) {
                var response = JSON.parse(this.responseText);
                Ti.API.info('Response = ' + response);
            } else {
                alert('HTTP Ready State != 4');
            }
            if (callback) {
                callback(null, response);
            }
        } else {
            alert('HTTp Error Response Status Code = ' + this.status);
            Ti.API.error("Error =>" + this.response);
            if (callback) {
                callback(new Error(this.response));
            }
        }

    };
};