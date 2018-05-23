import htmlView from './RTCMModalPanel.html';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';


var RTCMModalPanel = function(options) {  
	var parent = options.parent;
	this.title = options.title;
	this.iconTitle = options.iconTitle;
	this.content = options.content;
	this.htmlObject = options.htmlObject;
	this.buttons = options.buttons;
	this.modalPanel = document.createElement('div');
	
	this.modalPanel.innerHTML = htmlView.trim(); 
	
	
	var target = document.getElementById("rtcm-overlay");
	while (target.firstChild) {
		target.removeChild(target.firstChild);
	}
	target.appendChild(this.modalPanel);		
	var elementPanel = this.modalPanel.firstChild;

	var panelContainer = document.getElementById("rtcm-modal-panel-container");
	panelContainer.style.maxWidth = (options.maxWidth != undefined)? options.maxWidth: "800px";
	

	var title = document.getElementById("rtcm-modal-panel-title");
	title.innerHTML = "<i class='" + this.iconTitle + "'></i> " + this.title;
	//title.className = title.className + " " + this.iconTitle; 
	if (this.content != undefined) {
		document.getElementById("rtcm-modal-panel-content").innerHTML= this.content;
	}

	if (this.htmlObject != undefined) {
		document.getElementById("rtcm-modal-panel-content").appendChild(this.htmlObject);
	}	


  var footer = document.getElementById("rtcm-modal-panel-footer");
  if(this.buttons == undefined || this.buttons.length == 0) {
	  footer.className ="";
  }
  else {
	this.buttons.forEach(function(button) {
		button.parent = parent;
		footer.appendChild(RTCMModalPanel.prototype.getButton.call(this, button));
	  });	
		  
  }
	  	
  
  elementPanel.style.display='block';
}



RTCMModalPanel.prototype.delete = function(){		
	document.getElementById('rtcm-modal-panel').remove();
}

RTCMModalPanel.prototype.getButton = function(buttonDefinition){		
	var button = document.createElement('button');  
	button.className = 'w3-button w3-right w3-white w3-border';
	button.innerHTML = buttonDefinition.name; 
    
     _ol_events_.listen(button, _ol_events_EventType_.CLICK,
		buttonDefinition.event, buttonDefinition.parent); 
	return button;	   
}

export default RTCMModalPanel;