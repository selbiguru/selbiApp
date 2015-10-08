var args = arguments[0] || {};

var codeNumbers =[];

console.log("hey what are the args?", args);

function verifyCode(e){
	var code = args.code;
	if(codeNumbers.join('') === args.code) {
		console.log('YES THIS IS THE SAME');	
	} else {
		console.log('NO DIFFERENT CODES');
	}
};

function resendCode(){
	return true;
};


$.phoneVerify.addEventListener('change', function(e){
	var children = $.phoneVerify.children;
	for(var i = 0 ; i < children.length; i++){
		var child = children[i],
			nextChild = children[i+1];
		if(e.source.id === child.id){
			if(child.value.length > 0 && i !== (children.length - 1)) {
				codeNumbers[i] = child.value;
				nextChild.focus();
			} else if(child.value.length > 0) {
				codeNumbers[i] = child.value;
				child.blur();
			}
		}
	}
	return;
});

