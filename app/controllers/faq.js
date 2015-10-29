var args = arguments[0] || {};

var objectTest = {
	ex1: {
		id: 'answer1',
		text: "Question 1 is this and that?",
		answer: "Blue is skyline"
	},
	ex2: {
		id: 'answer2',
		text: "Question 2 is this and this how about a little of that?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex3: {
		id: 'answer3',
		text: "Question 3",
		answer: "Aqua is not a thing"
	},
	ex4: {
		id: 'answer4',
		text: "Question 4 is this and that?",
		answer: "Blue is skyline"
	},
	ex5: {
		id: 'answer5',
		text: "Question 5 is this and this how about a little of that?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex6: {
		id: 'answer6',
		text: "Question 6",
		answer: "Aqua is not a thing"
	},
	ex7: {
		id: 'answer7',
		text: "Question 7 is this and that?",
		answer: "Blue is skyline"
	},
	ex8: {
		id: 'answer8',
		text: "Question 8 is this and this how about a little of that?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex9: {
		id: 'answer9',
		text: "Question 9",
		answer: "Aqua is not a thing"
	},
	ex10: {
		id: 'answer10',
		text: "Question 10 is this and that?",
		answer: "Blue is skyline"
	},
	ex11: {
		id: 'answer11',
		text: "Question 11 is this and this how about a little of that?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex12: {
		id: 'answer12',
		text: "Question 12",
		answer: "Aqua is not a thing"
	},
};
var dataArray = [];


/*-----------------------------------------------Dynamically Create Elements------------------------------------------------*/

for (var i in objectTest) {
	switch(Alloy.Globals.userDevice) {
	    case 0:
	        faqFontSize = 14;
	        break;
	    case 1:
	        faqFontSize = 16;
	        break;
	    case 2:
	        faqFontSize = 18;
	        break;
	    case 3:
	        faqFontSize = 20;
	        break;
	    case 4: //android currently same as iphoneSix
	        faqFontSize = 18;
	        break;
	};
	var viewing = Titanium.UI.createView({
		layout: 'horizontal',
		height: Titanium.UI.SIZE,
		top: "20dp",
		id: i
	});
	var icon = Titanium.UI.createLabel({
		font:{
			fontSize: faqFontSize,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#1BA7CD"
	});
	var questionLabel = Titanium.UI.createLabel({
        font:{
			fontSize: faqFontSize,
	    	fontFamily: 'Nunito-Bold'
		},
		color: "#1BA7CD",
		left: "10dp",
        text: objectTest[i].text,
        id: objectTest[i].id
	});
	var answerlabel = Titanium.UI.createLabel({
        font:{
			fontSize: faqFontSize,
	    	fontFamily: 'Nunito-Light'
		},
		color: "#1BA7CD",
		width: Titanium.UI.FILL,
		left: "26dp",
		height: "0dp",
		visible: false,
        text: objectTest[i].answer,
	});
	$.fa.add(icon,'fa-plus-circle');
	viewing.add(icon);
	viewing.add(questionLabel);
	dataArray.push(viewing);
	dataArray.push(answerlabel);
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
