

var Notificator = function() {  
	this.snackbar = document.getElementById("snackbar");	
}


Notificator.prototype.notify = function(msg){		
	this.snackbar.innerHTML = msg;
	this.snackbar.className = "show";
	setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}


export default Notificator;