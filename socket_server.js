var zlib = require('zlib');
var http = require('http');
var server = require('ws').Server;
var s = new server({port:1011});

s.on('connection',function(ws){

    ws.on('message',function(message){
        // console.log(message);

        s.clients.forEach(function(client){
          console.log(message);
          client.send(message);
        });
    });

    ws.on('close',function(){
        console.log('Lost B!');
    });

});
