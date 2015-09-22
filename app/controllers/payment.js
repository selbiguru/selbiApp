/**
 * @class Payment
 * This class deals with user's payment and adding/editing new payment methods
 */
var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager'),
modalManager = require('managers/modalmanager');

function addNewCard(){
    paymentManager.getClientToken(function(err, response){
    	Ti.App.fireEvent('app:fromTitaniumPaymentGetTokenFromServer', { token: response });
		return;
	});
	Alloy.Globals.openPage('addCreditCard');
}
function addNewBank(){
	//Add new bank page to add routing number and account number.
	//Need to connect to Braintree if this option is selected
	//To create a merchant we need an address so we check to see if the user model has an address, 
	//otherwise we send back an alert
	/*var a = Titanium.UI.createAlertDialog({
        	title : 'Add Address'
    	});
	if (user.address) {
		Alloy.Globals.openPage('addBankAccount');
	} else {
		a.setMessage("You must first add an address under your profile!");
	    a.show();
		return;
	}*/
	Alloy.Globals.openPage('addBankAccount');
}
function addVenmo(){
	if(!Alloy.Globals.currentUser.attributes.dateOfBirth || Alloy.Globals.currentUser.attributes.dateOfBirth === null) {
		modalManager.getBirthdayModal(function(err,results){
			console.log("!!!!!!!!!", results);
			results.modalSaveButton.addEventListener('click', function() {
				var textFieldObject = {
					"id": Ti.App.Properties.getString('userId'), //Id of the user 
					"dateOfBirth": formatDate(results.datePicker.value)
				};
				var animateWindowClose = Titanium.UI.create2DMatrix();
			    animateWindowClose = animateWindowClose.scale(0);
			    function formatDate(d) {
				  date = new Date(d);
				  var dd = date.getDate(); 
				  var mm = date.getMonth()+1;
				  var yyyy = date.getFullYear(); 
				  if(dd<10){dd='0'+dd}; 
				  if(mm<10){mm='0'+mm};
				  return d = dd+'/'+mm+'/'+yyyy;
				}
			    Ti.API.info("User selected date: " + results.datePicker.value);
			    Ti.API.info("User pooping poop: " + results.datePicker.value.toLocaleString());
			    Ti.API.info("User beeep toooot: " + formatDate(results.datePicker.value));
			    //userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
			    	//results.modalWindow.close({transform:animateWindowClose, duration:300});
			    	//addVenmo();
			    	//return;
			    //});
			    	
			    results.modalWindow.close({transform:animateWindowClose, duration:300});
			});
		});
		
	} else {
		console.log("POOOOOOOOOOOP");
		//Alloy.Globals.openPage('birthdaymodal');
		//Selecting Venmo will not leave this page but instead send info to braintree
		//via this js file.  Then a checkmark will appear to show they selected this option.
		//Need to connect to Braintree if this option is selected.
		//If selected, Braintree uses phone number, which we will have,
		//to send funds to venmo when somone purchases from this vendor
		//To create a merchant we need an address so we check to see if the user model has an address, 
		//otherwise we send back an alert
		/*var a = Titanium.UI.createAlertDialog({
	        	title : 'Add Address'
	    	});
		if (user.address) {
			var merchantSubAccountParams = {
				individual: {
				    firstName: Alloy.Globals.currentUser.attributes.firstName,
				    lastName: Alloy.Globals.currentUser.attributes.lastName,
				    email: Alloy.Globals.currentUser.attributes.email,
				    phone: Alloy.Globals.currentUser.attributes.phoneNumber,
				    dateOfBirth: "1981-11-19",
				    address: {
				      streetAddress: Alloy.Globals.currentUser.attributes.userAddress.address,
				      locality: Alloy.Globals.currentUser.attributes.userAddress.city,
				      region: Alloy.Globals.currentUser.attributes.userAddress.state,
				      postalCode: Alloy.Globals.currentUser.attributes.userAddress.zip
				    }
	  		  	},
	  			funding: {
				    descriptor: "Selbi Sale",
				    destination: MerchantAccount.FundingDestination.mobile,
				    email: "Alloy.Globals.currentUser.attributes.email,
				    mobilePhone: Alloy.Globals.currentUser.attributes.phoneNumber
			  	},
			  	tosAccepted: true,
			  	masterMerchantAccountId: "14ladders_marketplace",
			  	id: Ti.App.Properties.getString('userId') //Id of the user
	  		};
	  		paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
				if(err) {
					
				} else {
					
				}
			});
	  		
		} else {
			a.setMessage("You must first complete your profile in the settings!");
		    a.show();
			return;
		}*/
		return;
	}
}

// Set the Venmo button image
$.imageAddVenmo.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.venmoWhite;


//parameters height, width, text createSliderButton(width,height,fontSize,text)

var sliderView = Ti.UI.createView({top:20,height:50,width:240,backgroundColor:'#F0F0F0',layout:'composite'});
var sliderButton = Ti.UI.createView({top:0,height:50,width:240,borderRadius:5,backgroundColor:'#D2D2D2',left:0});
var sliderText = Ti.UI.createLabel({text:'Slide to Save...',textAlign:'center',color:'#1BA7CD'});
$.paymentView.add(sliderView);
sliderView.add(sliderButton);
sliderView.add(sliderText);


sliderButton.addEventListener('touchmove', function(e){
	var moveX = e.x +sliderButton.animatedCenter.x - sliderButton.getWidth()/2;
	if (moveX + sliderButton.getWidth()/2 >= sliderView.getLeft() +sliderView.getWidth()) {
		//button rigth-edge stop
		moveX = sliderView.getLeft() + sliderView.getWidth() - (sliderButton.getWidth()/2);
	} else if (moveX - sliderButton.getWidth()/2 <= sliderView.getLeft()){
		//button left-edge stop
		moveX = sliderView.getLeft() + (sliderButton.getWidth()/2);
	}
	//sliderButton.animate({center:{x:240, y:0}, duration: 1});
	sliderButton.animate({center:{x:moveX, y:0}, duration: 500});
	sliderButton.setLeft(moveX);
});

sliderButton.addEventListener('touchend', function(e){
	var endX = sliderButton.animatedCenter.x + (sliderButton.getWidth()/2);
	if (endX > parseInt(sliderView.getWidth())+190) {
		//button released at right-edge stop
		newlockWindow.close();
	}
	//springback
	sliderButton.setLeft(0);
	sliderButton.animate({center:{x:(sliderView.getLeft()+sliderButton.getWidth()/2),y:0}, duration: 500});
});

paymentManager.getCustomerPaymentMethod(function(err, results){
	console.log("~~~~~~~~~~~~~~~~~~: ",results);
	if(results) {
		
	}
});