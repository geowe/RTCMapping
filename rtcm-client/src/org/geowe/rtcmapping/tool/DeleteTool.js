import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';

import Select from 'ol/interaction/select';
import DragBox from 'ol/interaction/dragbox';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';

import condition from 'ol/events/condition';
import Vector from 'ol/layer/vector';
import Notificator from '../../../../view/notificator';
import RTCMModalPanel from '../../../../view/RTCMModalPanel';
import StyleFactory from '../factory/StyleFactory'

//FIXME: en vista movil de firefox no funciona. Habrá que probarlo en el dispositivo
/**
 * @classdesc
 * Herramienta responsable de eliminar elementos del mapa
 * @constructor
 * @param {options} options
 * @param {String} options.id - Nombre de la herramienta
 * @param {String} options.cursor - Icono del puntero del ratón
 * @param {ol.vectorSource} options.vectorSource - capa de edición
 */
var DeleteTool = function(options) {
  
  this.id = options.id;  
  this.cursor = options.cursor; 
  this.vectorSource = options.vectorSource;

  var selectStyle = new StyleFactory().selectStyle();
      
  this.selectClick = new Select({
        condition: condition.click,
        style: selectStyle
      });
  
  this.selectClick.setActive(false);
  
  var this_ = this;

  this.selectClick.on('select', function(e) {
    
    this_.selectedFeatures = e.selectedFeatures; 
    DeleteTool.prototype.confirmFeatures.call(this_, e.selected, this_.vectorSource, this_.getMap());  
          
  });
 
  
  this.dragBox = new DragBox({    
    condition: condition.primaryAction,
    style: selectStyle
  });
  
  this.dragBox.on('boxstart', function() { 
    this_.selectedFeatures.clear();    
  });
  
  this.dragBox.on('boxend', function(e) {     
    var extent = this.getGeometry().getExtent();
    
    this_.vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {         
      this_.selectedFeatures.push(feature);       
    });
    if(this_.selectedFeatures.getLength() > 0){
      DeleteTool.prototype.confirmFeatures.call(this_, this_.selectedFeatures, this_.vectorSource, this_.getMap());        
    }    
  });
   
  this.dragBox.setActive(false);
  
  
  BaseTool.call(this, {        
    id: this.id,   
    cursor: this.cursor,  
    controls: [this.selectClick, this.dragBox]   
  });

};

ol.inherits(DeleteTool, BaseTool);

DeleteTool.prototype.clearSelectedFeatures = function() {
  this.selectedFeatures = this.selectClick.getFeatures();
  this.selectClick.getFeatures().clear();
}

DeleteTool.prototype.confirmFeatures =   function(features, vectorSource, map){  
  
  this.numFeatures = (features.length== undefined ? features.getLength():features.length);
  
  this.features = features;

  this.confirmationPanel = new RTCMModalPanel({
    parent: this,   
    title: "Eliminar elementos",
    iconTitle: "icon-delete",
    content: "¿Está seguro de eliminar los " + this.numFeatures + " elementos seleccionados?",
    buttons: [
      {name: "Cancelar", event: this.cancel}, 
      {name:"Aceptar", event: this.aceptar}
    ]
  });
                  
}    

DeleteTool.prototype.cancel = function() {  

  this.clearSelectedFeatures();
  this.confirmationPanel.delete();
  
}
  
DeleteTool.prototype.aceptar = function() {
	  
      var this_ = this;
      
      var rte = this.getAppContext().getRte();    
      this.features.forEach(function(feature){
        if(feature.get('shared')){
          if(rte.isConnected()) {      
            rte.delete(feature.getId());
          }
        }         
        this_.vectorSource.removeFeature(feature); 
      });
      
      this_.cancel();
      new Notificator().notify('Se han eliminado '+ this_.numFeatures +' elementos'); 
}
  
DeleteTool.prototype.setActive = function(enabled) {    
  BaseTool.prototype.setActive.call(this, enabled);
  this.clearSelectedFeatures();
}  

export default DeleteTool;