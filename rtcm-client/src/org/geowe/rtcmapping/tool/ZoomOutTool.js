import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';

var ZoomOutTool = function(param) {

    this.map = param.map;

    this.button = document.getElementById(param.id);
    _ol_events_.listen(this.button, _ol_events_EventType_.CLICK,
        this.zoom, this);

};

ZoomOutTool.prototype.zoom = function() {

    var view = this.map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom - 1);
}



export default ZoomOutTool;