var args = arguments[0] || {};

var objectTest = {
	ex1: {
		id: 'answer1',
		text: "Question 1 is this and that?",
		answer: "Blue is skyline"
	},
	ex2: {
		id: 'answer2',
		text: "Question 2 is this and this and how about a little of that?",
		answer: "Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here Yellow is here "
	},
	ex3: {
		id: 'answer3 is all about this and nothing to do with any of that or does it?',
		text: "Question 3",
		answer: "Aqua is not a thing"
	},
};
var dataArray = [];

for (var i in objectTest) {
	var viewing = $.UI.create('View', {
		classes: ["viewing"],
		id: i
	});
	var icon = $.UI.create('Label', {
		classes: ["poop"],
	});
	var label = $.UI.create('Label', {
        classes: ["labelQuestionNumber"],
        text: objectTest[i].text,
        id: objectTest[i].id
	});
	var label2 = $.UI.create('Label', {
        classes: ["labelQuestionAnswer"],
        text: objectTest[i].answer,
	});
	$.fa.add(icon,'fa-plus-circle');
	viewing.add(icon);
	viewing.add(label);
	dataArray.push(viewing);
	dataArray.push(label2);
}

$.viewBankDescription.add(dataArray);

//Animate show and hide FAQ answers on click
$.viewBankDescription.addEventListener('click', function(e){
	
	console.log("%%%%%%%% ", e.source.id);
	var children = $.viewBankDescription.children;
	console.log("$$$$$$ ", children);
	for(var i = 0 ; i < children.length; i++){
		var child = children[i];
		console.log("********** ", child.children[1].id);
		if(e.source.id && e.source.id === child.id && children[i+1].height === 'SIZE') {
			children[i + 1].hide();
			children[i + 1].height = "0dp";
		} else if (e.source.id && e.source.id === child.id) {
			console.log("false", children[i], children[i].height);
			children[i + 1].show();
			children[i + 1].height = Ti.UI.SIZE;
		}
	}
	
	return;
});
