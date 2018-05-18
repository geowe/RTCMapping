import DataGrid from './DataGrid';
import ol from 'ol/index';


var FeatureGrid = function(options) {
  
    this.id = options.id;    

    this.editable = (options.editable !== undefined) ? options.editable : false;
    this.columnMinWidth = (options.columnMinWidth !== undefined) ? options.columnMinWidth : 140;
    this.height = (options.height !== undefined) ? options.height : "300px";

    DataGrid.call(this, {    
    
        id: this.id,
        editable: this.editable,
        columnMinWidth: this.columnMinWidth,
        height: this.height
      });

};

ol.inherits(FeatureGrid, DataGrid);

FeatureGrid.prototype.bind = function(features) {
    this.features = features;
    var jsonData = [];
       
    features.forEach(function(feature) {
        var row = {};
        var properties = feature.getProperties();
        
        row['id'] = feature.getId();
        for (var key in properties) {            
            if(key != 'geometry') { 
                row[key] = properties[key];                
            }            
        }
               
        jsonData.push(row);
    });
    
    this.setData(jsonData);
    this.show();
}

FeatureGrid.prototype.setGridListener = function(listener) {
    this.gridListener = listener;
}

FeatureGrid.prototype.onCellEdited = function(id, column, value) {    
    var editedFeature = this.getFeatureById_(id);
    
    if(editedFeature != undefined) {        
        editedFeature.set(column, value);
        this.gridListener.onFeatureModified(editedFeature, column);
    }
}

FeatureGrid.prototype.onNewColumnAdded = function(column) {    
    this.features.forEach(function(feature) {        
        feature.set(column, "");
    });
    
    this.gridListener.onNewColumnAdded(column);
}

FeatureGrid.prototype.getFeatureById_ = function(id) {
    var searchFeature;

    this.features.forEach(function(feature) {
        if(feature.getId() == id) {
            searchFeature = feature;
        }
    });

    return searchFeature;
} 

export default FeatureGrid;