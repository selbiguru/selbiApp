/**
 * MasterLayout: 
 * 	This controller is responsible for creating all the menu's and 
 * 	perform actions on the menus to open the right view.
 * Usage:
 * 	In order to add a new view simply add a method to controls lib to obtain the view 
 * 	and add the view to the "viewList" with the correct row number. That's it !
 */

var args = arguments[0] || {};
var controls=require('controls');

// get all the view as objects
var menuView = controls.getMenuView();
var mainView = controls.getMainView();

/**
 * Initializes all the menu items, views and events associated to each menu item
 */
function initialize() {
	mainView.menuButton.addEventListener('click',function(){
		$.drawermenu.showhidemenu();
		$.drawermenu.menuOpen=!$.drawermenu.menuOpen;
	});
		
	// initialize the menu
	$.drawermenu.init({
	    menuview:menuView.getView(),
	    mainview:mainView.getView(),
	    duration:200,
	    parent: $.master
	});
}

// setup the list of views 
var viewList = {
	"row": 'mainView',
	"row0": 'edituserprofile',
	"row1": 'createlisting',
	"row2": 'invitefriends',
	"row3": 'notifications',
	"row4": 'mylistings',
	"row5": 'listings',
	"row6": 'settings'
};

var controllerList = {};

initialize();



// add event listener in this context menuView Table 1
menuView.menuTable.addEventListener('click',onMenuClickListener);

// add event listener in this context menuView Table 2
menuView.menuTable2.addEventListener('click',onMenuClickListener);

function onMenuClickListener(e){
	function drawView(row){
		for (var property in viewList) {
		    if (property === row) {
		    	var viewController = controls.getCustomView(viewList[row]);
		    	controllerList[row]= (viewController);
		    	viewController.menuButton.addEventListener('click',function(){
					$.drawermenu.showhidemenu();
					$.drawermenu.menuOpen=!$.drawermenu.menuOpen;
				});
		        $.drawermenu.drawermainview.add(viewController.getView());
		    } else {
		    	if(controllerList[property])
		    		$.drawermenu.drawermainview.remove(controllerList[property].getView());
		    }
		}
	};
	
    $.drawermenu.showhidemenu();
    $.drawermenu.menuOpen = false; //update menuOpen status to prevent inconsistency.
    drawView(e.rowData.id);
    
    // on Android the event is received by the label, so watch out!
    Ti.API.info(e.rowData.id); 
}

/**
 * Open any view and pass a model to the view.
 * @param {Object} viewName view to open
 * @param {Object} model	model to be passed to the view
 */
Alloy.Globals.openPage = function openPage(viewName, model){	
	viewList[viewName] = controls.getCustomView(viewName, model);
	if(viewList[viewName]){
		for (var property in viewList) {
		    if (property === viewName) {
		    	var newView = viewList[viewName].getView();
		    	//newView.left = 320;
    			//newView.animate({left:0, duration:400});    			
		        $.drawermenu.drawermainview.add(newView);
				if(viewList[viewName].menuButton) {
			        viewList[viewName].menuButton.addEventListener('click',function(){
						$.drawermenu.showhidemenu();
						$.drawermenu.menuOpen=!$.drawermenu.menuOpen;
					});
				}
		    } else {
		    	//$.drawermenu.drawermainview.remove(viewList[viewName]);
		    }
		}	
	} else {
		//TODO: Error
	}
};

/**
 * Close a page that is open. Silently returns if the page is not open 
 */
Alloy.Globals.closePage = function(pageName){
	if(viewList[pageName]) {
		$.drawermenu.drawermainview.remove(viewList[pageName].getView());
	}
};


/**
 * Format a string in the following format
 * 'The {0} is dead. Don\'t code {0}. Code {1} that is open source!'.format('ASP', 'PHP');
 * @return {string}
 */
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
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
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return "$" + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };