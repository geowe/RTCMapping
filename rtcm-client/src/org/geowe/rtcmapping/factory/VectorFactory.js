import Vector from 'ol/layer/vector';
import SourceVector from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';

var VectorFactory = function() {

}


VectorFactory.prototype.getEmptyLayer = function(options) {
	var fileName = options.fileName;
	var style = options.style;
	var source = new SourceVector();	
	var vectorLayer = new Vector({
		    source: source,
		    style:style		    
	});

    vectorLayer.set('name', fileName);
    return vectorLayer;
}	

VectorFactory.prototype.getFile = function(options, onLoad) {

	var fileName = options.fileName;
	var style = options.style;
	var field = options.field;
	var projection = options.projection;
	var field = options.field;
	var url = options.url;

	var source = new SourceVector();

		fetch(url + fileName).then(function(response) {
        return response.json();
      }).then(function(json) {
        var format = new GeoJSON();
        var features = format.readFeatures(json, {featureProjection: "EPSG:3857"});

        source.addFeatures(features);
       (onLoad !== undefined) ?  onLoad() : '';  
              
      });


    var vectorLayer = new Vector({
		    source: source,

		    style: function(feature) {
	          style.getText().setText(feature.get(field));
	          return style;
	        }
		    
	});


    vectorLayer.set('name', fileName);
    return vectorLayer;
	//awm.map.addLayer(vectorLayer); 
		
    }      

export default VectorFactory;