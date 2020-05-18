import SelectTool from './tool/SelectTool';
import ZoomToExtentTool from './tool/ZoomToExtentTool';
import ZoomInTool from './tool/ZoomInTool';
import ZoomOutTool from './tool/ZoomOutTool';
import PanTool from './tool/PanTool';
import DrawTool from './tool/DrawTool';
import ModifyTool from './tool/ModifyTool';
import MeasureTool from './tool/MeasureTool';
import ShareTool from './tool/ShareTool';
import DeleteTool from './tool/DeleteTool';
import FeatureInfoTool from './tool/FeatureInfoTool';
import BufferTool from './tool/BufferTool';
import OsmNominatimTool from './tool/OsmNominatimTool';
import proj from 'ol/proj';
import AddMapsTool from './tool/AddMapsTool';
import Rte from './RealTimeEngine';
import GeoLocationTool from './tool/GeoLocationTool';
import ToolTipTool from './tool/ToolTipTool';

/**
 * @classdesc
 * Representa el contexto de la aplicación.
 * Responsable de la inicialización de herramientas y ofrecer acceso al mapa
 * capa de edición, etc.
 *
 * @constructor
 * @param {options} Options 
 * @param {ol.map} options.map - rtcmapping.map (ol.map)
 * @param {ol.layer.vector} options.vector - capa vectorial de edición
 * @param {string} options.device - dispositivo ('desktop' o 'mobile')
 * @api
 */
var AppContext = function(options) {
    this.map = options.map;
    this.vector = options.vector;
    this.device = options.device;
    this.defaultExtent = options.defaultExtent;
    this.tools = {};
    this.isOwner = true;

    this.andaluciaExtent = proj.transformExtent([-8.325127967227985, 35.85086917018272, -0.8214658591970898, 38.87573614187987],
        'EPSG:4326', 'EPSG:3857');
    this.initTools();
    this.initRte();
};

/**
 * Inizializa las herramientas
 */
AppContext.prototype.initTools = function() {

    this.clearTool();
    this.attachTool(new PanTool({ id: "panTool", cursor: "grabbing" }));
    this.attachTool(new ZoomToExtentTool({ id: "zoomToExtentTool", vectorSource: this.vector.getSource(), defaultExtent: this.defaultExtent }));
    var zoomInTool = new ZoomInTool({ id: "zoomInTool", map: this.map });
    var zoomOutTool = new ZoomOutTool({ id: "zoomOutTool", map: this.map });

    this.attachTool(new DrawTool({ id: "drawPointTool", cursor: "cell", type: 'Point', vectorSource: this.vector.getSource() }));
    this.attachTool(new DrawTool({ id: "drawLineTool", cursor: "cell", type: 'LineString', vectorSource: this.vector.getSource() }));
    this.attachTool(new DrawTool({ id: "drawPolygonTool", cursor: "cell", type: 'Polygon', vectorSource: this.vector.getSource() }));
    this.attachTool(new DrawTool({ id: "freeDrawLineTool", cursor: "cell", type: 'LineString', vectorSource: this.vector.getSource(), freeHand: true }));
    this.attachTool(new DrawTool({ id: "freeDrawPolygonTool", cursor: "cell", type: 'Polygon', vectorSource: this.vector.getSource(), freeHand: true }));
    this.attachTool(new ModifyTool({ id: "modifyTool", cursor: "cell", vectorSource: this.vector.getSource() }));
    this.attachTool(new SelectTool({ id: "selectTool", cursor: "alias", vectorSource: this.vector.getSource() }));
    this.attachTool(new MeasureTool({ id: "measurePolygonTool", type: 'Polygon' }));
    this.attachTool(new MeasureTool({ id: "measureDistanceTool", type: 'LineString' }));
    this.attachTool(new DeleteTool({ id: "deleteTool", cursor: "crosshair", vectorSource: this.vector.getSource() }));
    this.attachTool(new ShareTool({ id: "shareTool-" + this.device, device: this.device, vectorSource: this.vector.getSource() }));
    this.attachTool(new FeatureInfoTool({ id: "infoTool", vectorSource: this.vector.getSource() }));
    this.attachTool(new BufferTool({ id: "bufferTool", vectorSource: this.vector.getSource() }));
    this.attachTool(new OsmNominatimTool({ id: "searchInput", vectorSource: this.vector.getSource() }));
    this.attachTool(new GeoLocationTool({ id: "findMe", vectorSource: this.vector.getSource() }));
    this.attachTool(new ToolTipTool({ id: "toolTipTool", cursor: "crosshair", vectorSource: this.vector.getSource() }));
    
    new AddMapsTool(this.map, this.vector.getSource(), this);

}

/**
 * Inicializa el motor de comunicación en tiempo real
 */
AppContext.prototype.initRte = function() {
    var this_ = this;
    this.rte = new Rte({
        appContext: this_,
        map: this_.map,
        vectorSource: this_.vector.getSource(),
        device: this_.device
    });
}

/**
 * Adjunta la herramienta
 * @param {org.geowe.rtcmapping.BaseTool} tool - Herramienta a adjuntar
 */
AppContext.prototype.attachTool = function(tool) {

    this.tools[tool.getName()] = tool;

    if (tool.defaultTool) {
        this.defaultTool = tool;
        this.activatedTool = tool;
        this.changeCursor();
    }
    tool.onLoad(this.getMap(), this);
}

/**
 * Establece si la sesión pertenece al creador (propietario) del mapa
 * @param {boolean} isOwner - indica si ha accedido el creador del mapa (propietario).
 */
AppContext.prototype.setIsOwner = function(isOwner) {
    this.isOwner = isOwner;
}

/**
 * Indica si la sesión es del creador del mapa.
 * @returns {boolean} -true: es el creador del mapa
 */
AppContext.prototype.getIsOwner = function() {
    return this.isOwner;
}

/**
 * Obtiene una herramienta según su nombre
 * @param {String} buttonName - Nombre de la herramienta
 * 
 * @returns {org.geowe.rtcmapping.BaseTool} - herramienta
 */
AppContext.prototype.getTool = function(toolName) {
    return this.tools[toolName];
}

/**
 * Desactiva todas las herramientas
 */
AppContext.prototype.clearTool = function() {
    for (var toolName in this.tools) {
        var tool = this.tools[toolName];
        tool.setActive(false);
    }

    this.tools = {};
}

/**
 * Activa la herramienta indicada
 * @param {org.geowe.rtcmapping.BaseTool} selectedTool - Herramienta a activar 
 */
AppContext.prototype.activeTool = function(selectedTool) {

    var changeStatus = false;
    for (var toolName in this.tools) {
        var tool = this.tools[toolName];

        if (selectedTool.getName() == toolName) {
            changeStatus = !selectedTool.isActive();
            tool.setActive(changeStatus);
        } else {
            tool.setActive(false);
        }
    }

    if (!changeStatus) {
        this.activatedTool = this.defaultTool;
        this.defaultTool.setActive(true);
    } else {
        this.activatedTool = selectedTool;
    }

    this.changeCursor();
}

/**
 * Cambia el cursor (puntero del ratón)
 */
AppContext.prototype.changeCursor = function() {
    var map = this.getMap();

    var cursor = this.activatedTool.cursorHoverStyle;
    map.on('pointermove', function(e) {
        if (e.dragging) {
            return;
        }
        map.getTarget().style.cursor = cursor;
    });
}

/**
 * Obtiene el mapa (rtcmapping.map - ol.map)
 * @returns {ol.map} 
 */
AppContext.prototype.getMap = function() {
    return this.map;
}

/**
 * Establece el socket de conexión con el motor de tiempo real
 * @param {io.socket} socket - socket de conexión con el motor de tiempo real
 */
AppContext.prototype.setSocket = function(socket) {
    this.socket = socket;
}

/**
 * Obtiene el socket de conexión con el motor de tiempo real
 * @returns {io.socket} - socket
 */
AppContext.prototype.getSocket = function() {
    return this.socket;
}

/**
 * Establece la habitación para la edición en tiempo real
 * @param {String} room - nombre de la habitación de edición
 */
AppContext.prototype.setRoom = function(room) {
    this.room = room;
}

/**
 * Obtiene la habitación para la edición en tiempo real
 * @returns {String} - nombre de la habitación de edición
 */
AppContext.prototype.getRoom = function() {
    return this.room;
}


/**
 * Obtiene la instancia del motor de comunicación en tiempo real
 * @returns {org.geowe.rtcmapping.RealTimeEngine}
 */
AppContext.prototype.getRte = function() {
    return this.rte;
}

export default AppContext;