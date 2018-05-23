var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Permite el acceso desde cualquier dominio
io.origins('*:*');

var count = 0;
var port = 2000;
var usersInRomm = new Map();

//CUSTOM NAMESPACE
var rtcm = io.of('/rtcm');

rtcm.on('connection', function(socket){
  console.log('a user connected');
  count++;
  socket.emit('nick', {nick: 'user-'+ count})  
  console.log('Total users count: '+ count);

  socket.on('room', function(room) {  
    socket.join(room);    

    if(usersInRomm.has(room)){
      var users = usersInRomm.get(room)+1;
      usersInRomm.set(room, users);
    }else{
      usersInRomm.set(room, 1);
    }
    console.log('JOINED TO: '+room+' users in room: '+ usersInRomm.get(room));
    socket.nsp.to(room).emit('counter', {count:usersInRomm.get(room)});
  });

  socket.on('leaveRoom', function(room){
    console.log('user leave: '+room);
    var users = usersInRomm.get(room)-1;
    usersInRomm.set(room, users);
    socket.nsp.to(room).emit('counter', {count:usersInRomm.get(room)});
  });

  socket.on('disconnect', function(){      
    //count--;       
    console.log('a user has disconnected: ');
    console.log('Total users count: '+ count);
  });

  socket.on('drawTool', function(data){
    console.log('drawTool: ' + data.geojson.id);
    console.log('drawtool emit to: '+data.room);
    socket.broadcast.to(data.room).emit('drawTool', data.geojson);
  });

  socket.on('modifyTool', function(data){
    console.log('modifyTool: ' + data.geojson.id);
    console.log('modifyTool: ' + data.room);
    socket.broadcast.to(data.room).emit('modifyTool', data.geojson);
  });

  socket.on('featureInfoTool', function(data){
    console.log('featureInfoTool: ' + data.featureId);
    console.log('featureInfoTool: ' + data.room);
    socket.broadcast.to(data.room).emit('featureInfoTool', data.featureId, data.column, data.value);
  });

  socket.on('newAttributeTool', function(data){
    console.log('newAttributeTool: ' + data.newColumn);    
    socket.broadcast.to(data.room).emit('newAttributeTool', data.newColumn);
  });

  socket.on('deleteTool', function(data){
    console.log('deleteTool: ' + data.featureId);
    console.log('deleteTool: ' + data.room);
    socket.broadcast.to(data.room).emit('deleteTool', data.featureId);
  });

  socket.on('documentTitle', function(data){
    console.log('documentTitle: ' + data.title);
    console.log('room: ' + data.room);
    socket.broadcast.to(data.room).emit('documentTitle', data.title);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});