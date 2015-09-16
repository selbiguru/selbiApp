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
		id: 'answer3',
		text: "Question 3",
		answer: "Aqua is not a thing"
	},
};
var dataArray = [];

for (var i in objectTest) {
	var viewing = $.UI.create('View', {
		classes: ["view-question-icon"],
		id: i
	});
	var icon = $.UI.create('Label', {
		classes: ["icon-faq"],
	});
	var label = $.UI.create('Label', {
        classes: ["label-question-number"],
        text: objectTest[i].text,
        id: objectTest[i].id
	});
	var label2 = $.UI.create('Label', {
        classes: ["label-question-answer"],
        text: objectTest[i].answer,
	});
	$.fa.add(icon,'fa-plus-circle');
	viewing.add(icon);
	viewing.add(label);
	dataArray.push(viewing);
	dataArray.push(label2);
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
