var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');

listingManager.getListing(args, function(err, listing){
	console.log(listing);
	var views = [];
	if(!err && listing) {
		$.title.setText(listing.title);
		$.price.setText(listing.price.formatMoney(2));
		$.description.setText(listing.description);
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

function goBack() {
	Alloy.Globals.closePage('viewlisting');
}
