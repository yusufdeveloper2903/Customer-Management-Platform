<template>
  <!-- <div v-for="c in MediaDevices">{{ c.label }}</div>
   <div>{{ device ? device.label : "" }}</div> -->
 </template>
 
 <script>
 export default {
   data() {
     return {
       device: null,
       MediaDevices: []
     }
   },
   mounted() {
     this.detectCamera();
   },
   methods: {
     detectCamera: async function () {
       const _self = this;
       await navigator.mediaDevices.getUserMedia({
         video: {
           frameRate: {ideal: 30},
           height: {ideal: 720},
           width: {ideal: 1280},
           facingMode: 'user'
         }, audio: false
       });
       const videoDevices = await _self.checkDeviceSupport();
       if (videoDevices.length === 0) {
         _self.$emit('complete', {
           found: false,
           device: null,
         });
       } else if (videoDevices.length === 1) {
         _self.device = videoDevices[0];
         _self.$emit('complete', {
           found: true,
           device: _self.device,
         });
       } else {
         for (let $i = 0; $i < videoDevices.length; $i++) {
           const videoDevice = videoDevices[$i]
           if (videoDevice && videoDevice.label && videoDevice.label.toLowerCase().indexOf('front') >= 0) {
             _self.device = videoDevice;
             _self.$emit('complete', {
               found: true,
               device: _self.device,
             });
             return;
           }
         }
         if (_self.device === null) {
           _self.device = videoDevices[0];
           _self.$emit('complete', {
             found: true,
             device: _self.device,
           });
         }
       }
     },
     checkDeviceSupport: function () {
       const _self = this;
       return new Promise((resolve, reject) => {
         if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
           // Firefox 38+ seems having support of enumerateDevicesx
           navigator.enumerateDevices = function (callback) {
             navigator.mediaDevices.enumerateDevices().then(callback);
           };
         }
 
         //let MediaDevices = [];
         let VideoDevices = [];
         const isHTTPs = location.protocol === 'https:';
         let canEnumerate = false;
 
         if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
           canEnumerate = true;
         } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
           canEnumerate = true;
         }
 
         let hasMicrophone = false;
         let hasSpeakers = false;
         let hasWebcam = false;
 
         let isMicrophoneAlreadyCaptured = false;
         let isWebcamAlreadyCaptured = false;
 
         if (!canEnumerate) {
           resolve(VideoDevices)
           return;
         }
 
         if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
           navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
         }
 
         if (!navigator.enumerateDevices && navigator.enumerateDevices) {
           navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
         }
 
         if (!navigator.enumerateDevices) {
           resolve(VideoDevices)
           return;
         }
 
         _self.MediaDevices = [];
         navigator.enumerateDevices(function (devices) {
           for (let $i = 0; $i < devices.length; $i++) {
             const _device = devices[$i];
             let device = {};
             for (let d in _device) {
               device[d] = _device[d];
             }
 
             if (device.kind === 'audio') {
               device.kind = 'audioinput';
             }
 
             if (device.kind === 'video') {
               device.kind = 'videoinput';
             }
 
             let skip;
             _self.MediaDevices.forEach(function (d) {
               if (d.id === device.id && d.kind === device.kind) {
                 skip = true;
               }
             });
 
             if (skip) {
               continue;
             }
 
             if (!device.deviceId) {
               device.deviceId = device.id;
             }
 
             if (!device.id) {
               device.id = device.deviceId;
             }
 
             if (!device.label) {
               device.label = 'Please invoke getUserMedia once.';
               if (!isHTTPs) {
                 device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
               }
             } else {
               if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
                 isWebcamAlreadyCaptured = true;
               }
 
               if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
                 isMicrophoneAlreadyCaptured = true;
               }
             }
 
             if (device.kind === 'audioinput') {
               hasMicrophone = true;
             }
 
             if (device.kind === 'audiooutput') {
               hasSpeakers = true;
             }
 
             if (device.kind === 'videoinput') {
               hasWebcam = true;
               VideoDevices.push(device);
             }
             _self.MediaDevices.push(device);
           }
           resolve(VideoDevices)
         });
       })
     },
   }
 }
 </script>