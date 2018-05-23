import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import OSM from 'ol/source/osm';
import _ol_source_OSM_ from 'ol/source/osm';

/**
 * @classdesc
 * Herramienta responsable de cambiar la visibilidad de las capas
 * @constructor
 * @param {ol.Vector} rtcLayer 
 * @param {ol.OSM} osmLayer
 * @param {ol.layer.tile} catastroLayer
 * @param {ol.source.BingMaps} bingMapLayer 
 */
var ChangeMapVisibilityTool = function(rtcLayer, osmLayer, catastroLayer, bingMapLayer) {      
    
    this.rtcLayer = rtcLayer;
    this.osmLayer = osmLayer;
    this.catastroLayer = catastroLayer;
    this.bingMapLayer = bingMapLayer;
    
    this.showHideOSMBtn = document.getElementById('showHideOSMBtn');    
    _ol_events_.listen(this.showHideOSMBtn, _ol_events_EventType_.CLICK,
      this.changeOSM, this);
    
    this.showHideMyMapBtn = document.getElementById('showHideMyMapBtn');
    _ol_events_.listen(this.showHideMyMapBtn, _ol_events_EventType_.CLICK,
        this.changeMyMap, this);
    
    this.showHideCatastroBtn = document.getElementById('showHideCatastroBtn');
    _ol_events_.listen(this.showHideCatastroBtn, _ol_events_EventType_.CLICK,
        this.changeCatastro, this);

    this.showHideBingMapBtn = document.getElementById('showHideBingMapBtn');
    _ol_events_.listen(this.showHideBingMapBtn, _ol_events_EventType_.CLICK,
        this.changeBingMap, this);    

}

ChangeMapVisibilityTool.prototype.changeMyMap = function() {  
  var isVisible = changeVisibility(this.rtcLayer);	
  changeBtnOpacity(this.showHideMyMapBtn, isVisible);  
}

ChangeMapVisibilityTool.prototype.changeOSM = function() {  
  var isVisible = changeVisibility(this.osmLayer);	
  changeBtnOpacity(this.showHideOSMBtn, isVisible);
}

ChangeMapVisibilityTool.prototype.changeCatastro = function() {  
  var isVisible = changeVisibility(this.catastroLayer);	
  changeBtnOpacity(this.showHideCatastroBtn, isVisible);
}

ChangeMapVisibilityTool.prototype.changeBingMap = function() {  
  var isVisible = changeVisibility(this.bingMapLayer);	
  changeBtnOpacity(this.showHideBingMapBtn, isVisible);
}

var changeBtnOpacity = function(btn, isVisible) {  
  if(isVisible){
    btn.style.opacity = "1.0";
  }else{
    btn.style.opacity = "0.3";
  }
}

var changeVisibility = function(layer) { 
  if(layer.getVisible() == true){
    layer.setVisible(false);	
  }else{      
    layer.setVisible(true);		
  } 
  return layer.getVisible();
}

export default ChangeMapVisibilityTool;