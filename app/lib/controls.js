var Alloy=require('alloy');

exports.getMainView=function(){
	return Alloy.createController('mainview');
};

exports.getMenuView=function(){
	return Alloy.createController('menuview');	
};

/*exports.getMenuButton=function(args){
	var v=Ti.UI.createView({
		height: args.h,
		width: args.w,
		backgroundColor: '#FAFAFA'
	});
	
	var b=Ti.UI.createView({
		height: "20dp",
		width: "20dp"
	});
	
	v.add(b);
	console.log("Menu button = " + v);
	return v;
};*/

//Get the Controllers
exports.getCustomView = function(viewName){
	return Alloy.createController(viewName);
};
