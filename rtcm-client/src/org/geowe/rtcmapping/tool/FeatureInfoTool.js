import BaseTool from './BaseTool';

import Map from 'ol/map';
import ol from 'ol/index';
import GeoJSON from 'ol/format/geojson';
import FeatureGrid from '../ui/FeatureGrid';
import Notificator from '../../../../view/notificator';
import RTCMModalPanel from '../../../../view/RTCMModalPanel';
/**
 * @classdesc
 * Herramienta responsable de mostrar la información alfanumérica de los elementos
 * @constructor
 * @param {options} Options 
 * @param {String} options.id - identificador herramienta
 * @param {ol.vectorSource} options.vectorSource - capa de edición
 * @api
 */
var FeatureInfoTool = function(options) {
  
  this.id = options.id;
  this.vectorSource = options.vectorSource; 

  /**
   * TODO: Modificar la creacion e inicializacion del grid y de las herramientas
   * asociadas para que se haga desde fuera, o bien en el AppContext o en un 
   * componente inicializador si fuera necesario
   */  
  this.grid = new FeatureGrid({id: "feature-grid", editable: true});
  this.grid.setGridListener(this);

  var this_ = this;
  document.getElementById("newAttributeTool").onclick = function() {
    this_.showModal_();
  }

  BaseTool.call(this, {    
    
    id: this.id,
    controls: []

  });

};

ol.inherits(FeatureInfoTool, BaseTool);

FeatureInfoTool.prototype.onFeatureModified = function(feature, column) {
  this.rte = this.getAppContext().getRte();

  if(this.rte.isConnected()) {
    if(feature.get('shared')) {        
      this.rte.emitAttributeNewValue(feature.getId(),column, feature.get(column));
        
      feature.set('modified',false, true);
    }
  }
}

FeatureInfoTool.prototype.onNewColumnAdded = function(columnName) {
  this.rte = this.getAppContext().getRte();   

  if(this.rte.isConnected()) {  
    this.rte.emitNewAttribute(columnName);          
  }
}

FeatureInfoTool.prototype.updateGrid = function() {
  var features = this.vectorSource.getFeatures();
  this.grid.bind(features);
}

FeatureInfoTool.prototype.handle_ = function() {  
  document.getElementById("feature-grid-panel").style.display = "block";

  if(this.getAppContext().getIsOwner()) {
    document.getElementById("feature-grid-panel-footer").style.display = "block";  
  } else {
    document.getElementById("feature-grid-panel-footer").style.display = "none";  
  }
  this.updateGrid();        
}

FeatureInfoTool.prototype.showModal_ = function() {
  this.columnName = document.createElement('input');
  this.columnName.setAttribute("id", "newColumnInput");
  this.columnName.setAttribute("type", "text");  
  this.columnName.setAttribute("placeholder", "Nombre de columna");  
  this.columnName.setAttribute("pattern","[a-z]{1,25}");
  this.columnName.className = 'w3-input w3-animate-input';
  this.columnName.style.width = '90%';

  this.newColunmPanel = new RTCMModalPanel({
      parent: this,
      maxWidth: "300px",      
      title: "Nueva columna",
      content: "Nombre",
      htmlObject:  this.columnName,
      buttons: [
        {name: "Cancelar", event: this.onModalCancel}, 
        {name:"Aceptar", event: this.onModalAccept}
      ]
    });
}

FeatureInfoTool.prototype.onModalCancel = function() {          
  this.newColunmPanel.delete();    
}
  
FeatureInfoTool.prototype.onModalAccept = function() {
  var newColumn = this.columnName.value.replace(" ", "_");

  if(!this.grid.hasColumn(newColumn)) {
    this.grid.addColumn(newColumn);
  } else {
    new Notificator().notify('Ya existe una columna denominada '+ newColumn); 
  }
    
  this.newColunmPanel.delete();    
}
  
export default FeatureInfoTool;  