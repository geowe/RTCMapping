import ol from 'ol/index';
import Control from 'ol/control/control';


var ZoomLevelControl = function(opt_options) {

  var options = opt_options || {};  
  this.zoomElement = document.createElement('div');  
  this.zoomElement.className = 'rtcm-zoom-level';     

  Control.call(this, {
    element: this.zoomElement,
    target: options.target
  });
};

ol.inherits(ZoomLevelControl, Control);

ZoomLevelControl.prototype.setMap = function(map) {  
    Control.prototype.setMap.call(this, map);
    var this_ = this;
    map.on("moveend", function() {
        var zoom = map.getView().getZoom(); 
        var zoomInfo = 'Zoom: ' + zoom;
        this_.zoomElement.innerHTML= zoomInfo;        
    });
}

export default ZoomLevelControl;