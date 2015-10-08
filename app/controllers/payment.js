/**
 * @class Payment
 * This class deals with user's payment and adding/editing new payment methods
 */
var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager'),
modalManager = require('managers/modalmanager');
twilioManager = require('managers/twiliomanager');



/**
 * @method addNewCard 
 * Opens addCreditCard view so users can enter in bank account information.
 * If error occurs fetching clientToken, alert modal shows and addCreditCard view is closed automatically.
 */
function addNewCard(){
	Alloy.Globals.openPage('addCreditCard');
    paymentManager.getClientToken(function(err, response){
    	if(err){
    		var dialogError = Titanium.UI.createAlertDialog({
	        	title : 'Page unable to load!'
	    	}); 
	    	dialogError.setMessage("Please try again! If the problem persists please contact us.");
		    dialogError.show();
		    Alloy.Globals.closePage('addCreditCard');
			return;
    	} else {
	    	Ti.App.fireEvent('app:fromTitaniumPaymentGetTokenFromServer', { token: response });
			return;
		}
	});
}

/**
 * @method addNewBank 
 * Opens addBankAccount view so users can enter in bank account information.
 */
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

/**
 * @method addVenmo 
 * Opens Birthday modal if user has not yet entered their birthday
 * Braintree requires birthday when creating a subMerchant Account
 */
function addVenmo(){
	console.log("HAPPY BIRTHDAY!!!!", !Alloy.Globals.currentUser.attributes.dateOfBirth);
	console.log("giraffe giraffe ", Alloy.Globals.currentUser.attributes.dateOfBirth);
	console.log("bears bears bears bears ", Alloy.Globals.currentUser.attributes);
	console.log("LOLOLOLOLOLOLOLOOLOLOLOL", Alloy.Globals.currentUser.attributes.dateOfBirth === null);
	if(!Alloy.Globals.currentUser.attributes.dateOfBirth || Alloy.Globals.currentUser.attributes.dateOfBirth === null) {
		modalManager.getBirthdayModal(function(err,results){
			console.log("!!!!!!!!!", results);
			results.modalSaveButton.addEventListener('click', function() {
				var textFieldObject = {
					"id": Ti.App.Properties.getString('userId'), //Id of the user 
					"dateOfBirth": results.datePicker.value.toISOString()
				};
				var animateWindowClose = Titanium.UI.create2DMatrix();
			    animateWindowClose = animateWindowClose.scale(0);
			    //userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
			    	//results.modalWindow.close({transform:animateWindowClose, duration:300});
			    	//sendVenmoBraintree();
			    	//return;
			    //});
			    	
			    results.modalWindow.close({transform:animateWindowClose, duration:300});
			});
		});
		
	} else {
		console.log("POOOOOOOOOOOP");
		//sendVenmoBraintree();
		return;
	}
}

/**
 * @private sendVenmoBraintree 
 * Determines if your address is complete on your profile page and if so, creates a subMerchant account with Venmo so you can cash out.
 */
function sendVenmoBraintree(){
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
		if (Alloy.Globals.currentUser.attributes.address) {
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
				    email: "Alloy.Globals.currentUser.attributes.email,
				    mobilePhone: Alloy.Globals.currentUser.attributes.phoneNumber
			  	},
			  	tosAccepted: true,
			  	id: Ti.App.Properties.getString('userId'), //Id of the user
			  	venmo: true
	  		};
	  		paymentManager.createSubMerchant(merchantSubAccountParams, function(err, responseObj) {
				if(err) {
					
				} else {
					
				}
			});
	  		
		} else {
			a.setMessage("You must first complete your profile and address in the settings before continuing!");
		    a.show();
			return;
		}*/
}

// Set the Venmo button image
$.imageAddVenmo.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.venmoWhite;


/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/
 
 /**
 * @private showUserCard 
 *  Dynamically creates XML elements to show the card that a user has entered on Selbi.
 */
 function showUserCard() {
 	switch(Alloy.Globals.userDevice) {
	    case 0:
	        labelFont = 14;
	        break;
	    case 1:
	        labelFont = 15;
	        break;
	    case 2:
	        labelFont = 16;
	        break;
	    case 3:
	        labelFont = 18;
	        break;
	    case 4: //android currently same as iphoneSix
	        labelFont = 16;
	        break;
	};
 	var viewUserCard = Titanium.UI.createView({
 		layout: 'horizontal',
 		height: '40dp',
		borderWidth: "1dp",
		borderColor: "#EAEAEA",
 	});
 	var userCardHeader = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: "40dp",
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "Card Ending:"
 	});
 	var userCardNumber = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: "40dp",
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "XXXX80"
 	});
 	var userCardExp = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: "40dp",
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "10/17"
 	});
 	var deleteCardIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		right: "15dp",
		width: Titanium.UI.FILL,
		color: "#1BA7CD"
 	});
 	viewUserCard.add(userCardHeader);
 	viewUserCard.add(userCardNumber);
 	viewUserCard.add(userCardExp);
 	$.fa.add(deleteCardIcon, "fa-times");
 	viewUserCard.add(deleteCardIcon);
 	$.paymentDetails.add(viewUserCard);
 	deleteCardIcon.addEventListener('click', function() {
 		//delete credit card from braintree and our db
 		return;
 	});
 };
//showUserCard();




/**
 * @private showUserBank 
 *  Dynamically creates XML elements to show the bank that a user has entered on Selbi.
 */
function showUserBank() {
 	switch(Alloy.Globals.userDevice) {
	    case 0:
	        labelFont = 14;
	        break;
	    case 1:
	        labelFont = 15;
	        break;
	    case 2:
	        labelFont = 16;
	        break;
	    case 3:
	        labelFont = 18;
	        break;
	    case 4: //android currently same as iphoneSix
	        labelFont = 16;
	        break;
	};
 	var viewUserBank = Titanium.UI.createView({
 		//backgroundColor: "blue",
 		layout: 'horizontal',
 		height: '40dp',
		borderWidth: "1dp",
		borderColor: "#EAEAEA",
 	});
 	var userBankHeader = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: "40dp",
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "Account Ending:"
 	});
 	var userBankNumber = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: "40dp",
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "XXXX80"
 	});
 	var deleteBankIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		right: "15dp",
		width: Titanium.UI.FILL,
		color: "#1BA7CD"
 	});
 	viewUserBank.add(userBankHeader);
 	viewUserBank.add(userBankNumber);
 	$.fa.add(deleteBankIcon, "fa-times");
 	viewUserBank.add(deleteBankIcon);
 	$.bankingDetails.add(viewUserBank);
 	deleteBankIcon.addEventListener('click', function() {
 		//delete bank account from braintree and our db
 		return;
 	});
 };
//showUserBank();









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
		/*var randomNumber = Math.floor(Math.random() * 8999 + 1000).toString().substring(0,4);
		twilioManager.sendSMSPhone('+15157794218',randomNumber, function(err, response){
			if(err){
				console.log('err form phone verify', err);
			} else {
				console.log('response form phone', response);*/
				Alloy.Globals.openPage('phoneVerify', {code:'7890'});
			/*}
		});*/
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