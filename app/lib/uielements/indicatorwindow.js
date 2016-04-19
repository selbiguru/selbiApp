/**
 * Indicator window with a spinner and a label
 * 
 * @param {Object} args
 */
function createIndicatorWindow(args) {
    var width = 180,
        height = 50;

    var args = args || {};
    var top = args.top || 240;
    
    var win = Titanium.UI.createWindow({
        height:height,
        width:width,
        top:top,
        borderRadius:10,
        touchEnabled:false,
        backgroundColor:'#000',
        opacity:0.6
    });
    
    var view = Ti.UI.createView({
        width:Ti.UI.SIZE,
        height:Ti.UI.FILL,
        center: {x:(width/2), y:(height/2)},
        layout:'horizontal'
    });
    
    function osIndicatorStyle() {
        style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
        
        if ('iPhone OS' !== Ti.Platform.name) {
            style = Ti.UI.ActivityIndicatorStyle.DARK;            
        }
        
        return style;
    }
     
    var activityIndicator = Ti.UI.createActivityIndicator({
        style:osIndicatorStyle(),
        left:0,
        height:Ti.UI.FILL,
        width:30
    });
    
    var label = Titanium.UI.createLabel({
        left:10,
        width:Ti.UI.FILL,
        height:Ti.UI.FILL,
        text:L(args.message || 'spinner'),
        color: '#fff',
        font: {fontFamily:'Helvetica Neue', fontSize:16, fontWeight:'bold'},
    });

    view.add(activityIndicator);
    view.add(label);
    win.add(view);

    function openIndicator() {
        win.open();
        activityIndicator.show();
        Ti.API.info('openIndicator');
    }
    
    win.openIndicator = openIndicator;
    
    function closeIndicator() {
        activityIndicator.hide();
        win.close();
    }
    
    win.closeIndicator = closeIndicator;
    
    win.addEventListener('close',function(e){
    	e.source.openIndicator = null;
    	e.source.closeIndicator = null;
		Alloy.Globals.removeChildren(e.source);
		Alloy.Globals.deallocate(e.source);
		e.source = null;
		view = null;
		activityIndicator = null;
		label = null;
		win = null;
		Ti.API.info('closeIndicator');
    });
    
    win.uploadImage = function(saveResult, previewImageCollection){
    	
    	var listingManager = require('managers/listingmanager');
    	var helpers = require('utilities/helpers');
    	
    	listingManager.uploadImagesForListing(saveResult.id, previewImageCollection, function(err, imgUrls) {
				 if (imgUrls && imgUrls.length > 0) {
					delete saveResult.rev;
					saveResult.imageUrls = imgUrls;
					listingManager.updateListing(saveResult, function(err, updateResult) {
						win.closeIndicator();
						win = null;
						helpers.alertUser('Listing','Listing created successfully');
						Alloy.Globals.closePage('viewlisting');
						Alloy.Globals.openPage('createlisting');	
					});
				} else {
					win.closeIndicator();
					win = null;	
					helpers.alertUser('Listing','Listing created successfully');
					Alloy.Globals.closePage('viewlisting');
					Alloy.Globals.openPage('createlisting');
				}
			});
		
    };
    return win;
}

// Public interface
exports.createIndicatorWindow = createIndicatorWindow;