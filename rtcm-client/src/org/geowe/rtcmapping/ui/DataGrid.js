const $ = require('jquery');
const jqueryui = require('jquery-ui');
const jquerytabulator = require('jquery.tabulator');

var DataGrid = function(options) {

    this.id = options.id;
    this.editable = (options.editable !== undefined) ? options.editable : false;
    this.idColumn = (options.idColumn !== undefined) ? options.idColumn : 'id';

    this.editing = false; //Flag que indica que el usuario está editando

    var this_ = this;
    $("#" + this.id).tabulator({
        layout: "fitColumns",
        responsiveLayout: true,
        movableColumns: true,
        columnMinWidth: options.columnMinWidth,
        height: options.height,
        addRowPos: "top",
        tooltips: true,
        rowClick: function(e, row) {
            this_.onRowClicked(row);
        },
        rowSelected: function(row) {
            this_.onRowSelected(row);
        },
        rowDeselected: function(row) {
            this_.onRowDeselected(row);
        },
        rowTap: function(e, row) {
            this_.onRowTap(row);
        },
        autoResize: true,
        selectable: 1,
        placeholder: "No hay datos cargados"
    });

    $(window).resize(function() {
        $("#" + this.id).tabulator("redraw");
    });
};

DataGrid.prototype.setData = function(jsonData) {
    this.data = jsonData;
}

DataGrid.prototype.getData = function() {
    return $("#" + this.id).tabulator("getData");
}

DataGrid.prototype.getIdColumn = function() {
    return this.idColumn;
}

DataGrid.prototype.setEditing = function(enable) {
    this.editing = enable;
}

DataGrid.prototype.isEditing = function() {
    return this.editing;
}

DataGrid.prototype.clearData = function() {
    if (this.data != undefined) {
        this.data = undefined;
        $("#" + this.id).tabulator("clearData");
    }
}

DataGrid.prototype.addColumn = function(columnName) {
    var this_ = this;
    $("#" + this.id).tabulator("addColumn", this_.getColumn_(columnName, "string"));
    this.onNewColumnAdded(columnName);
}

DataGrid.prototype.removeColumn = function(columnName) {
    $("#" + this.id).tabulator("deleteColumn", columnName);
}

DataGrid.prototype.getColumns = function() {
    return $("#" + this.id).tabulator("getColumns");
}

DataGrid.prototype.hasColumn = function(columnName) {
    var columns = this.getColumns_();
    var result;

    columns.forEach(function(column) {
        if (column['field'] == columnName) {
            result = column;
        }
    });
    return result;
}

DataGrid.prototype.selectRow = function(rowIndex) {
    $("#" + this.id).tabulator("selectRow", rowIndex);
    $("#" + this.id).tabulator("scrollToRow", rowIndex, "center", false);
}

DataGrid.prototype.getSelectedRows = function() {
    return $("#" + this.id).tabulator("getSelectedRows");
}

DataGrid.prototype.getRow = function(index) {
    return $("#" + this.id).tabulator("getRow", index);
}

DataGrid.prototype.show = function() {
    $("#" + this.id).tabulator("setColumns", this.getColumns_());
    $("#" + this.id).tabulator("setData", this.data);

    this.onDataLoaded(this.data);
}

DataGrid.prototype.onRowClicked = function(row) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onRowSelected = function(row) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onRowDeselected = function(row) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onRowTap = function(row) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onCellEdited = function(id, column, value) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onNewColumnAdded = function(column) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.onDataLoaded = function(data) {
    //Metodo a ser implementado en la super-clase
}

DataGrid.prototype.getColumns_ = function() {
    var columns = [];

    if (this.data != undefined) {
        var row = this.getRowSample_();

        for (var key in row) {
            //Campos que NO se muestran van en este IF
            if (key != "modified") {
                //Tipo por defecto: cadena
                var typeName = "string";
                //Tipo numérico
                if (Number.isInteger(row[key])) {
                    typeName = "number";
                } 
                //Tipo booleano
                else if(typeof(row[key]) == typeof(true)){
                    typeName = "boolean";
                }
                
                var column = this.getColumn_(key, typeName);
                columns.push(column);
            }
        }
    }

    return columns;
}

DataGrid.prototype.getRowSample_ = function() {
    var rowSample = {};

    if(this.data != undefined) {
        this.data.forEach(function(row) {
            for (var key in row) {
                rowSample[key] = row[key];
            }
        });
    }

    return rowSample;
}

DataGrid.prototype.getColumn_ = function(name, typeName) {
    var this_ = this;
    var column = {};
    
    column['title'] = name.toUpperCase();
    column['field'] = name;    
    column['responsive'] = 0;

    //Ordenación
    if(typeName == "string" || typeName == "number") {
        column['sorter'] = typeName;
    }

    //Formateadores concretos
    if(typeName == "boolean") {
        column['formatter'] = "tickCross";
        column['align'] = "center";
    }

    if (this.editable && name != this.idColumn && name != "nick" && name != "shared") {
        column['editor'] = 'input';                
        //Se selecciona la fila automaticamente al editar
        column['cellEditing'] = function(cell) {
            this_.editing = true;
            cell.getRow().select();            
        }
        column['cellEdited'] = function(cell) {
            this_.onCellEdited(
                cell.getRow().getData()[this_.idColumn],
                cell.getColumn().getField(),
                cell.getValue()
            );
            cell.getRow().deselect();
            this_.editing = false;
        }
        column['cellEditCancelled'] = function(cell) {
            this_.editing = false;
        }        
    }

    return column;
}

export default DataGrid;