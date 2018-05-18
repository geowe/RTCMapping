import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';


var BaseTool = function(options) {
	
	this.button = document.getElementById(options.id);	

	this.defaultTool = (options.defaultTool !== undefined) ? options.defaultTool : false;
	this.cursorHoverStyle = (options.cursor !== undefined) ? options.cursor : "default"; 	
  	this.button.controls = options.controls;

  	_ol_events_.listen(this.button, _ol_events_EventType_.CLICK,
      this.handle_, this);
}


BaseTool.prototype.handle_ = function() {	
	this.appContext.activeTool(this);	
}

BaseTool.prototype.getName = function() {
	return this.button.id;
}

BaseTool.prototype.getButton = function() {
	return this.button;
}

BaseTool.prototype.isActive = function() {
	var control = this.button.controls[0];
	if ( control !== undefined) {
		return this.button.controls[0].getActive();	
	}

	return false;
}

BaseTool.prototype.setActive = function(enabled) {

	this.button.controls.forEach(function(control) {
    	control.setActive(enabled);    
  	});

	if(enabled) {
		this.button.classList.remove("w3-theme");
		this.button.classList.add("w3-green");		
	}
	else {
		this.button.classList.remove("w3-green");
		this.button.classList.add("w3-theme");
	}
}

BaseTool.prototype.onLoad = function(map, appContext) {
	this.map = map;
	this.appContext = appContext;	

	this.button.controls.forEach(function(control) {
    	   map.addInteraction(control);
  	});	
}

BaseTool.prototype.getMap = function() {
	return this.map;
}

BaseTool.prototype.getAppContext = function() {
	return this.appContext;
}

BaseTool.prototype.getRoom = function() {
	return this.appContext.getRoom();
}

BaseTool.prototype.getNick = function() {
	if(this.appContext.getRte().isConnected()) { 
		return this.appContext.getSocket().nick;
	}
	return "no-nick";
}

export default BaseTool;
