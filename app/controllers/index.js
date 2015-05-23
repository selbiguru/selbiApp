$.index.open();

function signIn(){

	var controller = Alloy.createController('login').getView();
	controller.left = 320;
	controller.open();
	controller.animate({
	    left:0,
	    duration:250
	}, function(){
	    //open controller
	});
}