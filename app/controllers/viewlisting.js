var args = arguments[0] || {};
var listingManager = require('managers/listingmanager');
var ImageUtils = require('utilities/imageutils');

listingManager.getListing(args, function(err, listing){
	console.log("GET THIS LSITING!!!!!!!!!!!!!!!!!! ",listing);
	var views = [];
	if(!err && listing) {
		var profileImageUrl = '';
		$.viewListingProductTitle.setText(listing.title);
		$.viewListingProductPrice.setText(listing.price.formatMoney(2));
		$.viewListingProductDescription.setText(listing.description);
		$.sellerName.setText(listing.user.firstName +' '+listing.user.lastName);
		$.sellerImage.setText(listing.user.firstName +' '+listing.user.lastName);
		if(listing.user.profileImage){
			profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + listing.user.profileImage;
		} else {
			profileImageUrl = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.menu + Alloy.CFG.cloudinary.bucket + "2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg";
		}
		$.sellerImage.image = profileImageUrl;
		for(var img in listing.imageUrls) {
			var container =  Titanium.UI.createView({
				top: 0,
				left: 0,
			  	borderRadius: 0,
			  	backgroundColor: "#E5E5E5"	  
			});
			container.add(ImageUtils.Utils.RemoteImage({
				height: Ti.UI.FILL,
				width: Ti.UI.FILL,
				image: Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.listingView + Alloy.CFG.cloudinary.bucket + listing.imageUrls[img]
			}));
			
			views.push(container);
		}
		$.imageGallery.views = views;
	}
});



function publishListing() {
	
};


function goBack() {
	Alloy.Globals.closePage('viewlisting');
};
