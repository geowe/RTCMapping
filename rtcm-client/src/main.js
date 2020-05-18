import 'ol/ol.css';
import 'jquery.tabulator/dist/css/tabulator_modern.min.css';

import './css/mapskin.css';
import './css/cursor.css';
import './css/icon.css';

import './css/w3.css';
import './css/w3-theme-blue.css';
import './css/app.css';
import './css/measureTooltip.css';

import htmlView from './view/view.html';
import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import TileWMS from 'ol/source/tilewms';

import control from 'ol/control';
import OSM from 'ol/source/osm';
import BingMaps from 'ol/source/bingmaps';
import proj from 'ol/proj';
import ScaleLine from 'ol/control/scaleline';

import AppContext from './org/geowe/rtcmapping/AppContext';
import StyleFactory from './org/geowe/rtcmapping/factory/StyleFactory';
import VectorFactory from './org/geowe/rtcmapping/factory/VectorFactory';
import Sidebar from './view/sidebar';
import ChangeMapVisibilityTool from './org/geowe/rtcmapping/tool/ChangeMapVisibilityTool';
import DocumentTitleControl from './org/geowe/rtcmapping/document/DocumentTitleControl';
import DocumentDownloadControl from './org/geowe/rtcmapping/document/DocumentDownloadControl';
import ZoomLevelControl from './org/geowe/rtcmapping/control/ZoomLevelControl';
import UrlProcessor from './org/geowe/rtcmapping/UrlProcessor';

window.addEventListener("beforeunload", function(e) {
    var confirmationMessage = "\o/";

    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34
});

//FIXME: en pantallas medianas no funciona bien. habría que detectar el dispositivo de otra manera
var device = "mobile";
if (document.documentElement.clientWidth > 480) {
    device = "desktop";
}

document.body.style.cursor = 'progress';
document.getElementById('display').innerHTML = htmlView;

var rtcmapping = {};

rtcmapping.sourceProjection = 'EPSG:4326';
rtcmapping.targetProjection = 'EPSG:3857';

var vectorFactory = new VectorFactory();
var styleFactory = new StyleFactory();
var rtcLayerStyle = styleFactory.getStyle({ strokeColor: 'blue', pointFillColor: "blue" });
var rtcLayer = vectorFactory.getEmptyLayer({ fileName: "empty", style: rtcLayerStyle });

var scaleLineControl = new ScaleLine();
var zoomLevelControl = new ZoomLevelControl();



var controls = control.defaults({
    zoom: false,
    attribution: true,
    attributionOptions: {
        collapsible: false
    }
}).extend([scaleLineControl, zoomLevelControl]);


var osmLayer = new Tile({
    preload: 4,
    source: new OSM()
});

var bingMapLayer = new Tile({
    visible: false,
    preload: Infinity,
    source: new BingMaps({
        key: 'YOUR KEY HERE',
        imagerySet: 'Aerial'
    })
});

var catastroLayer = new Tile({
    title: 'catastro',
    source: new TileWMS({
        url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx',
        params: {
            'LAYERS': 'catastro',
            'SRS': 'EPSG:3857'
        }
    }),
    visible: false
});

rtcmapping.map = new Map({

    target: document.getElementById('map'),
    layers: [
        osmLayer, bingMapLayer, catastroLayer
    ],
    loadTilesWhileAnimating: true,
    controls: controls,
    view: new View({
        center: proj.transform([-4.7, 39.02], rtcmapping.sourceProjection, rtcmapping.targetProjection),
        zoom: 6
    }),
    units: 'm'
});

var defaultExtent = rtcmapping.map.getView().calculateExtent(rtcmapping.map.getSize());

var appContext = new AppContext({ map: rtcmapping.map, vector: rtcLayer, device: device, defaultExtent: defaultExtent });
rtcmapping.map.addLayer(rtcLayer);


setTimeout(function() {
    rtcmapping.map.updateSize();
    document.body.style.cursor = 'auto';
}, 200);

//TODO: Podría ir al ToolConfigurator
var changeMapVisibilityTool = new ChangeMapVisibilityTool(rtcLayer, osmLayer, catastroLayer, bingMapLayer);
var sidebar = new Sidebar();


var documentTitleControl = new DocumentTitleControl({ id: 'docTitle' }, appContext);
var documentDownloadControl = new DocumentDownloadControl({ id: 'downloadMap', vector: rtcLayer });


//URL PARAM Processor
var urlProcessor = new UrlProcessor({ map: rtcmapping.map, device: device, appContext: appContext });

/*rtcmapping.map.getView().on('propertychange', function(e) {
    switch (e.key) {
        case 'resolution':
            //console.log(e.oldValue);
            //rtcmapping.map.updateSize();
            rtcLayer.getSource().changed();
            break;
    }
});*/

export default rtcmapping;
