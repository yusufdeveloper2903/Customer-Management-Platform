<template>
  <div>
    <div v-if="hasDetectionAuthError" class="error-message-container">
      <h3>{{ $t("failedEditPhoto") }}</h3>
      <p>{{ $t("tryTakePhotoAgain") }}</p>
    </div>
    <div id="container">
      <div class="header">
        <div class="view-wrapper" :class="deviceStatus === 1 ? '' : 'hidden'">
          <div :class="canvasWrapperStateClass">
            <div
              :id="containerId"
              :class="
                cameraType === 1
                  ? 'canvas-wrapper camera-normal'
                  : 'canvas-wrapper camera-mobile'
              "
            >
              <div class="canvas-panel flex justify-center">
                <canvas class="center-block" :id="outputCanvasId"></canvas>
              </div>
              <Transition name="fade" mode="out-in">
                <div
                  v-if="
                    takePhotoCountDown !== 0 &&
                    takePhotoCountDown !== TAKE_PHOTO_COUNT_DOWN_DEFAULT
                  "
                  :key="takePhotoCountDown"
                  class="canvas-timer"
                >
                  {{ takePhotoCountDown }}
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="view-wrapper" :class="deviceStatus === 2 ? '' : 'hidden'">
      <h3>{{ $t("cameraNotFound") }}</h3>
    </div>
    <Camera @complete="CameraSearchingComplete"></Camera>
    <div class="video-container">
      <video :id="videoContainerId" muted playsinline class="hidden">
        <track kind="captions" />
        {{ $t("videoNotSupported") }}
      </video>
    </div>

    <div
      class="instruction-text dark:text-white text-xl"
      id="instruction-text"
      v-text="$t('infoCamera')"
    ></div>
    <!-- <img src="/images/arrows.png" class="m-3 arrow mx-auto d-block" alt=""/> -->

    <div style="position: relative">
      <div class="photoBlock" v-if="deviceStatus === 1">
        <button class="scan-btn" type="button" @click="takePhoto" :disabled="disabledTakePhoto">
          <img src="/images/camera.svg" class="camera-img" alt="" />
        </button>
      </div>
      <!-- <button class="advise" @click="infoClick" style="position: absolute; top:10px; float: right; right: 10px;">
        <img src="/images/ask.svg" class="question" alt=""/>
        <p class="text-primary" v-html="$t('advise')"></p>
      </button> -->
    </div>
    <Transition name="fade">
      <div class="modal bg-white">
        <h2 class="text-gray-600 dark:text-white" v-text="$t('advise')"></h2>
        <ul>
          <li
            class="text-gray-600 dark:text-white"
            v-text="$t('advise_li_one')"
          ></li>
          <li
            class="text-gray-600 dark:text-white"
            v-text="$t('advise_li_two')"
          ></li>
          <li
            class="text-gray-600 dark:text-white"
            v-text="$t('advise_li_there')"
          ></li>
        </ul>
        <button @click="closeInfo()" class="scan-btn btn-primary m-auto my-4">
          {{ $t("itsClear") }}
        </button>
      </div>
    </Transition>
    <div class="bg" @click="closeInfo"></div>
  </div>
</template>
<script type="application/javascript">
import Camera from "./Camera.vue";

const TAKE_PHOTO_COUNT_DOWN_DEFAULT = 5;

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Detector",
  components: { Camera },
  data() {
    return {
      device: null,
      deviceStatus: 0,
      videoContainerId: "title",
      containerId: "cont",
      outputCanvasId: "cont1",
      cv: null,
      video: null,
      canvasOutput: null,
      canvasOutputCtx: null,
      stream: null,
      streaming: false,
      canvasWrapperStateClass: "red",
      foundDataUrls: [],
      stopVideoProcessing: false,
      cameras: [],
      cameraType: 1, // 1 = 1280x720; 2 = 720x1280
      theTimer: null,
      hasDetectionAuthError:
        sessionStorage.getItem("auth_error") === "detection_failed",
      manualTakePhoto: false,
      disabledTakePhoto: true,
      TAKE_PHOTO_COUNT_DOWN_DEFAULT,
      takePhotoCountDown: TAKE_PHOTO_COUNT_DOWN_DEFAULT,
      photoCountDownTimeout: null,
    };
  },
  mounted() {
    document.getElementById("body").classList.add("camera");
    /* if ("instruction-text" in localStorage) {
     document.getElementById("instruction-text").style.display = "none";
     } else {
     document.getElementById("instruction-text").style.display = "block";
     localStorage.setItem("instruction-text", "true");
     }*/
  },
  methods: {
    startDetection() {
      const _self = this;
      _self.cv = window.cv;
      _self.video = document.getElementById(_self.videoContainerId);
      _self.canvasOutput = document.getElementById(_self.outputCanvasId);
      _self.canvasOutputCtx = _self.canvasOutput.getContext("2d");

      _self.video.addEventListener(
        "canplay",
        () => {
          if (!_self.streaming) {
            _self.canvasOutput.width = _self.video.videoWidth;
            _self.canvasOutput.height = _self.video.videoHeight;
            _self.streaming = true;
            if (_self.video.videoHeight > _self.video.videoWidth) {
              _self.cameraType = 2;
            } else {
              _self.cameraType = 1;
            }
          }
          _self.startVideoProcessing();
        },
        false
      );
      if (_self.device) {
        let videoConstraints = {
          deviceId: { exact: _self.device.deviceId },
          frameRate: { ideal: 30 },
          width: { ideal: 960, max: 1280 },
          height: { ideal: 720, max: 720 },
          facingMode: "user",
        };
        if (_self.cameraType === 2) {
          videoConstraints = {
            deviceId: { exact: _self.device.deviceId },
            frameRate: { ideal: 30 },
            width: { ideal: 720, max: 720 },
            height: { ideal: 960, max: 1280 },
            facingMode: "user",
          };
        }
        navigator.mediaDevices
          .getUserMedia({
            video: videoConstraints,
            audio: false,
          })
          .then((stream) => {
            _self.stream = stream;
            _self.video.srcObject = stream;
            setTimeout(() => {
              _self.video.play();
            }, 50);
          })
          .catch(function (err) {
            console.log("An error occured! ", err);
          });
      }
    },
    startVideoProcessing: function () {
      const _self = this;
      console.warn("startVideoProcessing");
      if (!_self.streaming) {
        console.warn("Please startup your webcam");
        return;
      }
      //_self.stopVideoProcessing();
      _self.canvasInput = document.createElement("canvas");
      _self.canvasInput.width = _self.video.videoWidth;
      _self.canvasInput.height = _self.video.videoHeight;
      _self.canvasInputCtx = _self.canvasInput.getContext("2d");

      const canvasBuffer = document.createElement("canvas");
      canvasBuffer.width = _self.video.videoWidth;
      canvasBuffer.height = _self.video.videoHeight;

      _self.faceClassifier = new _self.cv.CascadeClassifier();
      _self.faceClassifier.load("haarcascade_frontalface_default.xml");

      _self.theTimer = setInterval(_self.balancer, 67);

      cancelAnimationFrame(_self.timer1);
      _self.timer1 = requestAnimationFrame(_self.processVideo);
    },
    processVideo: function () {
      const _self = this;
      if (_self.stopVideoProcessing) {
        return;
      }
      let srcMat = new _self.cv.Mat(
        _self.video.videoHeight,
        _self.video.videoWidth,
        _self.cv.CV_8UC4
      );
      let grayMat = new _self.cv.Mat(
        _self.video.videoHeight,
        _self.video.videoWidth,
        _self.cv.CV_8UC1
      );
      //_self.stats.begin();
      //const scale = 1;
      _self.canvasInputCtx.drawImage(
        _self.video,
        0,
        0,
        _self.video.videoWidth,
        _self.video.videoHeight
      );
      let imageData = _self.canvasInputCtx.getImageData(
        0,
        0,
        _self.video.videoWidth,
        _self.video.videoHeight
      );
      srcMat.data.set(imageData.data);
      _self.cv.cvtColor(srcMat, grayMat, _self.cv.COLOR_RGBA2GRAY);
      let faces = [];
      let faceMats = [];
      let size;
      let faceVect = new _self.cv.RectVector();
      let faceMat = new _self.cv.Mat();

      _self.cv.pyrDown(grayMat, faceMat);
      _self.cv.pyrDown(faceMat, faceMat);
      size = faceMat.size();

      /**
       * minNeighbors : Parameter specifying how many neighbors each candidate rectangle should have to retain it. This parameter will affect the quality of the detected faces: higher value results in less detections but with higher quality. We're using 5 in the code.
       */
      let sens = 5;
      if (_self.cameraType === 2) {
        sens = 6;
      }
      _self.faceClassifier.detectMultiScale(faceMat, faceVect, sens);

      const cb = (_currentFace) =>
        faces.forEach((_face) => {
          if (_face.width < _currentFace.width) {
            faces = [];
          }
        });

      for (let i = 0; i < faceVect.size(); i++) {
        let face = faceVect.get(i);
        cb(face);
        faces.push(new _self.cv.Rect(face.x, face.y, face.width, face.height));
        faceMats.push(faceMat.roi(face));
        if (faces.length > 1) {
          faces.length = 1;
        }
      }
      faceMat.delete();
      faceVect.delete();

      _self.canvasOutputCtx.drawImage(
        _self.canvasInput,
        0,
        0,
        _self.video.videoWidth,
        _self.video.videoHeight
      );
      _self.detectFaceAndStop(_self.canvasOutputCtx, faces, size);
      srcMat.delete();
      grayMat.delete();
      cancelAnimationFrame(_self.timer2);
      _self.timer2 = requestAnimationFrame(_self.processVideo);
    },
    detectFaceAndStop: function (ctx, results, size) {
      const _self = this;
      _self.face_coords = results;
      if (results.length > 0) {
        _self.canvasWrapperStateClass = "green";
        _self.disabledTakePhoto = false;
        // if (!_self.photoCountDownTimeout && !_self.hasDetectionAuthError) _self.startPhotoCountDownTimer()
      } else {
        _self.canvasWrapperStateClass = "red";
        _self.disabledTakePhoto = true;
        _self.manualTakePhoto = false;
        // clearTimeout(_self.photoCountDownTimeout)
        // _self.takePhotoCountDown = TAKE_PHOTO_COUNT_DOWN_DEFAULT
        // _self.photoCountDownTimeout = null
        return;
      }

      for (let i = 0; i < results.length; ++i) {
        let rect = results[i];
        let xRatio = _self.video.videoWidth / size.width;
        let yRatio = _self.video.videoHeight / size.height;
        /*ctx.lineWidth = 3;
         ctx.strokeStyle = color;
         ctx.strokeRect(rect.x * xRatio, rect.y * yRatio, rect.width * xRatio, rect.height * yRatio);*/
        _self.face_coords[i] = {
          x: rect.x * xRatio,
          y: rect.y * yRatio,
          width: rect.width * xRatio,
          height: rect.height * yRatio,
        };

        const scale = 1.5;

        let x = rect.x * xRatio;
        let y = rect.y * yRatio;
        let w = rect.width * xRatio;
        let h = rect.height * yRatio;

        x = x - ((w * scale) / 2 - w / 2);
        y = y - ((h * scale) / 2 - h / 2);
        w = w * scale;
        h = h * scale;

        // 852 x 480 min for MyID

        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        if (w + x > _self.video.videoWidth) {
          w = _self.video.videoWidth - x;
        }
        if (h + y > _self.video.videoHeight) {
          h = _self.video.videoHeight - y;
        }

        // if (_self.manualTakePhoto || (!_self.hasDetectionAuthError && _self.takePhotoCountDown === 0)) {
        if (_self.manualTakePhoto) {
          console.log("----");
          let imageData = ctx.getImageData(x, y, w, h);
          let screenshot = document.createElement("canvas");
          screenshot.width = w;
          screenshot.height = h;
          const context = screenshot.getContext("2d");
          context.putImageData(imageData, 0, 0);
          //_self.foundDataUrls.push(screenshot.toDataURL())

          _self.foundDataUrls.push("found");
          console.log(_self.foundDataUrls.length, "_self.foundDataUrls.length");
          // if (_self.foundDataUrls.length === 21) {

          // _self.$store.commit('setImage', screenshot.toDataURL().replace('png', 'jpeg'));
          _self.stopVideoProcessing = true;
          _self.stopCamera();
          _self.$emit(
            "detectionComplete",
            screenshot.toDataURL().replace("png", "jpeg")
          );
          _self.manualTakePhoto = false;
          return;
          // }
        }
      }
    },
    stopCamera: function () {
      const _self = this;
      if (!_self.streaming) return;
      //_self.stopVideoProcessing();
      /*document
       .getElementById(_self.outputCanvasId)
       .getContext('2d')
       .clearRect(0, 0, _self.video.videoWidth, _self.video.videoHeight);*/
      _self.video.pause();
      _self.video.srcObject = null;
      _self.stream.getVideoTracks()[0].stop();
      _self.streaming = false;
      if (_self.theTimer) {
        clearInterval(_self.theTimer);
      }
      cancelAnimationFrame(_self.timer1);
      cancelAnimationFrame(_self.timer2);
    },
    balancer: function () {
      this.foundDataUrls.pop();
    },
    checkDeviceSupport(callback) {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        // Firefox 38+ seems having support of enumerateDevicesx
        navigator.enumerateDevices = function (callback) {
          navigator.mediaDevices.enumerateDevices().then(callback);
        };
      }

      let MediaDevices = [];
      const isHTTPs = location.protocol === "https:";
      let canEnumerate = false;

      if (
        typeof MediaStreamTrack !== "undefined" &&
        "getSources" in MediaStreamTrack
      ) {
        canEnumerate = true;
      } else if (
        navigator.mediaDevices &&
        !!navigator.mediaDevices.enumerateDevices
      ) {
        canEnumerate = true;
      }

      // eslint-disable-next-line no-unused-vars
      let hasMicrophone = false,
        hasSpeakers = false,
        hasWebcam = false;

      let isMicrophoneAlreadyCaptured = false;
      let isWebcamAlreadyCaptured = false;

      if (!canEnumerate) {
        return;
      }

      if (
        !navigator.enumerateDevices &&
        window.MediaStreamTrack &&
        window.MediaStreamTrack.getSources
      ) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
          window.MediaStreamTrack
        );
      }

      if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
      }

      if (!navigator.enumerateDevices) {
        if (callback) {
          callback(null);
        }
        return;
      }

      MediaDevices = [];
      navigator.enumerateDevices(function (devices) {
        devices.forEach(function (_device) {
          let device = {};
          for (let d in _device) {
            device[d] = _device[d];
          }

          if (device.kind === "audio") {
            device.kind = "audioinput";
          }

          if (device.kind === "video") {
            device.kind = "videoinput";
          }

          let skip;
          MediaDevices.forEach(function (d) {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true;
            }
          });

          if (skip) {
            return;
          }

          if (!device.deviceId) {
            device.deviceId = device.id;
          }

          if (!device.id) {
            device.id = device.deviceId;
          }

          if (!device.label) {
            device.label = "Please invoke getUserMedia once.";
            if (!isHTTPs) {
              device.label =
                "HTTPs is required to get label of this " +
                device.kind +
                " device.";
            }
          } else {
            if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true;
            }

            if (device.kind === "audioinput" && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true;
            }
          }

          if (device.kind === "audioinput") {
            hasMicrophone = true;
          }

          if (device.kind === "audiooutput") {
            hasSpeakers = true;
          }

          if (device.kind === "videoinput") {
            hasWebcam = true;
            if (callback) {
              callback(device);
            }
          }

          MediaDevices.push(device);
        });
      });
    },
    deviceNotFound() {},
    CameraSearchingComplete: function (e) {
      if (!e.found) {
        this.deviceNotFound();
        this.deviceStatus = 2;
      } else {
        this.device = e.device;
        this.deviceStatus = 1;
        let timer = setInterval(() => {
          if (!window.cv || !window.cv.CascadeClassifier) {
            return;
          }
          window.clearTimeout(timer);
          this.startDetection();
        }, 500);
      }
    },
    startPhotoCountDownTimer: function () {
      const _self = this;
      if (_self.takePhotoCountDown > 0) {
        _self.photoCountDownTimeout = setTimeout(() => {
          _self.takePhotoCountDown -= 1;
          _self.startPhotoCountDownTimer();
        }, 1000);
      }
    },
    takePhoto: function () {
      const _self = this;
      _self.manualTakePhoto = true;
    },
    infoClick() {
      const modal = document.querySelector(".modal"),
        body = document.getElementById("container"),
        bg = document.querySelector(".bg");

      if (modal && body) {
        bg.style.display = "block";
        modal.style.transform = "translateY(-50%) translateX(-50%)";
        modal.style.display = "block";
        modal.style.position = "relative";
        body.style.opacity = "0.3";
      }
    },
    closeInfo() {
      const modal = document.querySelector(".modal"),
        body = document.getElementById("container"),
        bg = document.querySelector(".bg");
      if (modal && body) {
        modal.style.transform = "translateY(-300vh) translateX(-50%)";
        modal.style.position = "absolute";
        body.style.opacity = "1";
        bg.style.display = "none";
      }
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");

.scan-btn:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 50px;
}

.logo {
  width: 150px;
}

.circle {
  border: 5px solid #ff0000;
  border-radius: 50%;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle img {
  width: 180px;
  height: 150px;
}

.instruction-text {
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  border-radius: 25px;
  max-width: 680px;
  padding: 10px;
  line-height: 30px;
  /*display: none;*/
  margin: auto;
}

.question-img {
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-img img {
  width: 30px;
}

.arrow {
  width: 50px;
}

.advise {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 10px;*/
  /*position: fixed;*/
  /*right: 26%; */
  float: right;
  /*bottom: 4.5%;*/
}

.advise p {
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
}

.photoBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  position: fixed;
  bottom: 5%;
  float: left;
  left: 50%;
  transform: translateX(-50%);
}

.camera-img {
  width: 100px;
  height: 100px;
}

.modal {
  width: 750px;
  height: max-content;
  position: fixed !important;
  left: 50%;
  top: 50%;
  transform: translateY(-300vh) translateX(-50%);
  mix-blend-mode: normal;
  border-radius: 25px;
  padding: 15px 55px;
  transition: all 0.5s;
  overflow: hidden;
  display: block !important;
  z-index: 1000;
}

.modal-bg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
}

.modal h2 {
  font-style: normal;
  font-weight: 600;
  text-align: center;
  max-width: 450px;
  margin: 0 auto 20px auto;
  /* position: relative; */
  font-size: 50px;
}

.modal ul {
  display: flex;
  flex-direction: column;
  max-width: 1300px;
  gap: 40px;
  margin-top: 20px;
}

.modal ul li {
  font-style: normal;
  font-weight: 600;
  line-height: 40px;
  font-size: 20px;
}

.scan-btn {
  font-style: normal;
  font-weight: 600;
  text-align: center;
  display: block;
  /*margin: 55px auto 0 auto;*/
  background: rgba(255, 255, 255, 0);
  border-radius: 15px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  /*padding: 0px 30px;*/
}

.question-img {
  width: 55px;
  height: 55px;
}

.question-img img {
  width: 20px;
}

@media (max-width: 600px) {
  .arrow {
    width: 50px;
    /*top: -20px;*/
  }

  .header {
    gap: 40px;
  }

  .logo {
    width: 100px;
  }

  .circle {
    width: 200px;
    height: 200px;
    border: 2px solid #ff0000;
  }

  .circle img {
    width: 150px;
    height: 100px;
  }

  .photoBlock {
    gap: 30px;
    /*bottom: 7%;*/
  }

  .advise {
    bottom: 6%;
    right: 5%;
  }

  .question-img {
    width: 40px;
    height: 40px;
  }

  .modal-bg {
    top: 0;
  }

  .instruction-text {
    border-radius: 15px;
    font-size: 14px;
    line-height: 20px;
    /*margin-top: -50px;*/
  }

  .camera-img {
    width: 80px;
    height: 80px;
  }

  .question-img img {
    width: 15px;
  }

  .advise p {
    font-size: 12px;
    margin: 10px;
    /*margin-bottom: 0;*/
  }

  .modal {
    width: 90vw;
    height: max-content;
    padding: 15px 16px;
    border-radius: 10px;
  }

  .modal h2 {
    font-size: 28px;
  }

  .modal ul {
    gap: 20px;
    margin-top: 10px;
  }

  .modal ul li {
    line-height: 30px;
    font-size: 18px;
  }

  .scan-btn {
    font-size: 24px;
    padding: 7px;
    margin-top: 11px;
    border-radius: 7px;
  }
}

@media (max-width: 420px) {
  .scan-btn {
    line-height: 0;
    padding: 0;
    margin: auto;
  }

  .scan-btn.advise {
    max-width: 120px;
  }

  .advise {
    width: fit-content;
    text-align: center;
    /*margin: 1em auto;*/
    display: table;
    line-height: 1rem;
  }

  .closeModal {
    padding: 20px 40px !important;
  }
}

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  display: none;
}

.closeModal {
  margin: auto;
  font-weight: 900;
  background: #ffffff;
  border-radius: 15px;
  padding: 0 30px;
}

.scan-btn.advise {
  max-width: 240px;
}
</style>
