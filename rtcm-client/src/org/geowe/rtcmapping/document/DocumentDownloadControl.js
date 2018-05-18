
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import GeoJSON from 'ol/format/geojson';
import Map from 'ol/map';
import ol from 'ol/index';


var DocumentDownloadControl = function(options) {
  
  this.anchor = document.getElementById(options.id);
  this.vector = options.vector;   

  _ol_events_.listen(this.anchor, _ol_events_EventType_.CLICK,
    this.handle_, this);
};

DocumentDownloadControl.prototype.handle_ = function() {      
    var geojson_formatter = new GeoJSON();

    var featuresToDownload = [];    
    var featureCollection = this.vector.getSource().getFeatures();

    featureCollection.forEach(function(feature) {
        var f = feature.clone();
        //TODO: Eliminar posibles metadatos internos de las features
        //delete f.attributes["featureMember"];
        featuresToDownload.push(f);
    });
        
    this.anchor.href = "data:application/json;charset=UTF-8,"  + 
        encodeURIComponent(geojson_formatter.writeFeatures(featuresToDownload, 
          {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'}));  
  }
    
  export default DocumentDownloadControl;  