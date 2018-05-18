import BaseTool from './BaseTool';

import Map from 'ol/map';
import ol from 'ol/index';


import Draw from 'ol/interaction/draw';
import Polygon from 'ol/geom/polygon';
import LineString from 'ol/geom/linestring';
import Sphere from 'ol/sphere';

import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Circle from 'ol/style/circle';

import Vector from 'ol/layer/vector';
import SourceVector from 'ol/source/vector';
import Observable from 'ol/observable';
import Overlay from 'ol/overlay';

//TODO: llevar los estilos al styleFactory
var MeasureTool = function(options) {
  
  this.id = options.id;
  this.type = options.type;

  this.source = new SourceVector();

  this.measureLayer = new Vector({
        source: this.source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      });

  this.measureLayer.set('name', this.type + "MeasureLayer");

  this.measureDraw = new Draw({
     source: this.source,
      type: this.type,
      style: new Style({
          fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
          stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.5)',
              lineDash: [10, 10],
              width: 2
            }),
          image: new Circle({
              radius: 5,
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
              }),
          fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              })
            })
      })
  });


  this.measureDraw.setActive(false);
       

  BaseTool.call(this, {    
    id: this.id, 
    cursor: "cell" ,
    controls: [this.measureDraw]

  });

};

ol.inherits(MeasureTool, BaseTool);

MeasureTool.prototype.onLoad = function(map, appContext) {  
  BaseTool.prototype.onLoad.call(this, map, appContext);
  this.getMap().addLayer(this.measureLayer);
  this.tooltip();
}

MeasureTool.prototype.setActive = function(enabled) {  
  BaseTool.prototype.setActive.call(this, enabled);


     this.source.clear();

      var staticTooltip = document.getElementsByClassName("tooltip tooltip-static");
      
      //alert(staticTooltip);
      if(staticTooltip) {
               
        for (var i = 0; i < staticTooltip.length; i++) {
            staticTooltip[i].remove();
        }
      }
    
  
}  



MeasureTool.prototype.tooltip = function() {

    var map = this.getMap();
    /**
       * Currently drawn feature.
       * @type {ol.Feature}
       */
      var sketch;


      /**
       * The help tooltip element.
       * @type {Element}
       */
      var helpTooltipElement;


      /**
       * Overlay to show the help messages.
       * @type {ol.Overlay}
       */
      var helpTooltip;


      /**
       * The measure tooltip element.
       * @type {Element}
       */
      var measureTooltipElement;


      /**
       * Overlay to show the measurement.
       * @type {ol.Overlay}
       */
      var measureTooltip;


      /**
       * Message to show when the user is drawing a polygon.
       * @type {string}
       */
      var continuePolygonMsg = 'Click to continue drawing the polygon';


      /**
       * Message to show when the user is drawing a line.
       * @type {string}
       */
      var continueLineMsg = 'Click to continue drawing the line';


      /**
       * Handle pointer move.
       * @param {ol.MapBrowserEvent} evt The event.
       */
      this.pointerMoveHandler = function(evt) {
        if (evt.dragging) {
          return;
        }
        /** @type {string} */
       /* var helpMsg = 'Click to start drawing';

        if (sketch) {
          var geom = (sketch.getGeometry());
          if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
          } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
          }
        }

        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove('hidden');*/
      };



      this.pointermoveKey = map.on('pointermove', this.pointerMoveHandler);

      map.getViewport().addEventListener('mouseout', function() {
        helpTooltipElement.classList.add('hidden');
      });


      var draw = this.measureDraw;


      /**
       * Format length output.
       * @param {ol.geom.LineString} line The line.
       * @return {string} The formatted length.
       */
      var formatLength = function(line) {
        var length = Sphere.getLength(line);
        var output;
        if (length > 100) {
          output = (Math.round(length / 1000 * 100) / 100) +
              ' ' + 'km';
        } else {
          output = (Math.round(length * 100) / 100) +
              ' ' + 'm';
        }
        return output;
      };


      /**
       * Format area output.
       * @param {ol.geom.Polygon} polygon The polygon.
       * @return {string} Formatted area.
       */
      var formatArea = function(polygon) {
        var area = Sphere.getArea(polygon);
        var output;
        if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
      };



      createMeasureTooltip();
      createHelpTooltip();

      var listener;
        draw.on('drawstart',
            function(evt) {
              // set sketch
              sketch = evt.feature;

              /** @type {ol.Coordinate|undefined} */
              var tooltipCoord = evt.coordinate;

              listener = sketch.getGeometry().on('change', function(evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof Polygon) {
                  output = formatArea(geom);
                  tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                  output = formatLength(geom);
                  tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
              });
            }, this);

        draw.on('drawend',
            function() {
              measureTooltipElement.className = 'tooltip tooltip-static';
              measureTooltip.setOffset([0, -7]);
              // unset sketch
              sketch = null;
              // unset tooltip so that a new one can be created
              measureTooltipElement = null;
              createMeasureTooltip();
              Observable.unByKey(listener);
            }, this);



        /**
       * Creates a new help tooltip
       */
     function createHelpTooltip() {


        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new Overlay({
          element: helpTooltipElement,
          offset: [15, 0],
          positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);        
      }


      /**
       * Creates a new measure tooltip
       */
      function createMeasureTooltip() {
        if (measureTooltipElement) {
          measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);        
      }

      
      
  }


  export default MeasureTool;