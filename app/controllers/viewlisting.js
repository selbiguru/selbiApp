var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');
var ImageUtils = require('utilities/imageutils');

listingManager.getListing(args, function(err, listing){
	console.log(listing);
	var views = [];
	if(!err && listing) {
		$.title.setText(listing.title);
		$.price.setText(listing.price.formatMoney(2));
		$.description.setText(listing.description);
		for(var img in listing.imageUrls) {
			var container =  Titanium.UI.createView({
				top: 0,
				left: 0,
			  	height:       '95%',
			  	width:        '100%',
			  	borderRadius: 0	  
			});
			container.add(ImageUtils.Utils.RemoteImage({
				height: '100%',
				image: Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.listingView + Alloy.CFG.cloudinary.bucket + listing.imageUrls[img]
			}));
			
			views.push(container);
		}
		$.imageGallery.views = views;
	}
});

function goBack() {
	Alloy.Globals.closePage('viewlisting');
}
