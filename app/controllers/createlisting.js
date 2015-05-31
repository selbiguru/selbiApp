var args = arguments[0] || {};
var imageManager = require('managers/imagemanager');

// ref: https://github.com/pablorr18/TiFlexiGrid
$.fg.init({
    columns:3,
    space:5,
    gridBackgroundColor:'#fff',
    itemHeightDelta: 0,
    itemBackgroundColor:'#eee',
    itemBorderColor:'transparent',
    itemBorderWidth:0,
    itemBorderRadius:0
});

function addItemToGrid(title, image){
	$.fg.addGridItem({title: title, image: image});
}

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
 			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.tempDirectory, 'upload.jpg');
 			f.write(event.media);
 			addItemToGrid("test", 'http://res.cloudinary.com/selbi/image/upload/v1433095290/0ffe2510-07bf-11e5-9a41-f5b118aa6622.jpg');
 			imageManager.uploadImage(Titanium.Filesystem.tempDirectory + 'upload.jpg');
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
