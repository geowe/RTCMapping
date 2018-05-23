import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';

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

StyleFactory.prototype.selectStyle = function(){
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

export default StyleFactory;