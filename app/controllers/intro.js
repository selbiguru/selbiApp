var args = arguments[0] || {};

var introImages = Alloy.CFG.imageSize.intro;
var data = [];
for(var i = 0; i < introImages.length; i++){
	data.push({
		image: Alloy.CFG.cloudinary.baseImagePath  + introImages[i],
		text : 'Move along people, nothing to see here.'
	});
} 

$.intro.init(data);
$.intro.container.open();

$.intro.description.addEventListener('scrollend', function(e){	
	if(e.currentPage === 2) {
		setTimeout(function(){
			$.intro.container.close();	
		},2000);		
	}
});
