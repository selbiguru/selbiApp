/**
 * @class Controls
 * Custom wrapper for creating views and windows
 */

var Alloy=require('alloy');

/**
 * @method getMainView
 * Returns instance of the main view
 */
exports.getMainView=function(){
	return Alloy.createController('friendslistings', ['friendslistings', Ti.App.Properties.getString('userId')]);
};

/**
 * @method getMenuView
 * Returns instance of the menu view
 */
exports.getMenuView=function(){
	return Alloy.createController('menuview');	
};

/**
 * @method getCustomView
 * returns instance of the requested view and passes the model to the view
 * @param {String} viewName name of the view to load 
 * @param {Object} model model object to be passed to the view
 */
exports.getCustomView = function(viewName, model){
	return Alloy.createController(viewName, model);
};
