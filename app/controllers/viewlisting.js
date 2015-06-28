var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');

listingManager.getListing("2bbaa0c7c67912a6e740446eaa13d170", function(err, listing){
	console.log(listing);
	var views = [];
	if(!err && listing) {
		$.title = listing.title;
		$.price = listing.price;
		for(var img in listing.imageUrls) {
			views.push(Titanium.UI.createImageView({
				top: -20,
				left: 0,
				width: '100%',
				height: '100%',
				image: Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.listingView + Alloy.CFG.cloudinary.bucket + listing.imageUrls[img]
			}));
		}
		$.imageGallery.views = views;
	}
});