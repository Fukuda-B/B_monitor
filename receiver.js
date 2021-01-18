'use strict';

var counter = 0; // video receive counter
var recInt = 500; // Recode Interval

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
  // blob = new Blob([blob, e.data], {type: 'video/webm'});
  receive_video.src = URL.createObjectURL(blob);
  console.log(blob);
  counter++;
});

function update_canvas() {
  if (counter*recInt/1000 > 1) {
    receive_video.currentTime = counter*recInt/1000;
  }
  receive_video.play();
}