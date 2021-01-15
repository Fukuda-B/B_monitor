'use strict';

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

if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
  console.log("not support getUserMedia()");
}

var video = document.getElementById('main_video');
var info = document.getElementById('info');
var video_c = document.getElementById('cap_video');
var ctx = video_c.getContext("2d");

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

function update_canvas() {
  ctx.drawImage(video, 0, 0, video_c.width, video_c.height);
  setTimeout(update_canvas, 100);
}

update_canvas();
