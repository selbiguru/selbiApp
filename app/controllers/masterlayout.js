/**
 * MasterLayout:
 * 	This controller is responsible for creating all the menu's and
 * 	perform actions on the menus to open the right view.
 * Usage:
 * 	In order to add a new view simply add a method to controls lib to obtain the view
 * 	and add the view to the "viewList" with the correct row number. That's it !
 */

var args = arguments[0] || {};
var controls = require('controls');

// get all the view as objects
var menuView = controls.getMenuView();
var mainView = controls.getMainView();

var hideMenu = function() {
	$.drawermenu.showhidemenu();
	$.drawermenu.menuOpen = !$.drawermenu.menuOpen;
};

/**
 * Initializes all the menu items, views and events associated to each menu item
 */
function initialize() {
	if (mainView.menuButton) {
		mainView.menuButton.addEventListener('click', hideMenu);
	}
	
	// initialize the menu
	$.drawermenu.init({
		menuview : menuView.getView(),
		mainview : mainView.getView(),
		duration : 200,
		parent : $.master
	});

}

// setup the list of views
var viewList = {
	"row0" : 'edituserprofile',
	"createlisting" : 'createlisting',
	"notifications" : 'notifications',
	"friendslistings" : 'friendslistings',
	"selbiusa" : 'selbiusa',
	"mylistings" : 'mylistings',
	"contacts" : 'contacts',
	"settings" : 'settings'
};

var listings = ['friendslistings', 'selbiusa', 'mylistings'];

var secondaryPages = ['aboutUs', 'addBankAccount', 'addCreditCard', 'addressgooglemap', 'faq', 'invitefriends', 'payment', 'phoneVerify', 'verifyaddress', 'viewlisting', 'contactUs', 'addfriends', 'edituserprofile'];

var controllerList = {'friendslistings' : mainView};

initialize();

// add event listener in this context menuView Table 1
menuView.menuTable.addEventListener('click', onMenuClickListener);

// add event listener in this context menuView Table 2
menuView.menuTable2.addEventListener('click', onMenuClickListener);


function drawView(row) {
	for (var property in controllerList) {
		var viewController = controllerList[property];
		if (viewController) {
			if (viewController.menuButton) {
				viewController.menuButton.removeEventListener('click', hideMenu);
				Ti.API.info('removeEventListener'); 
			}

			if (viewController.cleanup) {
				Ti.API.info('Releasing controller ' + property);
				viewController.cleanup();
			}
			var view = viewController.getView();
			Alloy.Globals.removeChildren(view);
			$.drawermenu.drawermainview.remove(view);
			view = null;
		} 
		
		viewController = null;
		controllerList[property] = null;
		delete controllerList[property];
	}

	if(row==='row8'){
		$.mainWindow.close();
	    return;
	}
	
	var viewController;
	if (listings.indexOf(row) >= 0) {
		viewController = controls.getCustomView(viewList[row], [viewList[row], Ti.App.Properties.getString('userId')]);
	} else {
		viewController = controls.getCustomView(viewList[row]);
	}

	controllerList[row] = viewController;
	if (viewController.menuButton) {
		viewController.menuButton.addEventListener('click', hideMenu);
	}
	$.drawermenu.drawermainview.add(viewController.getView());
	viewController = null;
	
	Ti.API.info('List After open ' + JSON.stringify(controllerList));
};

function onMenuClickListener(e) {
	$.drawermenu.showhidemenu();
	$.drawermenu.menuOpen = false;
	//update menuOpen status to prevent inconsistency.
	setTimeout(function(){
		drawView(e.rowData.id);
	},200);
	// on Android the event is received by the label, so watch out!
	Ti.API.info('Clicked ' + e.rowData.id);
}

/**
 * Open any view and pass a model to the view.
 * @param {Object} viewName view to open
 * @param {Object} model	model to be passed to the view
 */
Alloy.Globals.openPage = function openPage(viewName, model) {

	for (var property in controllerList) {
		if(property===viewName){
			var viewController = controllerList[property];
			if (viewController) {
				if (viewController.menuButton) {
					viewController.menuButton.removeEventListener('click', hideMenu);
				}
				if (viewController.cleanup) {
					Ti.API.info('Releasing controller ' + property );
					viewController.cleanup();
				}
				var view = viewController.getView();
				Alloy.Globals.removeChildren(view);
				$.drawermenu.drawermainview.remove(view);
				view = null;
			} 
			
			viewController = null;
			controllerList[property] = null;
			delete controllerList[property];
		}
	}
	
	var viewController = controls.getCustomView(viewName, model);
	controllerList[viewName] = viewController;
	$.drawermenu.drawermainview.add(viewController.getView());
	if (viewController.menuButton) {
		viewController.menuButton.addEventListener('click', hideMenu);
	}
	viewController = null;
	Ti.API.info('List After open ' + JSON.stringify(controllerList));
};

/**
 * Close a page that is open. Silently returns if the page is not open
 */
Alloy.Globals.closePage = function(pageName) {
	var viewController = controllerList[pageName];
	if (viewController) {
		if (viewController.menuButton) {
			viewController.menuButton.removeEventListener('click', hideMenu);
			Ti.API.info('removeEventListener');   
		}
		if (viewController.cleanup) {
			Ti.API.info('Releasing controller ' + pageName);
			viewController.cleanup();
		}
		var view = viewController.getView();
		Alloy.Globals.removeChildren(view);
		$.drawermenu.drawermainview.remove(view);
		view = null;
		viewController = null;
		controllerList[pageName] = null;	
		delete controllerList[pageName];
	}
	
	Ti.API.info('List After close ' + JSON.stringify(controllerList));
};

$.mainWindow.addEventListener('close',function(){
	menuView.menuTable.removeEventListener('click', onMenuClickListener);
	menuView.menuTable2.removeEventListener('click', onMenuClickListener);
	$.off();
	$.destroy();
	Alloy.Globals.removeChildren($.mainWindow);
	$.mainWindow = null;
	Alloy.Globals.deallocate($);
    $ = null;
    Ti.API.info('Closing master layout window.');
});
/**
 * Format a string in the following format
 * 'The {0} is dead. Don\'t code {0}. Code {1} that is open source!'.format('ASP', 'PHP');
 * @return {string}
 */
String.prototype.format = function() {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{' + i + '\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i]);
	}
	return formatted;
};

/**
 * Display Number in Currency format
 * @param {Object} c	culture
 * @param {Object} d 	decimal separator
 * @param {Object} t	format separator
 */
Number.prototype.formatMoney = function(c, d, t) {
	var n = this,
	    c = isNaN( c = Math.abs(c)) ? 2 : c,
	    d = d == undefined ? "." : d,
	    t = t == undefined ? "," : t,
	    s = n < 0 ? "-" : "",
	    i = parseInt( n = Math.abs(+n || 0).toFixed(c)) + "",
	    j = ( j = i.length) > 3 ? j % 3 : 0;
	return "$" + s + ( j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ( c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
