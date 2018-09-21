import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import RTCMModalPanel from '../view/RTCMModalPanel';

var Sidebar = function() {  
	
	this.map = map;	
	this.sidebarBtn =  document.getElementById('mainMenuBtn');	
	this.closeBtn = document.getElementById('closeSidebarBtn');  
	
	_ol_events_.listen(this.sidebarBtn, _ol_events_EventType_.CLICK,
		this.openSidebar, this);
	_ol_events_.listen(this.closeBtn, _ol_events_EventType_.CLICK,
		this.closeSidebar, this);
	
}


Sidebar.prototype.openSidebar = function(){	
	document.getElementById("sidebar").style.display = "block"
}

Sidebar.prototype.closeSidebar = function() {
	document.getElementById("sidebar").style.display = "none";
}



export default Sidebar;