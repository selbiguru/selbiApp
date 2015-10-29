var args = arguments[0] || {};

var objectTest = {
	ex1: {
		id: 'answer1',
		text: "What is Selbi?",
		answer: "Blue is skyline"
	},
	ex2: {
		id: 'answer2',
		text: "Why use Selbi?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex3: {
		id: 'answer3',
		text: "How do you pronounce Selbi?",
		answer: "Aqua is not a thing"
	},
	ex4: {
		id: 'answer4',
		text: "Are my bank and credit card data safe?",
		answer: "Blue is skyline"
	},
	ex5: {
		id: 'answer5',
		text: "How do I purchase a product?",
		answer: "Yellow is here for you to be Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex6: {
		id: 'answer6',
		text: "How do I know where to mail and item I've sold?",
		answer: "Aqua is not a thing"
	},
	ex7: {
		id: 'answer7',
		text: "How do I get paid?",
		answer: "Blue is skyline"
	},
	ex8: {
		id: 'answer8',
		text: "How fast do I get paid?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex9: {
		id: 'answer9',
		text: "What happens if I don't receive my item?",
		answer: "Aqua is not a thing"
	},
	ex10: {
		id: 'answer10',
		text: "How long does it take to receive an item?",
		answer: "Blue is skyline"
	},
	ex11: {
		id: 'answer11',
		text: "How many items can I list at once?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex12: {
		id: 'answer12',
		text: "How long are my items listed for?",
		answer: "Aqua is not a thing"
	},
	ex13: {
		id: 'answer13',
		text: "I only want my friends to see items I list.",
		answer: "Blue is skyline"
	},
	ex14: {
		id: 'answer14',
		text: "Is Selbi free to use?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex15: {
		id: 'answer15',
		text: "How does Selbi make money?",
		answer: "Aqua is not a thing"
	},
	ex16: {
		id: 'answer16',
		text: "I'm not receiving emails telling me when an item was sold.",
		answer: "Blue is skyline"
	},
	ex17: {
		id: 'answer17',
		text: "Trouble Shooting...",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
};
var dataArray = [];


/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

for (var i in objectTest) {
	switch(Alloy.Globals.userDevice) {
	    case 0: //iphoneFour
	        faqFontSize = 14;
	        faqTop = '8dp';
	        faqQLeft = '7dp';
	        break;
	    case 1: //iphoneFive
	        faqFontSize = 16;
	        faqTop = '8dp';
	        faqQLeft = '7dp';
	        break;
	    case 2: //iphoneSix
	        faqFontSize = 18;
	        faqTop = '10dp';
	        faqQLeft = '10dp';
	        break;
	    case 3: //iphoneSixPlus
	        faqFontSize = 20;
	        faqTop = '13dp';
	        faqQLeft = '10dp';
	        break;
	    case 4: //android currently same as iphoneSix
	        faqFontSize = 18;
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
			fontSize: faqFontSize,
	    	fontFamily: 'Nunito-Bold'
		},
		color: "#9B9B9B",
		left: faqQLeft,
        text: objectTest[i].text,
        id: objectTest[i].id
	});
	var answerlabel = Titanium.UI.createLabel({
        font:{
			fontSize: faqFontSize,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#9B9B9B",
		width: '90%',
		height: "0dp",
		visible: false,
        text: objectTest[i].answer,
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
					console.log("false", children[i], children[i].height);
					children[i + 1].show();
					children[i + 1].height = Ti.UI.SIZE;
				}
			}
		}
	}
	
	return;
});
