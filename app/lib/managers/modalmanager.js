var userManager = require('managers/usermanager');


/*********************************************  DOB MODAL *****************************************************/
var getBirthdayModal = exports.getBirthdayModal = function() {
	var modalFont;	
	var phones = Alloy.Globals.iPhoneFour ? 0 : Alloy.Globals.iPhoneFive ? 1 : Alloy.Globals.iPhoneSix ? 2 : Alloy.Globals.iPhoneSixPlus ? 3 : Alloy.Globals.android ? 4 : false;
	switch(phones) {
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
	console.log("!!@!@!@!@!@!@ :", modalFont);
	var transformModalOpen = Titanium.UI.create2DMatrix();
    transformModalOpen = transformModalOpen.scale(0);
	var modalWindow = Titanium.UI.createWindow({
	    backgroundColor:'transparent',
	    height:"100%",
	    width:"100%",
	    opacity:1,
	    transform: transformModalOpen,
	    id: "cats"
	});
	// create first transform to go beyond normal size
    var transformModalOpen1 = Titanium.UI.create2DMatrix();
    transformModalOpen1 = transformModalOpen1.scale(1.1);
    var animateOpen = Titanium.UI.createAnimation();
    animateOpen.transform = transformModalOpen1;
    animateOpen.duration = 300;
 
    // when this animation completes, scale to normal size
    animateOpen.addEventListener('complete', function()
    {
        var transformModalOpen2 = Titanium.UI.create2DMatrix();
        transformModalOpen2 = transformModalOpen2.scale(1.0);
        modalWindow.animate({transform:transformModalOpen2, duration:200});
 
    });
	var backgroundColorView = Titanium.UI.createView({
	    backgroundColor:'black',
	    height:"100%",
	    width:"100%",
	    opacity:0.3,
	    layout:'vertical'
	});
	var infoModalView = Titanium.UI.createView({
	    width:"90%",
	    borderRadius: 3,
	    height: Ti.UI.SIZE,
	    opacity:1,
	    zIndex: 20,
	    layout:'vertical',
	    backgroundColor: '#FAFAFA'
	});
	
	var modalHeaderLabel = Titanium.UI.createLabel({
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
	var datePicker = Titanium.UI.createPicker({
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
	});
	var modalSaveButton = Titanium.UI.createButton({
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
	});
	var pciExplanationLabel = Titanium.UI.createLabel({
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
	modalSaveButton.addEventListener('click', function() {
		var textFieldObject = {
			"id": Ti.App.Properties.getString('userId'), //Id of the user 
			"dateOfBirth": formatDate(datePicker.value)
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
	    Ti.API.info("User selected date: " + formatDate(datePicker.value));
	    //userManager.userUpdate(textFieldObject, function(err, userUpdateResult){});	
	    modalWindow.close({transform:animateWindowClose, duration:300});
	});
	modalWindow.open(animateOpen);
};
