var userManager = require('managers/usermanager');


/*********************************************  DOB MODAL *****************************************************/


//Builds a Date of Birth modal.  This function takes no arguments and returns access to all elements created.
//This allows customization of the modalSaveButton to add a custom listener upon clicking the save button. 
var getBirthdayModal = exports.getBirthdayModal = function(cb) {
	var modalWindow,
		backgroundColorView,
		datePicker,
		modalSaveButton,
		pciExplanationLabel,
		infoModalView,
		modalHeaderLabel,
		modalFont,
		pciFont;	
	switch(Alloy.Globals.userDevice) {
	    case 0:
	        modalFont = 18;
	        pciFont = 10;
	        break;
	    case 1:
	        modalFont = 18;
	        pciFont = 10;
	        break;
	    case 2:
	        modalFont = 18;
	        pciFont = 12;
	        break;
	    case 3:
	        modalFont = 20;
	        pciFont = 12;
	        break;
	    case 4: //android currently same as iphoneSix
	        modalFont = 18;
	        pciFont = 12;
	        break;
	};
	var transformModalOpen = Titanium.UI.create2DMatrix();
    transformModalOpen = transformModalOpen.scale(0);
	modalWindow = Titanium.UI.createWindow({
	    backgroundColor:'transparent',
	    height:"100%",
	    width:"100%",
	    opacity:1,
	    transform: transformModalOpen,
	    id: "DOBModalWindow"
	});
	// create first transform to go beyond normal size
    var transformModalOpen1 = Titanium.UI.create2DMatrix();
    transformModalOpen1 = transformModalOpen1.scale(1.1);
    var animateOpen = Titanium.UI.createAnimation();
    animateOpen.transform = transformModalOpen1;
    animateOpen.duration = 300;
 
    // when this animation completes, scale to normal size
    animateOpen.addEventListener('complete', function() {
        var transformModalOpen2 = Titanium.UI.create2DMatrix();
        transformModalOpen2 = transformModalOpen2.scale(1.0);
        modalWindow.animate({transform:transformModalOpen2, duration:200});
 
    });
	backgroundColorView = Titanium.UI.createView({
	    backgroundColor:'black',
	    height:"100%",
	    width:"100%",
	    opacity:0.3,
	    layout:'vertical'
	});
	infoModalView = Titanium.UI.createView({
	    width:"90%",
	    borderRadius: 3,
	    height: Ti.UI.SIZE,
	    opacity:1,
	    zIndex: 20,
	    layout:'vertical',
	    backgroundColor: '#FAFAFA'
	});
	modalHeaderLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		top: "8dp",
		font: {
			fontSize: modalFont,
			fontFamily: "Nunito-Bold"
		},
		color: '#1BA7CD',
	    text: "Please enter your DOB:"
	});
	datePicker = Titanium.UI.createPicker({
		type:Ti.UI.PICKER_TYPE_DATE,
		top: "20dp",
		useSpinner:true,
		borderRadius: 3,
		zIndex: 20,
		visibleItems: 3,
		selectionIndicator: true,
		width: "90%",
		minDate:new Date(1920,15,10),
		maxDate:new Date(),
		value:new Date(2005,15,10),
		id: 'modalDatePicker'
	});
	modalSaveButton = Titanium.UI.createButton({
		height:Ti.UI.SIZE,
	    width:Ti.UI.SIZE,
	    top:"8dp",
	    zIndex: 20,
	    font: {
			fontSize: modalFont,
			fontFamily: "Nunito-Bold"
		},
	    title: 'Save',
	    color: '#1BA7CD',
	    id: 'modalBirthdaySave'
	});
	pciExplanationLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: "90%",
		top: "8dp",
		font: {
			fontSize: pciFont,
			fontFamily: "Nunito-light"
		},
		color: '#1BA7CD',
	    text: "*Selbi is PCI compliant and thus requires your DOB when entering your banking information."
	});
	infoModalView.add(modalHeaderLabel);
	infoModalView.add(datePicker);
	infoModalView.add(modalSaveButton);
	infoModalView.add(pciExplanationLabel);
	modalWindow.add(infoModalView);
	modalWindow.add(backgroundColorView);
	backgroundColorView.addEventListener('click', function() {
		var animateWindowClose = Titanium.UI.create2DMatrix();
	    animateWindowClose = animateWindowClose.scale(0);
	    modalWindow.close({transform:animateWindowClose, duration:300});
	});
	modalWindow.open(animateOpen);
	var birthdayModalElements = {
		modalWindow: modalWindow,
		backgroundColorView: backgroundColorView,
		datePicker: datePicker,
		modalSaveButton: modalSaveButton,
		pciExplanationLabel: pciExplanationLabel,
		infoModalView: infoModalView,
		modalHeaderLabel: modalHeaderLabel
	};
	cb(null, birthdayModalElements);
};











//Builds a Verify Phone modal on sign-in.  This function takes no arguments and returns access to all elements created.
//This allows customization of the modalVerifyButton to add a custom listener upon clicking the save button.

var getVerifyPhoneModal = exports.getVerifyPhoneModal = function(cb) {
	var modalWindow,
		backgroundColorView,
		modalBodyLabel,
		modalVerifyButton,
		modalResendButton,
		infoModalView,
		verifyModalView,
		modalTextField,
		modalDisclaimerLabel,
		modalHeaderLabel;
	switch(Alloy.Globals.userDevice) {
	    case 0:
	    	textFieldFont = 20;
	    	modalHeaderFont = 16;
	    	modalBodyFont = 12;
	    	verifyButtonFont = 12;
	    	resendButtonFont = 10; 
	    	disclaimerFont = 10;
	    	textFieldSize = 50;
	        break;
	    case 1:
	    	textFieldFont = 20;
	    	modalHeaderFont = 16;
	    	modalBodyFont = 12;
	        verifyButtonFont = 12;
	    	resendButtonFont = 10; 
	    	disclaimerFont = 10;
	    	textFieldSize = 50;
	        break;
	    case 2:
	    	textFieldFont = 22;
	    	modalHeaderFont = 18;
	    	modalBodyFont = 15;
	        verifyButtonFont = 15;
	    	resendButtonFont = 12; 
	    	disclaimerFont = 12;
	    	textFieldSize = 60;
	        break;
	    case 3:
	    	textFieldFont = 22;
	    	modalHeaderFont = 20;
	    	modalBodyFont = 16;
	        verifyButtonFont = 16;
	    	resendButtonFont = 12; 
	    	disclaimerFont = 12;
	    	textFieldSize = 60;
	        break;
	    case 4: //android currently same as iphoneSix
	    	textFieldFont = 22;
	    	modalHeaderFont = 18;
	    	modalBodyFont = 15;
	        verifyButtonFont = 15;
	    	resendButtonFont = 12; 
	    	disclaimerFont = 12;
	    	textFieldSize = 60;
	        break;
	};
	var transformModalOpen = Titanium.UI.create2DMatrix();
    transformModalOpen = transformModalOpen.scale(0);
	modalWindow = Titanium.UI.createWindow({
	    backgroundColor:'transparent',
	    height:"100%",
	    width:"100%",
	    opacity:1,
	    transform: transformModalOpen,
	    id: "phoneModalWindow"
	});
	// create first transform to go beyond normal size
    var transformModalOpen1 = Titanium.UI.create2DMatrix();
    transformModalOpen1 = transformModalOpen1.scale(1.1);
    var animateOpen = Titanium.UI.createAnimation();
    animateOpen.transform = transformModalOpen1;
    animateOpen.duration = 300;
 
    // when this animation completes, scale to normal size
    animateOpen.addEventListener('complete', function() {
        var transformModalOpen2 = Titanium.UI.create2DMatrix();
        transformModalOpen2 = transformModalOpen2.scale(1.0);
        modalWindow.animate({transform:transformModalOpen2, duration:200});
 
    });
	backgroundColorView = Titanium.UI.createView({
	    backgroundColor:'black',
	    height:"100%",
	    width:"100%",
	    opacity:0.4,
	    layout:'vertical'
	});
	infoModalView = Titanium.UI.createView({
	    width:"90%",
	    borderRadius: 3,
	    height: Ti.UI.SIZE,
	    opacity:1,
	    zIndex: 20,
	    layout:'vertical',
	    backgroundColor: '#FAFAFA'
	});
	modalHeaderLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		//width: Ti.UI.SIZE,
		top: "5dp",
		font: {
			fontSize: modalHeaderFont,
			fontFamily: 'Nunito-Bold'
		},
		color: "#1BA7CD",
		text: "Enter Code Below!"
	});
	modalBodyLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: "90%",
		font: {
			fontSize: modalBodyFont,
			fontFamily: 'Nunito-Light'
		},
		color: "#1BA7CD",
		top: '10dp',
	    text: "We've sent you a text!  Just enter the 4 digit code below and take full advantage of Selbi!"
	});
	verifyModalView = Titanium.UI.createView({
	    height: Ti.UI.SIZE,
		layout: 'horizontal',
		top: '15dp',
		width: Ti.UI.SIZE
	});
	for(i = 0; i < 4; i++) {
		modalTextField = Titanium.UI.createTextField({
			height: textFieldSize,
			width: textFieldSize,
			borderColor: "#EAEAEA",
			maxLength: "1",
			left: "6dp",
			right: '6dp',
			font: {
				fontSize: textFieldFont,
				fontFamily: 'Nunito-Bold'
			},
			textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
			id: "codeField"+[i]
		});
		verifyModalView.add(modalTextField);
	};
	modalVerifyButton = Titanium.UI.createButton({
		height:Ti.UI.SIZE,
	    top: '10dp',
	    font: {
				fontSize: verifyButtonFont,
				fontFamily: 'Nunito-Light'
		},
		title: 'Validate'
	});
	modalResendButton = Titanium.UI.createButton({
		height:Ti.UI.SIZE,
	    top: '7dp',
		font: {
			fontSize: resendButtonFont,
			fontFamily: 'Nunito-Light'
		},
		title: 'Resend Code'
	});
	modalDisclaimerLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: "90%",
		font: {
			fontSize: disclaimerFont,
			fontFamily: 'Nunito-Light'
		},
		color: "#1BA7CD",
		bottom: '5dp',
		top: "5dp",
	    text: "*Selbi uses your phone number as an extra security layer for when you cash out your money."
	});
	infoModalView.add(modalHeaderLabel);
	infoModalView.add(modalBodyLabel);
	infoModalView.add(verifyModalView);
	infoModalView.add(modalVerifyButton);
	infoModalView.add(modalResendButton);
	infoModalView.add(modalDisclaimerLabel);
	modalWindow.add(infoModalView);
	modalWindow.add(backgroundColorView);
	backgroundColorView.addEventListener('click', function() {
		var animateWindowClose = Titanium.UI.create2DMatrix();
	    animateWindowClose = animateWindowClose.scale(0);
	    modalWindow.close({transform:animateWindowClose, duration:300});
	});
	modalWindow.open(animateOpen);
	var verifyPhoneModalElements = {
		modalWindow: modalWindow,
		backgroundColorView: backgroundColorView,
		modalBodyLabel: modalBodyLabel,
		modalVerifyButton: modalVerifyButton,
		modalResendButton: modalResendButton,
		infoModalView: infoModalView,
		verifyModalView: verifyModalView,
		modalHeaderLabel: modalHeaderLabel,
		modalDisclaimerLabel: modalDisclaimerLabel
	};
	cb(null,verifyPhoneModalElements);
};