import Map from 'ol/map';
import extent from 'ol/extent';
import RTCMModalPanel from '../../../view/RTCMModalPanel';

/**
 * @classdesc
 * Responsable de procesar la url de acceso
 * @constructor
 * @param {options} options 
 * @param {org.geowe.rtcmapping.AppContext} options.appContext -
 * @param {ol.map} options.map - rtcmapping.map (ol.map)
 * @param {string} options.device - dispositivo ('desktop' o 'mobile')
 * @api
 */
var UrlProcessor = function(options) {
  
    this.map = options.map; 
    this.device = options.device;
    this.appContext = options.appContext;
      
    this.handleParams();
};

/*
* URL PARAMS HANDLER:
* PARAMS : VALUE
* u = usuario que comparte (owner)
* r = room
* m = titulo del mapa compartido
* x = x del centro
* y = y del centro
* z = zoom
*/
UrlProcessor.prototype.handleParams = function(){
    this.params = new URLSearchParams(location.search);    
    if(this.params != ''){            
        this.showPanel();
    }
}

UrlProcessor.prototype.showPanel = function() {    
  
    this.invitationPanel = new RTCMModalPanel({
        parent: this,
        maxWidth: "300px",      
        title: "  Hola",
        iconTitle: "icon-group-add",
        content: this.params.get('u')+' te ha invitado a colaborar en '+this.params.get('m') +
            '<br><br><font size ="1">Pulsa Aceptar para empezar a Mapear juntos</font>',
        buttons: [
          {name: "Cancelar", event: this.cancel}, 
          {name:"Aceptar", event: this.aceptar}
        ]
      });
}

UrlProcessor.prototype.cancel = function() {      
    this.invitationPanel.delete();    
}
    
UrlProcessor.prototype.aceptar = function() {    
        
    this.setPosition();
    this.connectToCollaborate();
    this.setDocumentTitle();
    this.invitationPanel.delete();   
}

UrlProcessor.prototype.setPosition = function() {    
    
    var center = Array.of(Number(this.params.get('x')), Number(this.params.get('y')));    
    this.map.getView().setCenter(center);
    var zoom = Number(this.params.get('z'));    
    
    this.map.getView().setZoom(zoom);
}

UrlProcessor.prototype.connectToCollaborate = function() { 
    var rte = this.appContext.getRte();
    this.appContext.setIsOwner(false);

    rte.connect();
    rte.setRoomToJoin(this.params.get('r'));
}

UrlProcessor.prototype.setDocumentTitle = function() { 
    var textField = document.getElementById('docTitle');
    textField.value = this.params.get('m');
    textField.readOnly = true;
}

export default UrlProcessor; 