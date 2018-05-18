import RTCMModalPanel from '../../../view/RTCMModalPanel';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
/**
 * @classdesc
 * Representa un generador de url para compartir la edición.
 *
 * @constructor
 * @param {options} options 
 * @param {String} options.nick - nick del usuario
 * @param {String} options.room - Sala de edición   
 * @param {ol.map.center} options.center - Centro del mapa  x= center[0] y=center[1]
 * @param {Number} options.zoom - Zoom inicial del mapa 
 * @param {org.geowe.appContext} appContext - Contexto de la aplicación
 * @api
 */
var SharedUrlGenerator = function(options, appContext) {
  
    this.nick = options.nick;   
    this.room = options.room;      
    this.center = options.center;
    this.zoom = options.zoom;
    this.mapTitle = document.getElementById('docTitle');

    this.showUrlBtn = document.getElementById('statusLabel');
	_ol_events_.listen(this.showUrlBtn, _ol_events_EventType_.CLICK,
		this.showUrl, this);
    
};

SharedUrlGenerator.prototype.showUrl = function() {
	this.show(this.generate());
}

/*URL PARAMS HANDLER:
* PARAMS : VALUE
* u = usuario que comparte (owner)
* r = room
* m = titulo del mapa compartido
* x = x del centro
* y = y del centro
* Ejemplo: http://127.0.0.1:9000/?u=user-11&r=user-11_1526377277585&m=mi%20mapa&x=-468746.4098361051&y=4819135.195365203&z=9
*/
SharedUrlGenerator.prototype.generate = function(){
    
    var hrefQuery = '?u='+this.nick+'&r='+this.room+'&m='+this.mapTitle.value
    +'&x='+this.center[0]+'&y='+this.center[1]+'&z='+this.zoom;

    this.url = new URL(hrefQuery, location.href);    
    return this.url;    
}

SharedUrlGenerator.prototype.show = function(url){
    this.urlInput = document.createElement('input');
    this.urlInput.setAttribute("id", "urlInput");
    this.urlInput.setAttribute("type", "text");  
    this.urlInput.setAttribute("readOnly", "true");  
    this.urlInput.value = url;
    this.urlInput.className = 'w3-input';
    this.urlInput.style.width = '90%';
    this.urlInput.setAttribute("autofocus","true")


    this.invitationPanel = new RTCMModalPanel({
        parent: this,
        maxWidth: "70%",      
        title: "  Invita a colaboradores",
        iconTitle: "icon-group-add",
        content: '<font size ="2">Todo aquel que tenga esta URL podrá colaborar en tiempo real:</font><br>',
        htmlObject:  this.urlInput,
        buttons: [
            {name: "Copiar al portapapeles", event: this.copy}
          ]
      });
}

SharedUrlGenerator.prototype.copy = function() {      
    this.urlInput.select();
    document.execCommand("Copy");    
}

export default SharedUrlGenerator; 