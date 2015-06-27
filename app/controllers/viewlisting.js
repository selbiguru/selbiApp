var args = arguments[0] || {};


var view1 = Titanium.UI.createImageView({
		top: -20,
		left: 0,
		width: '100%',
		height: '100%',
		image: "http://res.cloudinary.com/selbi/image/upload/h_400,w_400/v1433476215/2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1215cc/listing_5d84c5a0-1962-11e5-8b0b-c3487359f467.jpg"
	});
var view2 = Titanium.UI.createImageView({
		top: -20,
		left: 0,
		width: '100%',
		height: '100%',
		image: "http://res.cloudinary.com/selbi/image/upload/h_400,w_400/v1433476215/2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1323cd/listing_31b676a0-19d8-11e5-8a75-fdb585f6aa0b"
	});
var view3 = Titanium.UI.createImageView({
		top: -20,
		left: 0,
		width: '100%',
		height: '100%',
		image: "http://res.cloudinary.com/selbi/image/upload/h_400,w_400/v1433476215/2bbaa0c7c67912a6e740446eaa01954c/2bbaa0c7c67912a6e740446eaa1323cd/listing_31b676a0-19d8-11e5-8a75-fdb585f6aa0b"
	});

$.imageGallery.views = [view1, view2, view3];
