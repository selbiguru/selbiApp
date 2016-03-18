var args = arguments[0] || {};

$.settingsTable.addEventListener("click", function(e){
	function drawView(row){
		Alloy.Globals.openPage(row);
	};
    drawView(e.rowData.id);
});



exports.cleanup = function () {
	Ti.API.info('Cleaning settingsView');
	$.removeListener();
	$.settingsView.removeAllChildren();
	$.settingsView = null;
	Alloy.Globals.deallocate($);
    $ = null;
};


