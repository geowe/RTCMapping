const $ = require('jquery');
const jqueryui = require('jquery-ui');
const jquerytabulator = require('jquery.tabulator');

var DataGrid = function(options) {

    this.id = options.id;    
    
    this.editable = (options.editable !== undefined) ? options.editable : false;

    $("#"+this.id).tabulator({
        layout: "fitColumns",
        responsiveLayout: true,      
        movableColumns: true,
        columnMinWidth: options.columnMinWidth,      
        height: options.height,
        addRowPos: "top",
        tooltips: true
      });          
};

DataGrid.prototype.setData = function(jsonData) {
    this.data = jsonData;
}

DataGrid.prototype.getData = function() {
    return $("#"+this.id).tabulator("getData");
}

DataGrid.prototype.clearData = function() {
    if(this.data != undefined) {
        this.data = undefined;
        $("#"+this.id).tabulator("clearData");
    }    
}

DataGrid.prototype.addColumn = function(columnName) {    
    var this_ = this;
    $("#"+this.id).tabulator("addColumn", this_.getColumn_(columnName, "string"));
    this.onNewColumnAdded(columnName);
}

DataGrid.prototype.removeColumn = function(columnName) {    
    $("#"+this.id).tabulator("deleteColumn", columnName);
}

DataGrid.prototype.getColumns = function() {    
    return $("#"+this.id).tabulator("getColumns");
}

DataGrid.prototype.hasColumn = function(columnName) {    
    var columns = this.getColumns_();
    var result;

    columns.forEach(function(column) {
        if(column['field'] == columnName) {
            result = column;
        }
    });
    return result;
}

DataGrid.prototype.show = function() {    
    $("#"+this.id).tabulator("setColumns", this.getColumns_());
    $("#"+this.id).tabulator("setData", this.data);
}

DataGrid.prototype.onCellEdited = function(id, column, value) {    
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onNewColumnAdded = function(column) {    
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.getColumns_ = function() {    
    var columns = [];

    if(this.data != undefined) {
        var row = this.data[0];
        
        for (var key in row) {       
            //Tipo por defecto
            var typeName = "string";
            if (Number.isInteger(row[key])) {
                typeName = "number";
            }

            var column = this.getColumn_(key, typeName);
            columns.push(column);
        }        
    }

    return columns;
}

DataGrid.prototype.getColumn_ = function(name, typeName) {
    var this_ = this;
    var column = {};    

    column['title'] = name.toUpperCase();                
    column['field'] = name;  
    column['sorter'] = typeName;            

    if(this.editable && name != 'id') {
        column['editor'] = 'input';  
        column['cellEdited'] = function(cell) {
            this_.onCellEdited(
                cell.getRow().getData().id,
                cell.getColumn().getField(),
                cell.getValue()
            );
        }
    }            

    return column;
}

export default DataGrid;