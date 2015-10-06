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
	return Alloy.createController('mainview');
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

/**
 * @method createWindow 
 * returns a window instance by appending a heading to the window
 * @param {Object} options options for creating a window
 * @param {Object} instance Instance of the window/tabgroup 
 */
exports.createWindow = function(options, instance) {
	var win = Ti.UI.createWindow(options);
	win.addEventListener('swipe', function(){
		Alloy.Globals.showHideMenu();
	});	
	var headerView = Alloy.createController('header', options);
	headerView.menuButton.addEventListener('click', function(){
		instance.close({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	});
	win.add(headerView.getView());
	return win;
};
