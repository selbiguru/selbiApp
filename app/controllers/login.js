var args = arguments[0] || {};




function loginUser(){
	var xhr=Titanium.Network.createHTTPClient();    
	xhr.onerror = function(e){ 
	 Ti.API.error('Bad Sever =>'+e.error);
	 alert('Bad Sever =>'+e.error);
	};
	 
	xhr.open("POST","http://localhost:1337/login");//ADD your URL
	xhr.setRequestHeader("content-type", "application/json");
	var param={ "identifier":$.username.value,"password":$.password.value};
	 
	Ti.API.info('Params'+JSON.stringify(param));
	xhr.send(JSON.stringify(param));
	 
	xhr.onload = function(){
	 Ti.API.info('RAW ='+this.responseText);
	 if(this.status == '200'){
	    Ti.API.info('got my response, http status code ' + this.status);
	    if(this.readyState == 4){
	      var response=JSON.parse(this.responseText);
	      Ti.API.info('Response = '+response);
	    }else{
	      alert('HTTP Ready State != 4');
	    }           
	 }else{
	    alert('HTTp Error Response Status Code = '+this.status);
	    Ti.API.error("Error =>"+this.response);
	 }              
	};
}
