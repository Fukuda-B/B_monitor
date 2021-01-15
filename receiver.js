'use strict';

var receive_video = document.getElementById('receive_video');

/* Websocket connection */
var socket = new WebSocket('ws://127.0.0.1:1011');
// start
socket.addEventListener('open', function(e) {
  console.log('Connected!');
});
// receive
socket.addEventListener('message', function(e) {
  receive_video.src = e.data;
  console.log(e.data.length);
});
