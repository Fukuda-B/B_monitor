'use strict';


var fps = 10; // Frame rate / (s)
var videoQuo = 0.5 // Video Quality (Max: 1.0)
var constraints = {
  audio: true,
  video: {
//    width: { min: 640, max: 640},
//    height: { min: 360, max: 360},
//    frameRate: {ideal: 10, max: 15},
  },
  //video: {facingMode: "user"} // Select FrontCamera
  //video: {facingMode: {exact: "enviroment"}} // Select RearCamera
};
var video = document.getElementById('main_video');
var info = document.getElementById('info');
var video_c = document.getElementById('cap_video');
var ctx = video_c.getContext("2d");
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
});
// send
function sender(data) {
  socket.send(data);
}


/* Get camera data */
if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
  console.log("not support getUserMedia()");
}
navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    console.log('Size: '+video.videoWidth+'x'+video.videoHeight);
    info.innerHTML = 'CaptureSize: '+video.videoWidth+'x'+video.videoHeight;
    video.play();

    video_c.height = video.videoHeight;
    video_c.width = video.videoWidth;
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.


/* Update canvas frame */
function update_canvas() {
  ctx.drawImage(video, 0, 0, video_c.width, video_c.height);
  var dataURI = video_c.toDataURL("image/jpeg", videoQuo);
  sender(dataURI); // send img data
  setTimeout(update_canvas, 1000/fps);
}

