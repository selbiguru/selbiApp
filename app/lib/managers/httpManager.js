/**
 * @class HttpManager
 * HttpManager class to perform http calls against the sails server
 * Provides helper methods to perform oAuth based http calls
 */

/**
 * @property {String} baseUrl Base Url for all the http calls
 */
var baseUrl = "http://sails-server.herokuapp.com";
var keychain = require('com.obscure.keychain');
var keychainItem = keychain.createKeychainItem(Alloy.CFG.keychain.account, Alloy.CFG.keychain.password);

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
                //Ti.API.info('Response = ' + response);
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