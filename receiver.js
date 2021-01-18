'use strict';

var blob = [];
var receive_video = document.getElementById('receive_video');

/* Websocket connection */
var socket = new WebSocket('ws://127.0.0.1:1011');
// start
socket.addEventListener('open', function(e) {
  console.log('Connected!');
});
// receive
socket.addEventListener('message', function(e) {
  blob = new Blob([blob, e.data], {type: 'video/x-matroska;codecs=avc1,opus'});
  receive_video.src = URL.createObjectURL(blob);
  console.log(blob);
});

function update_canvas() {
  receive_video.play();
}