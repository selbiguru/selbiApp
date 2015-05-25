var args = arguments[0] || {};


function showCamera(){
	
 	console.log("Show camera");
 	
	var _picsTaken = 0;
    var timer = {};
 	 	
    Titanium.Media.showCamera({
 		
        saveToPhotoGallery : true,
        allowEditing : false,
        autohide : false, //Important!
 
        success : function(event) {
 
                  var imageView = Ti.UI.createImageView({
                    width:"100",
                    height:"100",
                    image:event.media
                });
                $.imgView.add(imageView);
 
        },
 
        error : function(error) {
            var a = Titanium.UI.createAlertDialog({
                title : 'Camera'
            });
            if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
                a.setMessage(L('no_camera'));
            } else {
                a.setMessage('Unexpected error: ' + error.code);
            }
            a.show();
        }
    });
}


function showGallery(){
	Titanium.Media.openPhotoGallery({
		showControls: true,
		success : function(event) {
 
                  var imageView = Ti.UI.createImageView({
                    width:"100",
                    height:"100",
                    image:event.media
                });
                
 			$.imgView.add(imageView);
        },
 
        error : function(error) {
            var a = Titanium.UI.createAlertDialog({
                title : 'Camera'
            });
            if (error.code == Titanium.Media.NO_CAMERA || error.code == Titanium.Media.NO_VIDEO) {
                a.setMessage(L('no_camera'));
            } else {
                a.setMessage('Unexpected error: ' + error.code);
            }
            a.show();
        }
	});
}
