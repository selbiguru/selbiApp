var args = arguments[0] || {};

function cancelForgotPassword(){
	var controller = Alloy.createController('login').getView();
	controller.right = 320;
	controller.open();
	controller.animate({
	    right:0,
	    duration:250
	}, function(){
	    //open controller
	});
}
