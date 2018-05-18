import GeoJSON from 'ol/format/geojson';
import StyleFactory from '../factory/StyleFactory';

/**
 * @classdesc
 * Responsable de realizar transformaciones en una feature/geojson para usarla en RTCMapping
 *
 * @constructor
 * @param {org.geowe.rtcmapping} appContext.
 * @api
 */
var FeatureMapper = function(appContext) {  
  this.appContext = appContext;
    
};

/**
 * Rellena los atributos de un feature antes de compartirlo: ID, nick, shared
 * Añade el evento onChange al feature, para que marque cuando se modifica (atributo modified=true)
 * @param {ol.feature} feature 
 */
FeatureMapper.prototype.fillFeature = function(feature){
    if(feature.getId() === undefined){
        feature.setId('not-shared_'+Date.now());
    }
    feature.set('nick','no-nick');
    feature.set('shared',false);

    feature.on('change', function(e){        
        e.target.set('modified',true,true);      
    }, this);
}

/**
 * Obtiene las features de un GeoJSON (WGS84)
 * @param {ol.formta.geojson} layerGeojson GeoJSON correspondiente a una capa.
 * @returns features extraidas del GeoJSON
 */
FeatureMapper.prototype.getFeatures = function(layerGeojson){
    var olFormat = new GeoJSON();       
    return olFormat.readFeatures(layerGeojson, {dataProjection: 'EPSG:4326',featureProjection:'EPSG:3857'});
}

/**
 * Transforma un feature para ser enviada
 * @param {ol.feature} feature feature a enviar
 * @param {String} nick nick identificador del que envía
 * @returns el propio feature
 */
FeatureMapper.prototype.toSendedFeature = function(feature, nick){
    if(feature.getId() === undefined || ~feature.getId().indexOf('not-shared_')){
        feature.setId(nick+'_'+Date.now());  
    }
    feature.setProperties({'nick':nick, 'shared':true, 'modified':false})   
    var styleFactory = new StyleFactory();
    var style = styleFactory.getShareStyle({strokeColor: "green", pointFillColor: "green", nick: nick});
    feature.setStyle(styleFactory.selectableStyle(style, this.appContext.getTool('selectTool').getFeatures()));

    return feature;
}

/**
 * Transforma un geojson recibido a un feature.
 * @param {String} geojson 
 * @returns feature
 */
FeatureMapper.prototype.toReceivedFeature = function(geojson){
    var olFormat = new GeoJSON(); 
    var feature = olFormat.readFeature(geojson);
    var styleFactory = new StyleFactory();
    var style = styleFactory.getShareStyle({strokeColor: "red", pointFillColor: "red",
                nick: feature.get("nick")});      
    feature.set('modified',false,true);    
    
    var selectTool = this.appContext.getTool('selectTool');
    feature.setStyle(styleFactory.selectableStyle(style, selectTool.getFeatures()));
    
    feature.on('change', function(e){
    e.target.set('modified',true,true);      
    }, this);
    
    return feature;  
}

/**
 * Transforma un feature a Geojson (no reproyecta)
 * @param {ol.feature} feature 
 * @returns geojson del feature
 */
FeatureMapper.prototype.toGeojson = function(feature){
    var olFormat = new GeoJSON(); 
    return olFormat.writeFeature(feature);
}

export default FeatureMapper;  