import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';

/**
 * @classdesc
 * Herramienta Zoom a la capa. Establece el zoom del mapa para visualizar todos los elementos de la capa de edición
 * @constructor
 * @param {options} options 
 * @param {String} options.id - Nombre de la herramienta
 * @param {ol.vectorSource} options.vectorSource - mapa de edición
 * @api
 */
var ZoomToExtentTool = function(options) {
  
  this.id = options.id;
  this.vectorSource = options.vectorSource; 

  BaseTool.call(this, { 
    id: this.id,
    controls: []
  });

};

ol.inherits(ZoomToExtentTool, BaseTool);


ZoomToExtentTool.prototype.handle_ = function() {  
  var map = this.getMap();
  var view = map.getView();  
  var extent = (this.vectorSource !== undefined) ? this.vectorSource.getExtent() : view.getProjection().getExtent(); 
  var size = map.getSize();
  view.fit(extent, size);
}
  

export default ZoomToExtentTool;  