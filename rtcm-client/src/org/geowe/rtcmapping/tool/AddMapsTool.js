import Map from 'ol/map';
import ol from 'ol/index';
import _ol_events_ from 'ol/events';
import _ol_events_EventType_ from 'ol/events/eventtype';
import GeoJSON from 'ol/format/geojson';
import RTCMModalPanel from '../../../../view/RTCMModalPanel';
import Notificator from '../../../../view/notificator';
import StyleFactory from '../factory/StyleFactory';
import htmlView from '../../../../view/addMapView.html';
import axios from 'axios/index';
import FeatureMapper from '../factory/FeatureMapper';
import { RteOperation } from "../RteOperation";

import Tile from 'ol/layer/tile';
import TileWMS from 'ol/source/tilewms';
/**
 * @classdesc
 * Herramienta responsable de añadir mapas a la aplicación
 * @constructor
 * @param {ol.map} map 
 * @param {ol.vectorSource} vectorSource 
 * @param {org.geowe.rtcmapping.appContext} appContext
 * @api 
 */
var AddMapsTool = function(map, vectorSource, appContext) {

    this.map = map;
    this.vectorSource = vectorSource;
    this.selectTool = appContext.getTool('selectTool');
    this.appContext = appContext;
    this.mode = 'file';
    this.featureMapper = new FeatureMapper(appContext);

    this.addMapsBtn = document.getElementById("addMaps");
    _ol_events_.listen(this.addMapsBtn, _ol_events_EventType_.CLICK,
        this.showAddMapsDialog, this);
};

//TODO: este metodo ira a addMapView.js en View
AddMapsTool.prototype.showAddMapsDialog = function() {

    var inputForm = document.createElement('div');
    inputForm.innerHTML = htmlView.trim();

    this.fileUPloadPanel = new RTCMModalPanel({
        parent: this,
        maxWidth: "90%",
        title: "   Añadir Mapas",
        iconTitle: "ms ms-catalog",
        content: '<h3>¿Desde dónde quieres cargar los datos?</h3>',
        htmlObject: inputForm,
        buttons: [
            { name: "Cancelar", event: this.cancel },
            { name: "Aceptar", event: this.aceptar }
        ]
    });

    this.filecheck = document.getElementById('filecheck');
    var this_ = this;
    filecheck.onclick = function(event) {
        //TODO: Extraer método para no repetir
        var tablinks = document.getElementsByClassName("tablink");
        for (var i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" w3-border-blue", "");
        }
        document.getElementById('filetab').className += " w3-border-blue";
        document.getElementById('fileTabContent').style.display = 'block';
        document.getElementById('urlTabContent').style.display = 'none';
        document.getElementById('wmsTabContent').style.display = 'none';
        document.getElementById('share-check').style.display = 'block';
        this_.mode = 'file';
    }

    this.urlcheck = document.getElementById('urlcheck');
    urlcheck.onclick = function(event) {
        //TODO: Extraer método para no repetir  
        var tablinks = document.getElementsByClassName("tablink");
        for (var i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" w3-border-blue", "");
        }

        document.getElementById('urltab').className += " w3-border-blue";
        document.getElementById('fileTabContent').style.display = 'none';
        document.getElementById('urlTabContent').style.display = 'block';
        document.getElementById('wmsTabContent').style.display = 'none';
        document.getElementById('share-check').style.display = 'block';
        this_.mode = 'url';
    }

    this.wmscheck = document.getElementById('wmscheck');
    wmscheck.onclick = function(event) {
        //TODO: Extraer método para no repetir  
        var tablinks = document.getElementsByClassName("tablink");
        for (var i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" w3-border-blue", "");
        }

        document.getElementById('wmstab').className += " w3-border-blue";
        document.getElementById('fileTabContent').style.display = 'none';
        document.getElementById('urlTabContent').style.display = 'none';
        document.getElementById('wmsTabContent').style.display = 'block';
        document.getElementById('share-check').style.display = 'none';
        this_.mode = 'wms';
    }
}

AddMapsTool.prototype.cancel = function() {
    this.fileUPloadPanel.delete();
}

AddMapsTool.prototype.aceptar = function() {

    this.rte = this.appContext.getRte();
    switch (this.mode) {
        case "file":
            var curFiles = document.getElementById('fileInput').files;
            if (curFiles.length === 0) {
                new Notificator().notify('No se han seleccionado archivos');
                return;
            }
            this.loadFile(curFiles[0]);
            break;
        case "url":
            var url = document.getElementById('urlInput').value;
            this.loadUrl(url);
            break;
        case "wms":
            var wmsUrl = document.getElementById('wmsUrlInput').value;            
            this.loadWMS(wmsUrl);
            break;
        default:
            console.log('no ha seleccionado modo');
    }
}


AddMapsTool.prototype.loadFile = function(file) {
    var this_ = this;
    var share = document.getElementById('shareLoadedMap');

    if (file) {

        this.fileUPloadPanel.delete();
        var progress = this.showProgress();

        var readerPromise = new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function(evt) {
                //TODO: DRY
                try {
                    var features = this_.featureMapper.getFeatures(evt.target.result);
                    new Notificator().notify('Fichero leido correctamente');
                    features.forEach(function(feature) {
                        this_.vectorSource.addFeature(feature);
                        this_.featureMapper.fillFeature(feature);

                        if (share.checked && this_.rte.isConnected()) {
                            this_.emit(feature);
                        }
                    });
                    this_.map.getView().fit(this_.vectorSource.getExtent(),
                        this_.map.getSize());
                    resolve(features.length);
                } catch (exp) {
                    reject('No se ha podido procesar el fichero');
                } finally {
                    progress.delete();
                }
            }
            reader.onerror = function(evt) {
                progress.delete();
                reject('No se ha podido leer el fichero');
            }
        });

        readerPromise.then(function(numFeatures) {
                new Notificator().notify('Importación finalizada: ' + numFeatures);
            })
            .catch(function(error) {
                new Notificator().notify('Error: ' + error);
                console.log(error);
            })
    }
}

AddMapsTool.prototype.loadUrl = function(url) {
    var this_ = this;

    var share = document.getElementById('shareLoadedMap');
    this.fileUPloadPanel.delete();
    var progress = this.showProgress();
    var features = [];
    axios.get(url)
        .then(function(response) {
            //TODO: DRY         

            var notificator = new Notificator();
            features = this_.featureMapper.getFeatures(response.data);
            notificator.notify('Importando información...' + features.length);

            features.forEach(function(feature) {
                try {

                    this_.vectorSource.addFeature(feature);
                    this_.featureMapper.fillFeature(feature);

                    if (share.checked && this_.rte.isConnected()) {
                        this_.emit(feature);
                    }
                } catch (error) {

                    progress.delete();
                    new Notificator().notify('¡Ups! Error cargando por URL ');
                    console.log('ERROR: ' + error);
                    return true;
                }
            });
            progress.delete();
            this_.map.getView().fit(this_.vectorSource.getExtent(),
                this_.map.getSize());

            notificator.notify('Importación finalizada');

        })
        .catch(function(error) {
            progress.delete();
            new Notificator().notify('¡Ups! No se ha cargado la informacion: ');
            console.log('ERROR: ' + error);

        });
}

AddMapsTool.prototype.loadWMS = function(url) {
    //elimino la capa si existe
    var this_ = this;
    var layers = this.map.getLayers(); 
    layers.forEach(function (layer) {
      if ('customLayer' === layer.get('title')) {         
          this_.map.removeLayer(layer);
      }              
    });  
    //cargo capa nueva
    var layerName = document.getElementById('wmsLayerNameInput').value;
    var wmsLayer = new Tile({
        title: 'customLayer',
        source: new TileWMS({            
            url: url,
            params: {
                'LAYERS': layerName                
            }
        }),
        visible: true
    });        
    this.map.addLayer(wmsLayer);
    this.fileUPloadPanel.delete();
    document.getElementById('customWMS').style.display = 'block';  
}

AddMapsTool.prototype.emit = function(feature) {
    feature = this.featureMapper.toSendedFeature(feature, this.rte.nick);
    var geojson = this.featureMapper.toGeojson(feature);
    this.rte.emit(RteOperation.DRAW, geojson);
}

AddMapsTool.prototype.showProgress = function(file) {
    return new RTCMModalPanel({
        parent: this,
        maxWidth: "50%",
        title: "   Importando datos...",
        iconTitle: "icon-file-upload",
        content: 'Espere un momento por favor...<br><br>'
    });
}

export default AddMapsTool;