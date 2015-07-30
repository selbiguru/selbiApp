args = arguments[0] || {};

var helpers = require('utilities/helpers'),
UserManager = require('managers/usermanager'),
fb = require('facebook'); 



function updateUser(e){
	// Todo: validation
	console.log("what is e:", e);
	var textFieldObject = {
		"username": $.username.value,
		"firstName": $.firstName.value,
		"lastName": $.lastName.value,
		"streetAddress": $.streetAddress.value,
		"city": $.city.value, 
		"zipCode": $.zipCode.value,
		"state": $.state.value
		};
	var validateFields = helpers.validateFields(textFieldObject);
	/*for (var i in textFieldObject) {
		if($.[i])
		$.removeClass($[i], "error");
		
	}*/
	if(validateFields != true){
		console.log("validateFields", validateFields);
		for (var i in validateFields) {
			$.addClass($[i], "error");
		}
		//Todo send back error message
	}
	return;
	/*UserManager.userUpdate(validateFields, function(err, userUpdateResult){
		if(userUpdateResult) {
			console.log("Successfully updated user");	
		}
	});	*/
};


<<<<<<< HEAD
// Don't forget to set your requested permissions, else the login button won't be effective.
var win = (Ti.Platform.name === 'android') ? Ti.UI.createWindow({backgroundColor: 'white'}) : null;

//check if already connected to facebook
if(fb.loggedIn)
{
	//if already connected then disconnect. 
	//currently we are not giving a user a way to logout
	//fb.logout();
	
	$.connectFacebook.title = 'Connected to Facebook';
    $.connectFacebook.touchEnabled = false;
    console.log('Inside the if statement: ' + $.connectFacebook.touchEnabled);
}

fb.addEventListener('login', function(e) {
    if (e.success) {
        console.log('login from uid: '+e.uid + 'teh whole object: ' + e);
        fb.loggedIn = true;
        $.connectFacebook.title = 'Connected to Facebook';
        $.connectFacebook.touchEnabled = false;
        console.log('Logged In = ' + fb.loggedIn);
    }
    else if (e.cancelled) {
        // user cancelled
        alert('cancelled');
    }
    else {
        alert(e.error);
    }
});

fb.addEventListener('logout', function(e) {
    alert('Logged out');
    console.log('Logged In = ' + fb.loggedIn);
    fb.loggedIn = false;
    $.connectFacebook.title = 'Connect to Facebook';
});

function connectToFaceBook(){
	console.log('entered connectToFacebook');
	if(fb.loggedIn)
	{
		//if already connected then disconnect. 
		//currently we are not giving a user a way to logout
		//fb.logout();
		$.connectFacebook.title = 'Connected to Facebook';
        $.connectFacebook.touchEnabled = false;
	}
	else
	{
		//For Android Platform. TODO test properly
		if (Ti.Platform.name === 'android') {
			console.log('entered createActivityWorker');
		    win.fbProxy = fb.createActivityWorker({lifecycleContainer: win});
		}
		else {		
			fb.permissions = ['email', 'publish_actions'];
			fb.initialize(1000);
			fb.authorize();
		}
	}
}

function connectToTwitter() {
	console.log('In connectToTwitter method.');
	
	//TODO move the values to config
	var twitter = Alloy.Globals.social.create({
    	consumerSecret: 'RY7mguhRKkl74HyrIlk5CGfWiUz7VXtftoM6jFGdJLm69BlZbC',
    	consumerKey: 'ezdL8s4bigBRCk5sHpXBINP9R'
	});
	
	if (twitter.isAuthorized())
	{
		$.connectTwitter.touchEnabled = false;
		$.connectTwitter.title = 'Connected to Twitter';
	}
	
	console.log('Check if authorized.' + twitter.isAuthorized());
	
	// Post a message
	// Setup both callbacks for confirmation
	// Note: share() automatically calls authorize() so an explicit call as above is unnecessary
	twitter.share({
	    message: "friends unite! " + Math.random().toString(),
	    success: function(e) {alert('Success!');},
	    error: function(e) {alert('Error!' + e);}
	});
	
	console.log('just shared : + ');
	
	if (twitter.isAuthorized()) {	
		$.connectTwitter.setText('Connected to Twitter');
        $.connectTwitter.touchEnabled = false;
        }
        
	//Do not Deauthorize the application
	//twitter.deauthorize();
	console.log('twitter.isAuthorized(): ' + twitter.isAuthorized());
}

=======
function getGoogleMaps(e){
	Alloy.Globals.openPage('addressgooglemap');
}
>>>>>>> 3a7739d857cd52ea4f057d9313327f1520dc3ff9
