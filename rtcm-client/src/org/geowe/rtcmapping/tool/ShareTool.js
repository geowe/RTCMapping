import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';
import RTCMModalPanel from '../../../../view/RTCMModalPanel';
import Rte from '../RealTimeEngine';

/**
 * @classdesc
 * Herramienta responsable de conectar/desconectar del motor de tiempo real
 * @constructor
 * @param {options} Options 
 * @param {String} options.id - identificador herramienta
 * @param {String} options.device - dispositivo (mobile, desktop)
 * @api
 */
var ShareTool = function(options) {
  
  this.id = options.id;
  this.device = options.device;

  BaseTool.call(this, {    
    id: this.id,
    controls: []
  });

};

ol.inherits(ShareTool, BaseTool);

ShareTool.prototype.setActive = function(enabled) {
}

ShareTool.prototype.getElementToNotify = function(id) {
}

ShareTool.prototype.handle_ = function() { 
  this.rte = this.getAppContext().getRte();
  if(!this.rte.isConnected()) {        
    this.rte.connect();
  }
  else {      
    this.confirmDisconect();
  }   
}

ShareTool.prototype.confirmDisconect =   function(){     
  this.confirmationPanel = new RTCMModalPanel({
    parent: this,   
    title: "Salir de la sesión",
    iconTitle: "icon-warning",
    content: "¿Desea salir de la sesión compartida?<br><br><font size=2>Dejará de recibir datos del resto de colaboradores.</fon>",
    buttons: [
      {name: "No", event: this.cancel}, 
      {name:"Si", event: this.aceptar}
    ]
  });                  
}

ShareTool.prototype.cancel = function() {    
  this.confirmationPanel.delete();  
}
  
ShareTool.prototype.aceptar = function() {
  this.rte.disconnect();
  this.confirmationPanel.delete();  
}

export default ShareTool;  