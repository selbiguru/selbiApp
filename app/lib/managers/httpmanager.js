/**
 * @class Httpmanager
 * Httpmanager class to perform http calls against the sails server
 * Provides helper methods to perform oAuth based http calls
 */

/**
 * @property {String} baseUrl Base Url for all the http calls
 */
var baseUrl = Alloy.CFG.herokuServer.baseurl;
var keychain = require('com.obscure.keychain');
var keychainItem = keychain.createKeychainItem(Alloy.CFG.keychain.account);



/**
 * @method execute
 * This is a generic method to perform all the http calls to the sails server
 * It optionally provides oAuth calls.
 * @param {Object} relativePath relative path to the api
 * @param {Object} method	HttpMethod to be used (PUT, POST, GET, DELETE)
 * @param {Object} objectToSend JSON Object that needs to be sent via http
 * @param {Object} isAuth Indicates if the http call needs oAuth, It grabs the token from keychain
 * @param {Object} callback	Callback function after completing the http request
 */
var execute = exports.execute = function(relativePath, method, objectToSend, isAuth, callback) {
    var xhr = Titanium.Network.createHTTPClient(),
        url = baseUrl + relativePath;

    xhr.onerror = function(e) {
    	var extendedError = xhr.responseText != 'null' ? xhr.responseText : e.error;
        callback(extendedError, null);
        xhr.abort();
        xhr = null;
    };

    xhr.open(method, url);
    xhr.setRequestHeader("content-type", "application/json");

    if(isAuth) {
    	var authHeader = "Bearer " + 'eyJhbGciOiJIUzI1NiJ9.NTY2NGUwMDU0NjhjYzI1ZWZjOTMxMWU4.O-iDaDO4pBb34lQeKUkyKT1mLKdJfZHIYf57ez_hc7M';
    	xhr.setRequestHeader("Authorization", authHeader);
    }

	var objectJSON = objectToSend ? JSON.stringify(objectToSend) : {};
    xhr.send(objectJSON);

    xhr.onload = function() {
        if (this.status == 200 || this.status == 201) {
            if (this.readyState == 4) {
                var response = JSON.parse(this.responseText);
            } else {
                alert('HTTP Ready State != 4');
            }
            callback(null, response);
        } else {
            alert('HTTp Error Response Status Code = ' + this.status);
            Ti.API.error("Error =>" + this.response);
            callback(this.response, null);
        }
       xhr.abort(); 
       xhr = null;
    };
};