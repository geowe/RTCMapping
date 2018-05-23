import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
/**
 * @classdesc
 * Control responsable de cambiar el título del mapa
 * @constructor
 * @param {options} options 
 * @param {String} options.id - identificador de la herramienta
 * @param {org.geowe.appContext} appContext 
 */
var DocumentTitleControl = function(options, appContext) {

    this.textField = document.getElementById(options.id);	   
    this.appContext = appContext;
    
    _ol_events_.listen(this.textField, _ol_events_EventType_.KEYPRESS,
        this.handle_, this);
}

DocumentTitleControl.prototype.handle_ = function(e) {        
    if(e.keyCode == 13) {        
        var rte = this.appContext.getRte();       
        if(rte.isConnected()) {
            rte.emitTitle(this.textField.value)          
        }
    }
}

DocumentTitleControl.prototype.getSocket = function() {
	return this.appContext.getSocket();
}

DocumentTitleControl.prototype.getAppContext = function() {
	return this.appContext;
}

export default DocumentTitleControl;