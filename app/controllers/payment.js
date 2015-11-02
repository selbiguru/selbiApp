/**
 * @class Payment
 * This class deals with user's payment and adding/editing new payment methods
 */
var args = arguments[0] || {};

var helpers = require('utilities/helpers'),
paymentManager = require('managers/paymentmanager'),
modalManager = require('managers/modalmanager');
twilioManager = require('managers/twiliomanager');
userManager = require('managers/usermanager');



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
	if(!Alloy.Globals.currentUser.attributes.dateOfBirth || Alloy.Globals.currentUser.attributes.dateOfBirth === null) {
		modalManager.getBirthdayModal(function(err,results){
			results.modalSaveButton.addEventListener('click', function() {
				var textFieldObject = {
					"id": Ti.App.Properties.getString('userId'), //Id of the user 
					"dateOfBirth": results.datePicker.value.toISOString()
				};
				var animateWindowClose = Titanium.UI.create2DMatrix();
			    animateWindowClose = animateWindowClose.scale(0);
			    userManager.userUpdate(textFieldObject, function(err, userUpdateResult){
			    	results.modalWindow.close({transform:animateWindowClose, duration:300});
			    	//sendVenmoBraintree();
			    	return;
			    });
			    	
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
	var a = Titanium.UI.createAlertDialog({
        	title : 'Add Address'
    	});
	if (Alloy.Globals.currentUser.attributes.address) {
		var merchantSubAccountParams = {
			individual: {
			    firstName: Alloy.Globals.currentUser.attributes.firstName,
			    lastName: Alloy.Globals.currentUser.attributes.lastName,
			    email: Alloy.Globals.currentUser.attributes.email,
			    phone: Alloy.Globals.currentUser.attributes.phoneNumber,
			    dateOfBirth: Alloy.Globals.currentUser.attributes.dateOfBirth,
			    address: {
			      streetAddress: Alloy.Globals.currentUser.attributes.userAddress.address,
			      locality: Alloy.Globals.currentUser.attributes.userAddress.city,
			      region: Alloy.Globals.currentUser.attributes.userAddress.state,
			      postalCode: Alloy.Globals.currentUser.attributes.userAddress.zip
			    }
  		  	},
  			funding: {
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
		a.setMessage("You must complete your profile and address in the settings before connecting an account!");
	    a.show();
		return;
	}
}

// Set the Venmo button image
$.imageAddVenmo.image = Alloy.CFG.cloudinary.baseImagePath + Alloy.CFG.imageSize.venmoWhite;


/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/
 
 /**
 * @private showUserCard 
 *  Dynamically creates XML elements to show the card that a user has entered on Selbi.
 */
 function showUserCard(cardInfo) {
 	//$.viewAddCard.hide();
 	//$.viewAddCard.height = '0dp';
 	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        labelFont = 14;
	        labelHeight = '35dp';
	        break;
	    case 1: //iphoneFive
	        labelFont = 16;
	        labelHeight = '40dp';
	        break;
	    case 2: //iphoneSix
	        labelFont = 18;
	        labelHeight = '45dp';
	        break;
	    case 3: //iphoneSixPlus
	        labelFont = 20;
	        labelHeight = '50dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        labelFont = 18;
	        labelHeight = '45dp';
	        break;
	};
 	var viewUserCard = Titanium.UI.createView({
 		layout: 'horizontal',
 		height: labelHeight,
		borderWidth: "1dp",
		borderColor: "#EAEAEA",
 	});
 	var userCardHeader = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "5dp",
		height: labelHeight,
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
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: 'XXXX '+ cardInfo.lastFour
 	});
 	var userCardExp = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "15dp",
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: cardInfo.expirationDate
 	});
 	var checkedCardIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		left: "10dp",
		width: Titanium.UI.SIZE,
		color: "#1BA7CD"
 	});
 	var deleteCardIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		right: "15dp",
		width: Titanium.UI.FILL,
		color: "#c10404"
 	});
 	$.fa.add(checkedCardIcon, "fa-check");
 	viewUserCard.add(checkedCardIcon);
 	viewUserCard.add(userCardHeader);
 	viewUserCard.add(userCardNumber);
 	viewUserCard.add(userCardExp);
 	$.fa.add(deleteCardIcon, "fa-times");
 	viewUserCard.add(deleteCardIcon);
 	$.paymentDetails.add(viewUserCard);
 	deleteCardIcon.addEventListener('click', function() {
 		//delete credit card from braintree and our db
 		console.log("im inside this%%%%");
 		var deleteCardAlert = Titanium.UI.createAlertDialog({
	        	title : 'Delete Card',
	        	buttonNames: ['Confirm', 'Cancel'],
	        	confirm: 0
	    }); 
	    deleteCardAlert.setMessage("Are you sure you want to delete this card?  You'll have to add another card to be able to purchase items on Selbi!" );
 		deleteCardAlert.addEventListener('click', function(e){
		    if (e.index === e.source.confirm){
			//add delete card logic here!!!!
				Ti.API.info('The confirm button was clicked');
				//$.viewAddCard.show();
 				//$.viewAddCard.height = '40dp';
 				paymentManager.deletePayment(function(err, response){
					if(err){
						console.log("made and error somewhere!", err);
					} else {
						console.log("made a response while deleting!", response);						
					}
					return;				
 				});
			}
		});
 		deleteCardAlert.show();
 		return;
 	});
 };




/**
 * @private showUserBank 
 *  Dynamically creates XML elements to show the bank that a user has entered on Selbi.
 */
function showUserBank(bankInfo) {
	//$.viewAddBank.hide();
	//$.viewAddBank.height = '0dp';
 	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        labelFont = 14;
	        labelHeight = '35dp';
	        break;
	    case 1: //iphoneFive
	        labelFont = 16;
	        labelHeight = '40dp';
	        break;
	    case 2: //iphoneSix
	        labelFont = 18;
	        labelHeight = '45dp';
	        break;
	    case 3: //iphoneSixPlus
	        labelFont = 20;
	        labelHeight = '50dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        labelFont = 18;
	        labelHeight = '45dp';
	        break;
	};
 	var viewUserBank = Titanium.UI.createView({
 		//backgroundColor: "blue",
 		layout: 'horizontal',
 		height: labelHeight,
		borderWidth: "1dp",
		borderColor: "#EAEAEA",
 	});
 	var userBankHeader = Titanium.UI.createLabel({
 		//borderColor: "red",
 		left: "5dp",
		height: labelHeight,
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
		height: labelHeight,
		font:{
			fontSize: labelFont,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#545555",
		text: "XXXX "+ bankInfo.accountNumberLast4
 	});
 	var checkedBankIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		left: "10dp",
		width: Titanium.UI.SIZE,
		color: "#1BA7CD"
 	});
 	var deleteBankIcon = Titanium.UI.createLabel({
 		//borderColor: "red",
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		right: "15dp",
		width: Titanium.UI.FILL,
		color: "#c10404"
 	});
 	$.fa.add(checkedBankIcon, "fa-check");
 	viewUserBank.add(checkedBankIcon);
 	viewUserBank.add(userBankHeader);
 	viewUserBank.add(userBankNumber);
 	$.fa.add(deleteBankIcon, "fa-times");
 	viewUserBank.add(deleteBankIcon);
 	$.bankingDetails.add(viewUserBank);
 	deleteBankIcon.addEventListener('click', function() {
 		//delete bank account from braintree and our db
 		var deleteBankAlert = Titanium.UI.createAlertDialog({
	        	title : 'Delete Bank Account',
	        	buttonNames: ['Confirm', 'Cancel'],
	        	confirm: 0
	    }); 
	    deleteBankAlert.setMessage("Are you sure you want to delete this bank account?  You'll have to add another account/Venmo to be able to cash out!" );
 		deleteBankAlert.addEventListener('click', function(e){
		    if (e.index === e.source.confirm){
			//add delete logic here!!!!
			//paymentManager.deletePayment();
				Ti.API.info('The confirm button was clicked');
			}
		});
 		deleteBankAlert.show();
 		return;
 	});
 };




/**
 * @method getPaymentMethods 
 *  On page load, dynamically loads the user's payment methods and calls correlating function to dynamically create XML.
 */
paymentManager.getPaymentMethods(function(err, results){
	console.log("~~~~~~~~~~~~~~~~~~: ", results);
	if(results.userPaymentMethod.lastFour) {
		console.log("WEEEEE");
		showUserCard(results.userPaymentMethod);
	}
	if(results.userMerchant.accountNumberLast4) {
		console.log("STOOOOOOOOP");
		showUserBank(results.userMerchant);
	}
});