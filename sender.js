'use strict';

var recInt = 500; // Recode Interval
var fps = 10; // Frame rate / (s)
var videoQuo = 0.5 // Video Quality (Max: 1.0)
var constraints = {
  audio: true,
  video: {
//    width: { min: 640, max: 640},
//    height: { min: 360, max: 360},
   frameRate: {ideal: fps, max: fps},
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
  // receive_video.src = e.data;
  // receive_video.src = URL.createObjectURL(e.data);
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
    RECODE.start(mediaStream); // recode mediaStream

    video_c.height = video.videoHeight;
    video_c.width = video.videoWidth;
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); });


/* Update canvas frame (Unused) */
function update_canvas() {
  ctx.drawImage(video, 0, 0, video_c.width, video_c.height);
  var dataURI = video_c.toDataURL("image/jpeg", videoQuo);
  sender(dataURI); // send img data
  setTimeout(update_canvas, 1000/fps);
}

var mediaRec="";

var RECODE = {
  _timeout:"",

  /* Record Video + Audio */
  // MediaRecorder: https://developer.mozilla.org/ja/docs/Web/API/MediaRecorder
  start: function(mediaStream) {
    mediaRec = new MediaRecorder(mediaStream, {
      mimeType : 'video/webm'
    });
    mediaRec.start();
    // setInterval(RECODE.req, recInt, mediaRec);
    // this._timeout = setTimeout(RECODE.req, recInt, mediaRec);
    setTimeout(RECODE.req, recInt, mediaRec);
  },

  /* Stop Record */
  stop: function(mediaRec) {
    // clearInterval(this._timeout);
    mediaRec.stop();
  },

  /* Request Record Data */
  req: function(mediaRec) {

    // Since the event (dataavailable) occurs multiple times,
    // it should be counted so that it is not sent too many times.
    var env = 0;
    try {
      setTimeout(RECODE.req, recInt, mediaRec);
      mediaRec.requestData();
      mediaRec.addEventListener('dataavailable', e=> {
        if (e.data.size>0 && env === 0) {
          console.log(e.data);
          env = 1;
          // var blob = new Blob([e.data], {type: 'video/x-matroska;codecs=avc1,opus'});
          // sender(blob);
          // console.log(blob);
          sender(e.data);
        }
      })
    } catch(e) {
      console.log(e);
    }
  },
}
