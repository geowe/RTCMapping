import io from 'socket.io-client';
import SharedUrlGenerator from './SharedUrlGenerator';
import Notificator from '../../../view/notificator';
import FeatureMapper from './factory/FeatureMapper';
import { RteOperation } from "./RteOperation";
/**
 * @classdesc
 * Representa el motor de comunicación en tiempo real.
 * Responsable de enviar y recibir mensajes en tiempo real.
 *
 * @constructor
 * @param {options} Options 
 * @param {org.geowe.rtcmapping.AppContext} options.appContext -
 * @api
 */
var RealTimeEngine = function(options) {

    this.appContext = options.appContext;
    this.map = options.map;
    this.device = options.device;
    this.vectorSource = options.vectorSource;
    this.socket = io.connect();
    this.nick = 'no-nick';
    this.statusLabel = document.getElementById('statusLabel');
    this.colaboratorsLabel = document.getElementById('colaboratorsLabel');
    this.counterMessageDefault = document.getElementById('counter-' + this.device).innerText;
}

/**
 * Indica si el motor en tiempo real está conectado
 * @returns {boolean} - true: conectado
 */
RealTimeEngine.prototype.isConnected = function() {
    return (this.socket !== undefined && this.socket.connected);
}

/**
 * Conecta el motor en tiempo real para enviar y recibir mensajes de los colaboradores
 */
RealTimeEngine.prototype.connect = function() {    
    //Especificar la ip y puerto del servidor
    this.socket = io('http://127.0.0.1:3000/rtcm');    
    this.listen();
}

/**
 * Desconecta del motor en tiempo real. Dejará de enviar y recibir mensajes.
 */
RealTimeEngine.prototype.disconnect = function() {
    var room = this.appContext.getRoom();
    this.socket.emit('leaveRoom', room);
    this.socket.disconnect();
}

/**
 * Establece la habitación de edición
 * @param {String} room 
 */
RealTimeEngine.prototype.setRoomToJoin = function(room) {
    this.appContext.setRoom(room);
}

/**
 * emite data al resto de colaboradores
 * @param {String} operation -operacion a realizar ()
 * @param {String} data - geojson
 */
RealTimeEngine.prototype.emit = function(operation, data) {
    this.socket.emit(operation, { geojson: data, room: this.appContext.getRoom() });
}

/**
 * emite el atributo alfanumerico modificado al resto de colaboradores
 * @param {String} featureId - identificador del elemento a modificar
 * @param {String} attributeName - nombre del atributo a modificar
 * @param {String} attributeValue - valor del atributo a modificar
 */
RealTimeEngine.prototype.emitAttributeNewValue = function(featureId, attributeName, attributeValue) {
    this.socket.emit(RteOperation.INFO_TOOL, { featureId: featureId, column: attributeName, value: attributeValue, room: this.appContext.getRoom() });
}

/**
 * emite el Nombre el nuevo atributo alfanumerico modificado al resto de colaboradores 
 * @param {String} attributeName - nombre del nuevo atributo
 */
RealTimeEngine.prototype.emitNewAttribute = function(attributeName) {
    this.socket.emit(RteOperation.NEW_ATTRIBUTE, { newColumn: attributeName, room: this.appContext.getRoom() });
}

/**
 * emite el título del mapa modificado al resto de colaboradores 
 * @param {String} title - Título del mapa
 */
RealTimeEngine.prototype.emitTitle = function(title) {
    this.socket.emit(RteOperation.DOC_TITLE, { title: title, room: this.appContext.getRoom() });
}


/**
 * Elimina un elemento de todos los colaboradores
 * @param {String} featureId 
 */
RealTimeEngine.prototype.delete = function(featureId) {
    this.socket.emit(RteOperation.DELETE, { featureId: featureId, room: this.appContext.getRoom() });
}

/**
 * Escucha mensajes de los colaboradores
 */
RealTimeEngine.prototype.listen = function() {
    var appContext = this.appContext;
    var featureInfoTool = appContext.getTool('infoTool');
    var button = document.getElementById('shareTool-' + this.device);
    var source = this.vectorSource;
    var status = this.statusLabel;
    var colaborators = this.colaboratorsLabel;
    var map = this.map;
    var isOwner = this.appContext.getIsOwner();
    var this_ = this;

    this.socket.on(RteOperation.CONNECT, function(msg) {
        appContext.setSocket(this_.socket);
        if (button.id == 'shareTool-desktop') {
            button.innerHTML = '<i class="icon-check-circle"></i> Desconectar';
        } else {
            button.innerHTML = '<i class="icon-check-circle"></i>';
        }
        status.innerHTML = '<i class="icon-check-circle"></i> Conectado';
        status.style.opacity = "1.0"
    });

    this.socket.on(RteOperation.DISCONNECT, function() {
        if (button.id == 'shareTool-desktop') {
            button.innerHTML = '<i class="icon-group-add"></i> Reconectar';
        } else {
            button.innerHTML = '<i class="icon-group-add"></i>';
        }

        document.getElementById("counter-" + this_.device).innerHTML = this_.counterMessageDefault;
        statusLabel.innerHTML = 'No Conectado';
        status.style.opacity = "0.3";
        colaborators.innerHTML = '<i class="icon-group"></i> Conectados: 0';
        colaborators.style.opacity = "0.3";
    });

    this.socket.on(RteOperation.COUNTER, function(data) {
        document.getElementById("counter-" + this_.device).innerHTML = '<i class="icon-group"></i> ' + data.count + ' usuarios conectados ';
        colaborators.innerHTML = '<i class="icon-group"></i> Conectados: ' + data.count;
        colaborators.style.opacity = "1.0";
      
      if(isOwner){
        var features = source.getFeatures();
        features.forEach(function(feature) {
          if(feature.get('shared')){
            var geojson = new FeatureMapper(appContext).toGeojson(feature);                   
            this_.emit(RteOperation.DRAW, geojson); 
          }     
        });
      }
    });

    this.socket.on(RteOperation.NICK, function(data) {
        if (this_.nick === 'no-nick') {
            this_.nick = data.nick
        }
        this_.socket.nick = this_.nick;

        if (button.id == 'shareTool-desktop') {
            button.innerHTML = '<i class="icon-check-circle"></i> Desconectar <font size="2">(' + this_.nick + ')</font>';
        } else {
            button.innerHTML = '<i class="icon-check-circle"></i>';
            status.innerHTML = '<i class="icon-check-circle"></i> Conectado: <font size="2">(' + this_.nick + ')</font>';
        }

        var room = joinToRoom();
        showUrlToShare(this_.nick, room);
    });

    function joinToRoom() {
        var room = appContext.getRoom();
        if (room === undefined) {
            room = this_.socket.nick + '_' + Date.now();
            appContext.setRoom(room);
        }
        this_.socket.emit('room', room);
        return room;
    }

    function showUrlToShare(nick, room) {
        if (isOwner) {
            var urlGenerator = new SharedUrlGenerator({
                nick: nick,
                room: room,
                center: map.getView().getCenter(),
                zoom: map.getView().getZoom()
            });
            var url = urlGenerator.generate();

            urlGenerator.show(url.href);
        }
    }

    this.socket.on(RteOperation.DRAW, function(geojson) {
      var f = buildFeature(geojson);
      if(source.getFeatureById(f.getId()) == null){
        source.addFeature(f);      
        featureInfoTool.updateGrid();
      }      
    });

    this.socket.on(RteOperation.DOC_TITLE, function(title) {
        var documentTitle = document.getElementById('docTitle')
        documentTitle.value = title;
    });

    this.socket.on(RteOperation.DELETE, function(featureId) {
        console.log('DELETE FEATURE: ' + featureId);
        source.removeFeature(source.getFeatureById(featureId));

        featureInfoTool.updateGrid();
        new Notificator().notify('Se ha eliminado el elemento: ' + featureId);
    });

    this.socket.on(RteOperation.MODIFY, function(geojson) {
        var receivedFeature = buildFeature(geojson);
        var featureToModify = source.getFeatureById(receivedFeature.getId());
        featureToModify.setGeometry(receivedFeature.getGeometry());
        featureToModify.set('nick', receivedFeature.get('nick'));

        source.removeFeature(source.getFeatureById(featureToModify.getId()));
        source.addFeature(buildFeature(new FeatureMapper(appContext).toGeojson(featureToModify)));

        new Notificator().notify('Se ha Modificado el elemento: ' + receivedFeature.getId());
    });

    function buildFeature(geojson) {
        return new FeatureMapper(appContext).toReceivedFeature(geojson);
    }

    this.socket.on(RteOperation.INFO_TOOL, function(featureId, column, value) {
        var features = source.getFeatures();

        features.forEach(function(feature) {
            if (feature.getId() == featureId) {
                feature.set(column, value);
            }
        })

        featureInfoTool.updateGrid();
        new Notificator().notify('Se ha modificado alfanuméricamente el elemento: ' + featureId);
    });

    this.socket.on(RteOperation.NEW_ATTRIBUTE, function(newColumn) {
        var features = source.getFeatures();

        features.forEach(function(feature) {
            feature.set(newColumn, "");
        })

        featureInfoTool.updateGrid();
        new Notificator().notify('Se ha añadido un nuevo atributo a la capa de trabajo: ' + newColumn);
    });
}

export default RealTimeEngine;
