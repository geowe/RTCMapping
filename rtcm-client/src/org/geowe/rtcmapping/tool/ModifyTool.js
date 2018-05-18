import BaseTool from './BaseTool';
import FeatureMapper from '../factory/FeatureMapper'
import StyleFactory from '../factory/StyleFactory';
import Map from 'ol/map';
import ol from 'ol/index';
import GeoJSON from 'ol/format/geojson';
import Modify from 'ol/interaction/modify';
import Snap from 'ol/interaction/snap';
import { RteOperation } from "../RteOperation";

/**
 * @classdesc
 * Herramienta encargada de modificar la geometría de un feature.
 * @param {string} options 
 * @param {String} options.id - Nombre de la herramienta
 * @param {String} options.cursor - Puntero del ratón
 * @param {ol.vectorSource} options.vectorSource - capa de edición
 */
var ModifyTool = function(options) {
    
  this.id = options.id;
  this.cursor = options.cursor;
  this.vectorSource = options.vectorSource;
  this.modifyTool = new Modify({source: this.vectorSource});        
  var styleFactory = new StyleFactory();  

  this.modifyTool.on('modifyend', function(e) {
    
    var nick = this.getNick();    
    this.rte = this.getAppContext().getRte();
    if(this.rte.isConnected()) {   
      
      //Te devuelve todos los features de la capa 
      var features = e.features.getArray();      
      var currentFeature;      
      features.forEach(function(element) {        
        var modified = element.get('modified');
        var shared = element.get('shared');
        if(modified && shared){      
          currentFeature = element;          
        }
      });
      
      if(currentFeature !== undefined){        
        
        var featureMapper = new FeatureMapper(this.getAppContext());
        featureMapper.toSendedFeature(currentFeature, nick);
        var geojson = featureMapper.toGeojson(currentFeature);
        
        this.rte.emit('modifyTool', geojson);
        
        currentFeature.set(RteOperation.MODIFY,false, true);        
      }
    }
  }, this);  
  

  this.modifyTool.setActive(false);

  this.snap = new Snap({source: this.vectorSource});
  this.snap.setActive(false);

  BaseTool.call(this, {    
    
    id: this.id,      
    cursor: this.cursor,
    controls: [this.modifyTool, this.snap]

  });

};

ol.inherits(ModifyTool, BaseTool);

export default ModifyTool;  