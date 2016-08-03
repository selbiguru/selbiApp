var userManager = require('managers/usermanager');
var html2as = require('nl.fokkezb.html2as');


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
	        modalFont = 22;
	        pciFont = 12;
	        datePickerHeight = 145;
	        datePickerTop = 12;
	        saveButtonHeight = 40;
	        saveButtonFont = 16;
	    	datePickerWidth = 280;
	    	pciLabelTop = 15;
	        break;
	    case 1:
	        modalFont = 22;
	        pciFont = 12;
	        datePickerHeight = 165;
	        datePickerTop = 13;
	        saveButtonHeight = 40;
	        saveButtonFont = 16;
	    	datePickerWidth = 280;
	    	pciLabelTop = 17;
	        break;
	    case 2:
	        modalFont = 24;
	        pciFont = 14;
	        datePickerHeight = 180;
	        datePickerTop = 15;
	        saveButtonHeight = 45;
	        saveButtonFont = 18;
	    	datePickerWidth = 320;
	    	pciLabelTop = 20;
	        break;
	    case 3:
	        modalFont = 28;
	        pciFont = 15;
	        datePickerHeight = 220;
	        datePickerTop = 15;
	        saveButtonHeight = 50;
	        saveButtonFont = 20;
	    	datePickerWidth = 340;
	    	pciLabelTop = 20;
	        break;
	    case 4: //android currently same as iphoneSix
	        modalFont = 24;
	        pciFont = 14;
	        datePickerHeight = 180;
	        datePickerTop = 15;
	        saveButtonHeight = 45;
	        saveButtonFont = 18;
	    	datePickerWidth = 320;
	    	pciLabelTop = 20;
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
		top: datePickerTop,
		useSpinner:true,
		borderRadius: 3,
		zIndex: 20,
		visibleItems: 3,
		selectionIndicator: true,
		width: datePickerWidth,
		height: datePickerHeight,
		minDate:new Date(1920,10,10),
		maxDate:new Date(),
		value:new Date(2000,10,10),
		id: 'modalDatePicker'
	});
	modalSaveButton = Titanium.UI.createButton({
		height: saveButtonHeight,
	    top: datePickerTop,
	    width: datePickerWidth,
	    backgroundColor: '#EAEAEA',
		font: {
			fontSize: saveButtonFont,
			fontFamily: 'Nunito-Bold'
		},
		title: 'Save',
		color: "#8e8e8e",
		borderRadius: 4,
	});
	pciExplanationLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: datePickerWidth,
		top: pciLabelTop,
		bottom: '8dp',
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
	    case 0: //iPhoneFour
	    	textFieldFont = 22;
	    	modalHeaderFont = 22;
	    	modalBodyFont = 15;
	    	bodyLabelTop = 0;
	    	textFieldSquare = 8;
	    	squareViewTop = 6;
	    	verifyButtonFont = 16;
	    	verifyButtonHeight = 40;
	    	verifyButtonWidth = 280;
	    	verifyButtonTop = 11;
	    	resendButtonFont = 15; 
	    	disclaimerFont = 12;
	    	disclaimerLabelTop = 1;
	    	textFieldSize = 50;
	        break;
	    case 1: //iPhoneFive
	    	textFieldFont = 22;
	    	modalHeaderFont = 22;
	    	modalBodyFont = 15;
	    	bodyLabelTop = 0;
	    	textFieldSquare = 8;
	    	squareViewTop = 8;
	        verifyButtonFont = 16;
	        verifyButtonHeight = 40;
	        verifyButtonWidth = 280;
	        verifyButtonTop = 13;
	    	resendButtonFont = 15; 
	    	disclaimerFont = 12;
	    	disclaimerLabelTop = 3;
	    	textFieldSize = 50;
	        break;
	    case 2: //iPhoneSix
	    	textFieldFont = 24;
	    	modalHeaderFont = 24;
	    	modalBodyFont = 17;
	    	bodyLabelTop = 0;
	    	textFieldSquare = 8;
	    	squareViewTop = 12;
	        verifyButtonFont = 18;
	        verifyButtonHeight = 45;
	        verifyButtonWidth = 320;
	        verifyButtonTop = 15;
	    	resendButtonFont = 17; 
	    	disclaimerFont = 14;
	    	disclaimerLabelTop = 8;
	    	textFieldSize = 60;
	        break;
	    case 3: //iPhoneSixPlus
	    	textFieldFont = 28;
	    	modalHeaderFont = 28;
	    	modalBodyFont = 18;
	    	bodyLabelTop = 0;
	    	textFieldSquare = 8;
	    	squareViewTop = 15;
	        verifyButtonFont = 20;
	        verifyButtonHeight = 50;
	        verifyButtonWidth = 340;
	        verifyButtonTop = 20;
	    	resendButtonFont = 19; 
	    	disclaimerFont = 15;
	    	disclaimerLabelTop = 10;
	    	textFieldSize = 60;
	        break;
	    case 4: //android currently same as iphoneSix
	    	textFieldFont = 24;
	    	modalHeaderFont = 24;
	    	modalBodyFont = 17;
	    	bodyLabelTop = 0;
	    	textFieldSquare = 8;
	    	squareViewTop = 12;
	        verifyButtonFont = 18;
	        verifyButtonHeight = 45;
	        verifyButtonWidth = 320;
	        verifyButtonTop = 15;
	    	resendButtonFont = 17; 
	    	disclaimerFont = 14;
	    	disclaimerLabelTop = 8;
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
		width: verifyButtonWidth,
		font: {
			fontSize: modalBodyFont,
			fontFamily: 'Nunito-Light'
		},
		color: "#1BA7CD",
		top: bodyLabelTop,
	    text: "We've sent you a text.  Just enter the 4 digit code below and take full advantage of Selbi!"
	});
	verifyModalView = Titanium.UI.createView({
	    height: Ti.UI.SIZE,
		layout: 'horizontal',
		top: squareViewTop,
		width: Ti.UI.SIZE
	});
	for(i = 0; i < 4; i++) {
		modalTextField = Titanium.UI.createTextField({
			height: textFieldSize,
			width: textFieldSize,
			borderColor: "#EAEAEA",
			maxLength: "1",
			left: textFieldSquare,
			right: textFieldSquare,
			font: {
				fontSize: textFieldFont,
				fontFamily: 'Nunito-Bold'
			},
			keyboardType:  Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD,
			textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
			id: "codeField"+[i]
		});
		Alloy.Globals.addKeyboardToolbar(modalTextField, blurTextField);
		verifyModalView.add(modalTextField);
	};
	modalErrorLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		font: {
			fontSize: disclaimerFont,
			fontFamily: 'Nunito-Light'
		},
		color: "red",
		top: verifyButtonTop,
	    text: "Invalid Code"
	});
	modalErrorLabel.visible = false;
	modalErrorLabel.height = '0dp';
	modalVerifyButton = Titanium.UI.createButton({
		height: verifyButtonHeight,
	    top: verifyButtonTop,
	    width: verifyButtonWidth,
	    backgroundColor: '#EAEAEA',
		font: {
			fontSize: verifyButtonFont,
			fontFamily: 'Nunito-Bold'
		},
		title: 'Validate',
		color: "#8e8e8e",
		borderRadius: 4,
	});
	modalResendButton = Titanium.UI.createButton({
		height:Ti.UI.SIZE,
	    top: verifyButtonTop,
		font: {
			fontSize: resendButtonFont,
			fontFamily: 'Nunito-Light'
		},
		title: 'Resend Code',
		color: "#8e8e8e"
	});
	modalDisclaimerLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		width: verifyButtonWidth,
		font: {
			fontSize: disclaimerFont,
			fontFamily: 'Nunito-Light'
		},
		color: "#1BA7CD",
		bottom: '5dp',
		top: disclaimerLabelTop,
	    text: "*Selbi uses your phone number as an extra security layer for when you cash out your money."
	});
	infoModalView.add(modalHeaderLabel);
	infoModalView.add(modalBodyLabel);
	infoModalView.add(verifyModalView);
	infoModalView.add(modalErrorLabel);
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
		modalErrorLabel: modalErrorLabel,
		modalVerifyButton: modalVerifyButton,
		modalResendButton: modalResendButton,
		infoModalView: infoModalView,
		verifyModalView: verifyModalView,
		modalHeaderLabel: modalHeaderLabel,
		modalDisclaimerLabel: modalDisclaimerLabel
	};
	/**
	 * @private blurTextField 
	 * Blurs usernameSearch text field in accordance with expected UI
	 */
	function blurTextField(e) {
		for(var i = 0; i < verifyModalView.children.length; i++) {
			verifyModalView.children[i].blur();
		}
		return;
	};
	cb(null,verifyPhoneModalElements);
};













//Builds a filter modal.  This function takes one argument which is an array of search categories (['Other', 'Menswear']) and returns access to all elements created.
//This allows customization of the modalFilterButton to add a custom listener upon clicking the filter button.

var getFilterModal = exports.getFilterModal = function(selectedCatArray, cb) {
	var modalWindow,
		backgroundColorView,
		modalHeaderLabel,
		infoModalView,
		filterModalScrollView,
		filterSwitchView,
		twoColumnView,
		modalSwitchField,
		modalLabelField,
		modalFilterButton;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	    	modalHeaderFont = 22;
	    	filterButtonFont = 16;
	    	switchFieldSize = 50;
	    	scrollViewHeight = 265;
	    	scrollViewWidth = 300;
	    	infoModalWidth = "95%",
	    	twoColumnViewHeight = 45;
	    	modalLabelFont = 13;
	    	filterButtonHeight = 40;
	        break;
	    case 1: //iphoneFive
	    	modalHeaderFont = 22;
	    	filterButtonFont = 16;
	    	switchFieldSize = 50;
	    	scrollViewHeight = 265;
	    	scrollViewWidth = 300;
	    	infoModalWidth = "95%",
	    	twoColumnViewHeight = 45;
	    	modalLabelFont = 13;
	    	filterButtonHeight = 40;
	        break;
	    case 2: //iphoneSix
	    	modalHeaderFont = 24;
	    	filterButtonFont = 18;
	    	switchFieldSize = 60;
	    	scrollViewHeight = 300;
	    	scrollViewWidth = 320;
	    	infoModalWidth = "90%",
	    	twoColumnViewHeight = 50;
	    	modalLabelFont = 15;
	    	filterButtonHeight = 45;
	        break;
	    case 3: //iphoneSixPlus
	    	modalHeaderFont = 28;
	    	filterButtonFont = 20;
	    	switchFieldSize = 65;
	    	scrollViewHeight = 330;
	    	scrollViewWidth = 340;
	    	infoModalWidth = "90%",
	    	twoColumnViewHeight = 55;
	    	modalLabelFont = 17;
	    	filterButtonHeight = 50;
	        break;
	    case 4: //android currently same as iphoneSix
	    	modalHeaderFont = 24;
	    	filterButtonFont = 18;
	    	switchFieldSize = 60;
	    	scrollViewHeight = 300;
	    	scrollViewWidth = 320;
	    	infoModalWidth = "90%",
	    	twoColumnViewHeight = 50;
	    	modalLabelFont = 15;
	    	filterButtonHeight = 45;
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
	    id: "filterModalWindow"
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
	    width: infoModalWidth,
	    borderRadius: 4,
	    height: Ti.UI.SIZE,
	    opacity:1,
	    zIndex: 20,
	    layout:'vertical',
	    backgroundColor: '#FAFAFA'
	});
	modalHeaderLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		top: "5dp",
		font: {
			fontSize: modalHeaderFont,
			fontFamily: 'Nunito-Bold'
		},
		color: "#1BA7CD",
		text: "Filter for specific products!"
	});
	filterModalScrollView = Titanium.UI.createScrollView({
	    height: scrollViewHeight,
		layout: 'vertical',
		width: scrollViewWidth,
		showVerticalScrollIndicator: true
	});
	filterSwitchView = Titanium.UI.createView({
	    height: Ti.UI.FILL,
		layout: 'horizontal',
		width: scrollViewWidth
	});
	var departmentsArray = ['Electronics', 'Menswear', 'Womenswear', 'Sports & Outdoors', 'Music', 'Furniture', 'Jewelry', 'Games & Toys', 'Automotive', 'Baby & Kids', 'Appliances', 'Other'];
	for(i = 0; i < departmentsArray.length; i++) {
		twoColumnView = Titanium.UI.createView({
		    height: twoColumnViewHeight,
			layout: 'horizontal',
			width: (scrollViewWidth / 2)
		});
		modalSwitchField = Titanium.UI.createSwitch({
			height: switchFieldSize,
			width: Ti.UI.SIZE,
			value: selectedCatArray.indexOf(departmentsArray[i]) != -1 ? true : false,
			left: "6dp",
			id: departmentsArray[i]
		});
		modalLabelField = Titanium.UI.createLabel({
			height: switchFieldSize,
			width: Ti.UI.SIZE,
			text: departmentsArray[i],
			left: "5dp",
			font: {
				fontSize: modalLabelFont,
				fontFamily: 'Nunito-Light'
			},
			textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT
		});
		twoColumnView.add(modalSwitchField);
		twoColumnView.add(modalLabelField);
		filterSwitchView.add(twoColumnView);
	};
	modalFilterButton = Titanium.UI.createButton({
		height: filterButtonHeight,
	    top: '7dp',
	    bottom: '10dp',
	    width: scrollViewWidth,
	    backgroundColor: '#EAEAEA',
		font: {
			fontSize: filterButtonFont,
			fontFamily: 'Nunito-Bold'
		},
		title: 'Filter',
		color: "#8e8e8e",
		borderRadius: 4,
	});
	filterModalScrollView.add(filterSwitchView);
	infoModalView.add(modalHeaderLabel);
	infoModalView.add(filterModalScrollView);
	infoModalView.add(modalFilterButton);
	modalWindow.add(infoModalView);
	modalWindow.add(backgroundColorView);
	backgroundColorView.addEventListener('click', function() {
		var animateWindowClose = Titanium.UI.create2DMatrix();
	    animateWindowClose = animateWindowClose.scale(0);
	    modalWindow.close({transform:animateWindowClose, duration:300});
	});
	modalWindow.open(animateOpen);
	var filterModalElements = {
		modalWindow: modalWindow,
		backgroundColorView: backgroundColorView,
		infoModalView: infoModalView,
		modalHeaderLabel: modalHeaderLabel,
		filterModalScrollView: filterModalScrollView,
		filterSwitchView: filterSwitchView,
		twoColumnView: twoColumnView,
		modalSwitchField: modalSwitchField,
		modalLabelField: modalLabelField,
		modalFilterButton: modalFilterButton
	};
	cb(null,filterModalElements);
};













//Builds a welcome modal.  This function takes no arguments and returns access to all elements created.
//This allows customization of the modalWelcomeButton to add a custom listener upon clicking the Get Started button.

var getWelcomeModal = exports.getWelcomeModal = function(cb) {
	var modalWindow,
		backgroundColorView,
		modalHeaderLabel,
		infoModalView,
		welcomeModalScrollView,
		modalLabelField,
		modalWelcomeButton;
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	    	modalHeaderFont = 22;
	    	welcomeButtonFont = 16;
	    	scrollViewHeight = 265;
	    	scrollViewWidth = 280;
	    	modalLabelFont = 13;
	    	modalLabelBoldFont = 14;
	    	welcomeButtonHeight = 40;
	        break;
	    case 1: //iphoneFive
	    	modalHeaderFont = 22;
	    	welcomeButtonFont = 16;
	    	scrollViewHeight = 265;
	    	scrollViewWidth = 280;
	    	modalLabelFont = 14;
	    	modalLabelBoldFont = 15;
	    	welcomeButtonHeight = 40;
	        break;
	    case 2: //iphoneSix
	    	modalHeaderFont = 24;
	    	welcomeButtonFont = 18;
	    	scrollViewHeight = 300;
	    	scrollViewWidth = 320;
	    	modalLabelFont = 15;
	    	modalLabelBoldFont= 16;
	    	welcomeButtonHeight = 45;
	        break;
	    case 3: //iphoneSixPlus
	    	modalHeaderFont = 28;
	    	welcomeButtonFont = 20;
	    	scrollViewHeight = 330;
	    	scrollViewWidth = 340;
	    	modalLabelFont = 17;
	    	modalLabelBoldFont = 18;
	    	welcomeButtonHeight = 50;
	        break;
	    case 4: //android currently same as iphoneSix
	    	modalHeaderFont = 24;
	    	welcomeButtonFont = 18;
	    	scrollViewHeight = 300;
	    	scrollViewWidth = 320;
	    	modalLabelFont = 15;
	    	modalLabelBoldFont = 16;
	    	welcomeButtonHeight = 45;
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
	    id: "filterModalWindow"
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
	    borderRadius: 4,
	    height: Ti.UI.SIZE,
	    opacity:1,
	    zIndex: 20,
	    layout:'vertical',
	    backgroundColor: '#FAFAFA'
	});
	modalHeaderLabel = Titanium.UI.createLabel({
		height: Ti.UI.SIZE,
		top: "5dp",
		font: {
			fontSize: modalHeaderFont,
			fontFamily: 'Nunito-Bold'
		},
		color: "#1BA7CD",
		text: "Welcome To Selbi!"
	});
	welcomeModalScrollView = Titanium.UI.createScrollView({
	    height: scrollViewHeight,
		layout: 'vertical',
		width: scrollViewWidth,
		showVerticalScrollIndicator: true,
		top: '5dp'
	});
	html2as(
	    '<font face="Nunito-Light" size="'+modalLabelFont+'">Welcome to the Selbi family! We are the premier friend to friend marketplace, where you have fun buying and selling in your own trusted network of friends. Being able to buy and sell on Selbi is one of the simplest things you\’ll ever do! Here is a quick guide to get started.</font><font size="'+modalLabelBoldFont+'" face="Nunito-Bold"><br><br>Username:</font><font face="Nunito-Light" size="'+modalLabelFont+'"> Under Edit Profile in settings you can update the randomly generated username given to you.  Usernames are how friends will be able to search for you and must be 7 characters long.</font><font size="'+modalLabelBoldFont+'" face="Nunito-Bold"><br><br>Address:</font><font face="Nunito-Light" size="'+modalLabelFont+'">  Sellers need to send you your items!  This is a breeze to fill out and is located in the same place as your username.</font><font size="'+modalLabelBoldFont+'" face="Nunito-Bold"><br><br>Payment:</font><font face="Nunito-Light" size="'+modalLabelFont+'">  Of course you\'ll want to buy and sell things, that\'s why you\'re on Selbi!  So first you\’ll have to add a Credit Card (to Buy things) and/or Bank info (to Sell things), but don\’t worry, we don\’t store any of your data on our database so it\’s safe and easy to do!<br><br>And that\’s it!  Super simple!  Now you\’re ready to buy and sell to your heart\’s content.</font>',
	    function(err, strings) {
	        if (err) {
	        	
	        } else {
	            modalLabelField = Titanium.UI.createLabel({
					width: Ti.UI.SIZE,
					attributedString: strings,
					textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				});
	        }
	    }
	);
	modalWelcomeButton = Titanium.UI.createButton({
		height: welcomeButtonHeight,
	    top: '8dp',
	    bottom: '10dp',
	    width: scrollViewWidth,
	    backgroundColor: '#EAEAEA',
		font: {
			fontSize: welcomeButtonFont,
			fontFamily: 'Nunito-Bold'
		},
		title: 'Get Started Now!',
		color: "#8e8e8e",
		borderRadius: 4,
	});
	welcomeModalScrollView.add(modalLabelField);
	infoModalView.add(modalHeaderLabel);
	infoModalView.add(welcomeModalScrollView);
	infoModalView.add(modalWelcomeButton);
	modalWindow.add(infoModalView);
	modalWindow.add(backgroundColorView);
	backgroundColorView.addEventListener('click', function() {
		var animateWindowClose = Titanium.UI.create2DMatrix();
	    animateWindowClose = animateWindowClose.scale(0);
	    modalWindow.close({transform:animateWindowClose, duration:300});
	});
	modalWindow.open(animateOpen);
	var filterModalElements = {
		modalWindow: modalWindow,
		backgroundColorView: backgroundColorView,
		infoModalView: infoModalView,
		modalHeaderLabel: modalHeaderLabel,
		welcomeModalScrollView: welcomeModalScrollView,
		modalLabelField: modalLabelField,
		modalWelcomeButton: modalWelcomeButton
	};
	cb(null,filterModalElements);
};