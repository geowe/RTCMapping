import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';

import Select from 'ol/interaction/select';
import DragBox from 'ol/interaction/dragbox';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import condition from 'ol/events/condition';
import Vector from 'ol/layer/vector';
import StyleFactory from '../factory/StyleFactory';

/**
 * @classdesc
 * Herramienta de Selección. Selecciona uno o varios elementos del mapa
 * @constructor
 * @param {options} options 
 * @param {String} options.id - Nombre de la herramienta
 * @param {String} options.cursor - Puntero del ratón
 * @api
 */
var SelectTool = function(options) {

    this.id = options.id;
    this.cursor = options.cursor;
    this.vectorSource = options.vectorSource;
    var this_ = this;
    var selectStyle = new StyleFactory().selectStyle();

    this.selectClick = new Select({
        condition: condition.click,
        style: selectStyle
    });


    /*this.selectClick.on('select', function(e) {

        this_.vectorSource.dispatchEvent('change');

    });*/

    this.selectClick.setActive(false);

    this.dragBox = new DragBox({
        condition: condition.primaryAction
    });

    var selectedFeatures = this.selectClick.getFeatures();
    this.dragBox.on('boxend', function() {

        var extent = this.getGeometry().getExtent();

        this.getMap().getLayers().forEach(function(layer) {

            if (layer instanceof Vector) {

                layer.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
                    selectedFeatures.push(feature);
                });
            }

        });
    });



    this.dragBox.on('boxstart', function() {
        selectedFeatures.clear();
    });
    this.dragBox.setActive(false);


    BaseTool.call(this, {

        id: this.id,
        cursor: this.cursor,
        controls: [this.selectClick, this.dragBox]

    });

};

ol.inherits(SelectTool, BaseTool);

SelectTool.prototype.setActive = function(enabled) {
    BaseTool.prototype.setActive.call(this, enabled);
    this.selectClick.getFeatures().clear();
}

SelectTool.prototype.getFeatures = function() {
    return this.selectClick.getFeatures();
}


export default SelectTool;