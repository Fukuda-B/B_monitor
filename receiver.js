'use strict';

var counter = 0; // video receive counter
var recInt = 1000; // Recode Interval
var fps = 20; // Frame rate / (s)

var blob = [];
var receive_video = document.getElementById('receive_video');
var receive_video2 = document.getElementById('receive_video2');
var video_c = document.getElementById('main_video');
var ctx = video_c.getContext("2d");


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
  counter++;
  update_canvas(counter, blob); // copy video to canvas
  console.log(blob);
});

function update_canvas(counter, blob) {
  if (counter > 1) {
    if (counter%2) {
      var attVideo = receive_video;
    } else {
      var attVideo = receive_video2;
    }
    attVideo.currentTime = (counter-1)*recInt/1000;
    attVideo.src = URL.createObjectURL(blob);
    attVideo.play();
    ctx.drawImage(attVideo, 0, 0, attVideo.videoWidth, attVideo.videoHeight);
  }
}
