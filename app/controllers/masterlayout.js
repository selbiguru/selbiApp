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

Alloy.Globals.openPage = function openPage(viewName){	
	viewList[viewName] = controls.getCustomView(viewName);
	if(viewList[viewName]){
		for (var property in viewList) {
		    if (property === viewName) {
		        $.drawermenu.drawermainview.add(viewList[viewName].getView());
		        viewList[viewName].menuButton.addEventListener('click',function(){
					$.drawermenu.showhidemenu();
					$.drawermenu.menuOpen=!$.drawermenu.menuOpen;
				});
		    } else {
		    	//$.drawermenu.drawermainview.remove(viewList[viewName]);
		    }
		}	
	} else {
		//TODO: Error
	}
};
