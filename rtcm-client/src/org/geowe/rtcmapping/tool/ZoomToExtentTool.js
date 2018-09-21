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
    this.defaultExtent = options.defaultExtent;

    BaseTool.call(this, {
        id: this.id,
        controls: []
    });

};

ol.inherits(ZoomToExtentTool, BaseTool);


ZoomToExtentTool.prototype.handle_ = function() {
    var map = this.getMap();
    var view = map.getView();
    var elements = this.vectorSource.getFeatures().length;

    var extent = (elements != 0) ? this.vectorSource.getExtent() : this.defaultExtent; //view.getProjection().getExtent()
    var size = map.getSize();
    //view.fit(extent, size);
    view.fit(extent, { size: size, maxZoom: 17 });
}


export default ZoomToExtentTool;