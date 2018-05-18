import BaseTool from './BaseTool';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import Map from 'ol/map';
import ol from 'ol/index';
import GeoJSON from 'ol/format/geojson';
import * as jsts from 'jsts';
import StyleFactory from '../factory/StyleFactory';
import RTCMModalPanel from '../../../../view/RTCMModalPanel';
import Notificator from '../../../../view/notificator';
import { RteOperation } from "../RteOperation";
/**
 *@classdesc
 * Herramienta (Buffer) encargada de modificar la geometría de un feature dada una distancia de influencia
 * @constructor
 * @param {options} options 
 * @param {String} options.id - Nombre de la herramienta
 * @param {ol.vectorSource} options.vectorSource - capa de edición
 */
var BufferTool = function(options) {
  this.id = options.id;
  this.vectorSource = options.vectorSource; 
  
  
  BaseTool.call(this, {    
    
    id: this.id,
    controls: []

  });

};

ol.inherits(BufferTool, BaseTool);

BufferTool.prototype.handle_ = function() {
  var selectTool = this.getAppContext().getTool("selectTool");
  var features = selectTool.getFeatures();  
  var size = features.getLength();
    if(size > 0) {
      this.showPanel();
    }
    else {
      new Notificator().notify('No se encuentran elementos seleccionados!!');
    }
}

BufferTool.prototype.showPanel = function() {
  this.distance = document.createElement('input');
  this.distance.setAttribute("id", "bufferInput");
  this.distance.setAttribute("type", "text");  
  this.distance.setAttribute("placeholder", "Distancia");  
  this.distance.setAttribute("pattern","[0-9]");
  this.distance.className = 'w3-input w3-animate-input';
  this.distance.style.width = '40%';

  this.bufferPanel = new RTCMModalPanel({
      parent: this,
      maxWidth: "300px",      
      title: "Zona de influencia",
      content: "Distancia en metros",
      htmlObject:  this.distance,
      buttons: [
        {name: "Cancelar", event: this.cancel}, 
        {name:"Aceptar", event: this.aceptar}
      ]
    });
}

  BufferTool.prototype.cancel = function() {      
    
    this.bufferPanel.delete();    
  }
    
  BufferTool.prototype.aceptar = function() {    
    var bufferValue = this.distance.value;    
    if(isNaN(bufferValue)){
      new Notificator().notify('La distancia debe ser un número');
      return;
    }
    var selectTool = this.getAppContext().getTool("selectTool");
    var features = selectTool.getFeatures();
    var size = features.getLength();
    this.cancel();
   
    for (var i = 0; i < size; i++) {
          
      var feature = features.item(i);            
      this.buffer(feature, bufferValue);
      if(feature.get('shared')){
        this.emit(feature);
      }      
    }
    features.clear();    
}
  
BufferTool.prototype.buffer = function(feature, distance) {  
  try {
    
        var olFormat = new GeoJSON();                
        var geojsonRepresentation  = olFormat.writeGeometry(feature.getGeometry(), {dataProjection: "EPSG:3857"});
        
        var reader = new jsts.io.GeoJSONReader();
        var jstsGeom = reader.read(geojsonRepresentation);
                              
        var writter = new jsts.io.GeoJSONWriter();
        var geojsonBuf = writter.write(jstsGeom.buffer(distance));
        
        feature.setGeometry(olFormat.readGeometry(geojsonBuf, {dataProjection: "EPSG:3857"}));        
  }
  catch(err) {
    new Notificator().notify('ERROR: '+err.message);
  }
}


BufferTool.prototype.emit = function(feature){

  var nick = this.getNick();    
  this.rte = this.getAppContext().getRte();  
  if(this.rte.isConnected()) {   
    var styleFactory = new StyleFactory();
    var style = styleFactory.getShareStyle({strokeColor: "green", pointFillColor: "green", nick: nick});
    feature.setProperties({'nick':nick, 'shared':true, 'modified':true}) 
    var selectTool = this.getAppContext().getTool("selectTool");
    feature.setStyle(styleFactory.selectableStyle(style, selectTool.getFeatures())); 
    
    var olFormat = new GeoJSON(); 
    var geojson = olFormat.writeFeature(feature);

    this.rte.emit(RteOperation.MODIFY, geojson)     
  }
}

export default BufferTool;