var args = arguments[0] || {};
var authManager = require('managers/authmanager');

function logout(){
	authManager.logout(function(err, result){
		if(!err && result) {
			var indexController = Alloy.createController('index').getView();
			indexController.open({ transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});	
		}
	});	
}