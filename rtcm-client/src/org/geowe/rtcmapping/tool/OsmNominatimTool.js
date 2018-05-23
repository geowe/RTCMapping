import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';
import axios from 'axios/index';
import extent from 'ol/extent';
import proj from 'ol/proj';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import Notificator from '../../../../view/notificator';

/**
 * @classdesc
 * Herramienta de geolocalización usando el servicio Nominatim de OSM
 * @constructor
 * @param {options} options
 * @param {ol.vectorSource} options.vectorSource - mapa de edición
 * @api
 */
var OsmNominatimTool = function(options) {
  
  this.id = options.id;  
  this.vectorSource = options.vectorSource; 
  this.searchInput = document.getElementById('searchInput');
  _ol_events_.listen(this.searchInput, _ol_events_EventType_.KEYPRESS,
    this.handleEnterKey, this);

  BaseTool.call(this, { 
    id: this.id,
    controls: []
  });

};

ol.inherits(OsmNominatimTool, BaseTool);

OsmNominatimTool.prototype.setActive = function(enabled) {
}


OsmNominatimTool.prototype.handleEnterKey = function(e) { 
  if(e.keyCode == 13) { 
    this.handle_();
  }
}
OsmNominatimTool.prototype.handle_ = function() {  
  var inputText = this.searchInput.value; 
  if(inputText == ''){
    return;
  }
  var map = this.getMap();
  var view = this.map.getView();
   
  var url='https://nominatim.openstreetmap.org/search?zoom=10&limit=1&format=json&q='+inputText;
  axios.get(url)
  .then(function (response) {
    var notificator = new Notificator();
    notificator.notify('Geolocalizando: '+inputText ); 
    if(response.data.length == 0){
      notificator.notify('No hemos localizado: '+ inputText);
    }else{
      var boundingbox = response.data[0].boundingbox;  
      var extension = proj.transformExtent([Number(boundingbox[2]), Number(boundingbox[0]), 
        Number(boundingbox[3]), Number(boundingbox[1])], 'EPSG:4326', 'EPSG:3857');
      var size = map.getSize();
      view.fit(extension, size);   
    }   

  })
  .catch(function (error) {
    new Notificator().notify('¡Ups! No se ha Geolocalizando: '+this.searchInput.value ); 
  });
}

export default OsmNominatimTool;  