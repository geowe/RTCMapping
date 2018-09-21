import BaseTool from './BaseTool';
import Map from 'ol/map';
import ol from 'ol/index';
import Draw from 'ol/interaction/draw';
import GeoJSON from 'ol/format/geojson';
import StyleFactory from '../factory/StyleFactory';
import Snap from 'ol/interaction/snap';
import { RteOperation } from "../RteOperation";
/**
 * @classdesc
 * Herramienta de dibujo.
 * @constructor
 * @param {options} options
 * @param {String} options.id - Nombre de la herramienta
 * @param {String} options.type - Tipo de la herramientas (Poing, Polygon, LineString)
 * @param {String} options.cursor - Puntero del ratón
 */
var DrawTool = function(options) {

    this.id = options.id;
    this.type = options.type;
    this.cursor = options.cursor;
    this.vectorSource = options.vectorSource;
    this.freeHand = (options.freeHand !== undefined) ? options.freeHand : false;

    var this_ = this;
    this.drawTool = new Draw({
        source: this.vectorSource,
        type: this.type,
        freehand: this.freeHand
    });


    var styleFactory = new StyleFactory();

    this.drawTool.on('drawend', function(e) {

        var currentFeature = e.feature;
        currentFeature.setId('not-shared_' + Date.now());
        currentFeature.setProperties({ 'nick': 'no-nick', 'shared': false });

        this.rte = this.getAppContext().getRte();
        if (this.rte.isConnected()) {
            var nick = this.getNick();
    
            //Propiedades de control
            currentFeature.setId(nick + '_' + Date.now());
            currentFeature.setProperties({ 'nick': nick, 'shared': true });
            currentFeature.set('modified', false, true);            

            var style = styleFactory.getShareStyle({ strokeColor: "green", pointFillColor: "green", nick: nick });
            var selecTool = this.getAppContext().getTool('selectTool');
            currentFeature.setStyle(styleFactory.selectableStyle([styleFactory.getShadowStyle(), style], selecTool.getFeatures()));

            var olFormat = new GeoJSON();
            var geojson = olFormat.writeFeature(currentFeature);

            this.rte.emit(RteOperation.DRAW, geojson);
        }

        //Rellenamos el resto de propiedades definidas por el usuario
        this.fillFeatureProperties(currentFeature);

        e.feature.on('change', function(e) {
            e.target.set('modified', true, true);
        }, this)

    }, this);

    this.vectorSource.on('addfeature', function(e) {
        var infoTool = this_.getAppContext().getTool("infoTool");
        infoTool.updateGrid();
    });

    this.drawTool.setActive(false);

    this.snap = new Snap({ source: this.vectorSource });
    this.snap.setActive(false);

    BaseTool.call(this, {

        id: this.id,
        cursor: this.cursor,
        defaultTool: false,
        controls: [this.drawTool, this.snap]

    });
};

ol.inherits(DrawTool, BaseTool);

DrawTool.prototype.fillFeatureProperties = function(feature) {
    var featureGrid = this.getAppContext().getTool("infoTool").getGrid();
    var columns = featureGrid.getColumns();
    
    columns.forEach(function(column) { 
        if(column.getField() != featureGrid.getIdColumn() 
            && column.getField() != 'nick' 
            && column.getField() != 'shared') {
                
            feature.set(column.getField(), "", true);
        }
    });
}

export default DrawTool;