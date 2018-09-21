import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';
import proj from 'ol/proj';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import Notificator from '../../../../view/notificator';
import Point from 'ol/geom/point';
import Feature from 'ol/feature';
import FeatureMapper from '../factory/FeatureMapper';
import Geolocation from 'ol/geolocation';

//TODO: estaría bien un panel de configuración para poder pedir solo posicion actual
// o ir dibujando todas las posiciones cuando cambien. Incluso para compartir la posicion
/**
 * @classdesc
 * Herramienta de geolocalización de la posicion del dispositivo
 * @constructor
 * @param {options} options
 * @param {ol.vectorSource} options.vectorSource - mapa de edición
 * @api
 */
var GeoLocationTool = function(options) {
  
  this.id = options.id;  
  this.vectorSource = options.vectorSource; 
  this.findMeBtn = document.getElementById('findMe');

  _ol_events_.listen(this.findMeBtn, _ol_events_EventType_.KEYPRESS,
    this.handleEnterKey, this);

  BaseTool.call(this, { 
    id: this.id,
    controls: []
  });

};

ol.inherits(GeoLocationTool, BaseTool);

GeoLocationTool.prototype.setActive = function(enabled) {
}

GeoLocationTool.prototype.handle_ = function() {  
  if (navigator.geolocation){
    var this_ = this;
    var notificator = new Notificator();

		navigator.geolocation.getCurrentPosition(function(objPosition){
			var lon = objPosition.coords.longitude;
			var lat = objPosition.coords.latitude;
      //TODO: ¿zoom a la posicion?       
      var point = new Point(proj.transform([lon, lat], 'EPSG:4326',  'EPSG:3857'));
      var positionFeature = new Feature({
        geometry: point
      });
      new FeatureMapper().fillFeature(positionFeature);
      this_.vectorSource.addFeature(positionFeature);


		}, function(objPositionError){
			switch (objPositionError.code){
				case objPositionError.PERMISSION_DENIED:
          notificator.notify("No se ha permitido el acceso a la posición del usuario.");
				  break;
				case objPositionError.POSITION_UNAVAILABLE:
          notificator.notify("No se ha podido acceder a la información de su posición.");
				  break;
				case objPositionError.TIMEOUT:
          notificator.notify("El servicio ha tardado demasiado tiempo en responder.");
				  break;
				default:
          notificator.notify("Error desconocido.");
			}
		}, {
			maximumAge: 75000,
			timeout: 15000
		});
	}
	else{
		 notificator.notify('No se ha podido establecer su localización');
	}
}
export default GeoLocationTool;  