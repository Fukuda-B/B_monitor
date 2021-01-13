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

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  var video = document.getElementById('main_video');
  var info = document.getElementById('info');
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    console.log('Size: '+video.videoWidth+'x'+video.videoHeight);
    info.innerHTML = 'CaptureSize: '+video.videoWidth+'x'+video.videoHeight;
    video.play();
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
