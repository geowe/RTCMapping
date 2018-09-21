import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';
import MultiPoint from 'ol/geom/multipoint';

var StyleFactory = function() {
    this.defaultFont = '12px Calibri,sans-serif';
    this.defaultFillColor = 'rgba(255, 255, 255, 0.6)';
    this.defaultStrokeColor = '#319FD3';

}


StyleFactory.prototype.getStyle = function(options) {

    var fillColor = (options.fillColor !== undefined) ? options.fillColor : this.defaultFillColor;
    var strokeColor = (options.strokeColor !== undefined) ? options.strokeColor : this.defaultStrokeColor;
    var pointFillColor = (options.pointFillColor !== undefined) ? options.pointFillColor : this.defaultFillColor;
    var style = new Style({
        fill: new Fill({
            color: fillColor
        }),
        stroke: new Stroke({
            color: strokeColor,
            width: 3
        }),
        text: new Text({
            font: this.defaultFont,
            fill: new Fill({
                color: '#000'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 3
            })
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
                color: pointFillColor
            })
        })
    });

    return style;
}


StyleFactory.prototype.getShareStyle = function(options) {
    var nick = options.nick;
    var fillColor = (options.fillColor !== undefined) ? options.fillColor : this.defaultFillColor;
    var strokeColor = (options.strokeColor !== undefined) ? options.strokeColor : this.defaultStrokeColor;
    var pointFillColor = (options.pointFillColor !== undefined) ? options.pointFillColor : this.defaultFillColor;
    var style = new Style({
        fill: new Fill({
            color: fillColor
        }),
        stroke: new Stroke({
            color: strokeColor,
            width: 3
        }),
        text: new Text({
            text: nick,
            font: this.defaultFont,
            offsetY: 20,
            fill: new Fill({
                color: '#000'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 3
            })
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
                color: pointFillColor
            })
        })
    });

    return style;
}

StyleFactory.prototype.getShadowStyle = function() {
    var shadowStyle = new Style({
        stroke: new Stroke({
            color: [0, 0, 127, 0.15], //0.15
            width: 12
        }),
        image: new Circle({
            radius: 10,
            fill: new Fill({
                color: [0, 0, 127, 0.15]
            })
        })

    });
    return shadowStyle;
}

StyleFactory.prototype.selectStyle = function() {
    var selectStyle = new Style({
        stroke: new Stroke({
            width: 6,
            color: [237, 212, 0, 0.8]
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
                color: [237, 212, 0, 0.8]
            })
        })
    });
    return selectStyle;
}

//Necesario para aplicar estilo a la seleccion
//cuando se ha aplicado estilo al feature
StyleFactory.prototype.selectableStyle = function(style, features) {
    var selectStyle = this.selectStyle();
    return function(feature) {

        return features.getArray().indexOf(this) == -1 ? style : selectStyle;

    }
};

StyleFactory.prototype.getVertexStyle = function() {

    var modifyStyle = [

        new Style({
            stroke: new Stroke({
                color: 'yellow',
                width: 3
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        }),
        new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({
                    color: 'yellow'
                })
            }),
            geometry: function(feature) {
                var geom = feature.getGeometry();
                var coordinates = geom.getCoordinates()[0];

                geom.getLinearRings().forEach(function(linearRing) {
                    for (var i = 0; i < linearRing.getCoordinates().length; i++) {
                        var coordinatesRing = linearRing.getCoordinates()[i];
                        coordinates.push(coordinatesRing);
                    }
                });

                return new MultiPoint(coordinates);
            }
        })
    ];


    return modifyStyle;
}

export default StyleFactory;