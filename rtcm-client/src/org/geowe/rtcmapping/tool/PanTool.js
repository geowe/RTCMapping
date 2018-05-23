import BaseTool from './BaseTool';
import ol from 'ol/index';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
/**
 * @classdesc
 * Herramienta Pan. Mover el mapa
 * @constructor
 * @param {options} options 
 * @param {String} options.id - Nombre de la herramienta
 * @param {String} options.cursor - Puntero del ratón
 * @api
 */
var PanTool = function(options) {  

	this.id = options.id;
	this.cursor = options.cursor; 

  	BaseTool.call(this, {    
    	   
	    id: this.id,      
	    cursor: this.cursor,	    
	    defaultTool: true,
	    controls: []

  	});  
};

ol.inherits(PanTool, BaseTool);

PanTool.prototype.onLoad = function(map, appContext) {  
  BaseTool.prototype.onLoad.call(this, map, appContext);
  this.handle_();  
}


export default PanTool;