import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';

import Select from 'ol/interaction/select';

import condition from 'ol/events/condition';
import Vector from 'ol/layer/vector';
import StyleFactory from '../factory/StyleFactory'


/**
 * @classdesc
 * Herramienta responsable de mostrar el tooltip del elemento del mapa
 * @constructor
 * @param {options} options
 * @param {String} options.id - Nombre de la herramienta
 * @param {String} options.cursor - Icono del puntero del ratón
 * @param {ol.vectorSource} options.vectorSource - capa de edición
 */
var ToolTipTool = function(options) {

    this.id = options.id;
    this.cursor = options.cursor;
    this.vectorSource = options.vectorSource;

    var selectStyle = new StyleFactory().selectStyle();

    this.selectClick = new Select({
        condition: condition.click,
        style: selectStyle
    });

    this.selectClick.setActive(false);
    var this_ = this;

    this.selectClick.on('select', function(e) {
        
        //TODO: traer el popup overlay del mapa y mostralo
        //https://openlayers.org/en/v4.6.5/examples/overlay.html
        //https://openlayers.org/en/v4.6.5/apidoc/ol.Overlay.html
        var coordinate = e.mapBrowserEvent.coordinate;
        this_.popup = this_.map.getOverlayById('popup');
        
        if(this_.popup){
            var element = this_.popup.getElement();        
        }
        
        if(e.selected.length < 1){
            console.log('NO HAS PULSADO FEATURE');    
            this_.popup.setPosition(undefined);
        }else{
            //TODO: CREAR EL HTML PARA EL POPUP
            this_.popup.setPosition(coordinate);
           
            var feature = e.selected[0];
            var imgHTML = ToolTipTool.prototype.getImgHtml.call(this_,feature);
            var contentHTML = ToolTipTool.prototype.getContentHtml.call(this_,feature);
            element.innerHTML = imgHTML + contentHTML;
            
        }
        ///
        this_.selectedFeatures = e.selectedFeatures;
        ToolTipTool.prototype.confirmFeatures.call(this_, e.selected, this_.vectorSource, this_.getMap());
        
    });
   
    BaseTool.call(this, {
        id: this.id,
        cursor: this.cursor,
        controls: [this.selectClick]
    });

};

ol.inherits(ToolTipTool, BaseTool);

ToolTipTool.prototype.clearSelectedFeatures = function() {
    this.selectedFeatures = this.selectClick.getFeatures();
    this.selectClick.getFeatures().clear();
    if(this.popup){
        this.popup.setPosition(undefined);
    }    
}

ToolTipTool.prototype.getImgHtml = function(feature) {
    var imgElement = '';
    if(feature.get('img-url')){
        imgElement = '<a href="'+feature.get('img-url')+'" target="_blank">'
        +'<img src="'+feature.get('img-url')+'" width="95%" height="auto"></a>'
    }
    return imgElement;    
}

ToolTipTool.prototype.getContentHtml = function(feature) {
    var propKey = feature.getKeys();
    
    var contentElement = '<div class="w3-container w3-center">';
    propKey.forEach(function(p){
        if(p !== 'geometry' && p !== 'shared' 
            && p !== 'nick' && p !== 'img-url'){
            contentElement +=  '<p class="w3-small">'+feature.get(p)+'</p>';
        }
        
    });
    contentElement += '</div>';
    
    return contentElement;    
}

ToolTipTool.prototype.confirmFeatures = function(features, vectorSource, map) {

    this.numFeatures = (features.length == undefined ? features.getLength() : features.length);

    this.features = features;

}


ToolTipTool.prototype.setActive = function(enabled) {
    BaseTool.prototype.setActive.call(this, enabled);
    this.clearSelectedFeatures();
}

export default ToolTipTool;