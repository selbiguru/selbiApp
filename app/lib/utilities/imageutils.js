var ImageUtils = {
	_getExtension: function(fn) {
		// based on http://stackoverflow.com/a/680982/292947
		var re = /(?:\.([^.]+))?$/;
		var tmpext = re.exec(fn)[1];
		return (tmpext) ? tmpext : '';
	},
	RemoteImage: function(a){
		a = a || {};
		var md5;
		var needsToSave = false;
		var savedFile;
		if(a.image){
			md5 = Ti.Utils.md5HexDigest(a.image)+this._getExtension(a.image);
			savedFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,md5);
			if(savedFile.exists()){
				a.image = savedFile;
			} else {
				needsToSave = true;
			}
		}
		var image = Ti.UI.createImageView(a);
		if(needsToSave === true){
			function saveImage(e){
				image.removeEventListener('load',saveImage);
				savedFile.write(
					Ti.UI.createImageView({image:image.image,width:'auto',height:'auto'}).toImage()
				);
			}
			image.addEventListener('load',saveImage);
		}
		return image;
	}
};

exports.Utils = ImageUtils;