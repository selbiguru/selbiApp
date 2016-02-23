/**
 * @class FAQ
 * This class deals with Selbi's FAQ page
 */

var args = arguments[0] || {};
var helpers = require('utilities/helpers'),
	dynamicElement = require('utilities/dynamicElement'),
	faqManager = require('managers/faqmanager');


$.activityIndicator.show();

faqManager.getFAQ(function(err, faqResults) {
	if(err) {
		dynamicElement.defaultLabel('Oh no!  We are asking ourselves too many questions! Not to fear, FAQ\'s will be back soon!', function(err, results) {
			$.viewFAQ.add(results);
		});
	} else {
		showFAQ(faqResults);	
	}
	$.activityIndicator.hide();
	$.activityIndicator.height = '0dp';
	return;
});

/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

function showFAQ(faqObject) {
	var dataArray = [];
	var faqFontSizeAnswer, faqFontSizeQuestion,
		faqTop, faqQLeft;
	for (var i in faqObject) {
		switch(Alloy.Globals.userDevice) {
		    case 0: //iphoneFour
		        faqFontSizeAnswer = 14;
		        faqFontSizeQuestion = 15;
		        faqTop = '8dp';
		        faqQLeft = '7dp';
		        break;
		    case 1: //iphoneFive
		        faqFontSizeAnswer = 15;
		        faqFontSizeQuestion = 16;
		        faqTop = '8dp';
		        faqQLeft = '7dp';
		        break;
		    case 2: //iphoneSix
		        faqFontSizeAnswer = 17;
		        faqFontSizeQuestion = 18;
		        faqTop = '10dp';
		        faqQLeft = '10dp';
		        break;
		    case 3: //iphoneSixPlus
		        faqFontSizeAnswer = 19;
		        faqFontSizeQuestion = 20;
		        faqTop = '10dp';
		        faqQLeft = '10dp';
		        break;
		    case 4: //android currently same as iphoneSix
		        faqFontSizeAnswer = 17;
		        faqFontSizeQuestion = 18;
		        faqTop = '10dp';
		        faqQLeft = '10dp';
		        break;
		};
		var questionView = Titanium.UI.createView({
			layout: 'horizontal',
			height: Titanium.UI.SIZE,
			top: faqTop,
			id: i
		});
		var questionLabel = Titanium.UI.createLabel({
	        font:{
				fontSize: faqFontSizeQuestion,
		    	fontFamily: 'Nunito-Light'
			},
			color: "#545555",
			left: faqQLeft,
	        text: faqObject[i].question,
	        id: faqObject[i].id
		});
		var answerlabel = Titanium.UI.createLabel({
	        font:{
				fontSize: faqFontSizeAnswer,
		    	fontFamily: 'Nunito-Light'
			},
			color: "#7A7B7B",
			width: '88%',
			height: "0dp",
			visible: false,
	        text: faqObject[i].answer
		});
		var underline = Titanium.UI.createView({
			height: "1dp",
			top: faqTop,
			backgroundColor:"#EAEAEA",
			width: Ti.UI.FILL
		});
		questionView.add(questionLabel);
		dataArray.push(questionView);
		dataArray.push(answerlabel);
		dataArray.push(underline);
	}
	$.viewFAQ.add(dataArray);
}


//Animate show and hide FAQ answers on click
$.viewFAQ.addEventListener('click', function(e){
	var children = $.viewFAQ.children;
	for(var i = 0 ; i < children.length; i++){
		var child = children[i];
		if(child.children.length){
			for(var k = 0 ; k < child.children.length; k++) {
				if(child.children[k].id && e.source.id === child.children[k].id && children[i+1].height === 'SIZE') {
					children[i + 1].hide();
					children[i + 1].height = "0dp";
				} else if (child.children[k].id && e.source.id === child.children[k].id) {
					children[i + 1].show();
					children[i + 1].height = Ti.UI.SIZE;
				}
			}
		}
	}
	
	return;
});
