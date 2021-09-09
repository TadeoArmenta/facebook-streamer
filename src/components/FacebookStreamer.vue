<template>
  <div class="h-full w-full flex flex-col justify-center bg-gray-600">
    <div class="inline-block absolute top-0 right-0">
    </div>
    <div class="flex flex-row w-full h-full">
      <aside class="w-96 h-full p-5 order-first bg-gray-700 ">
        <h1 class="mt-8 mb-5 text-white font-bold text-lg">Stream Config</h1>
        <div class="space-y-5">
          <div class="flex-1 justify-center">
            <label for="a-bitrate" v-text="'Audio Bitrate'" class="text-white font-medium mb-1" />
            <input 
              v-model="audiobitrate"
              type="number"
              name="a-bitrate"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full">
          </div>
          <div class="flex-1 justify-center">
            <label for="a-width" v-text="'Video Width'" class="text-white font-medium mb-1" />
            <input 
              v-model="width"
              type="number"
              name="v-width"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full">
          </div>
          <div class="flex-1 justify-center">
            <label for="v-height" v-text="'Video Height'" class="text-white font-medium mb-1" />
            <input 
              v-model="height"
              type="number"
              name="v-height"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full">
          </div>
          <div class="flex-1 justify-center">
            <label for="v-framerate" v-text="'Video framerate'" class="text-white font-medium mb-1" />
            <input 
              v-model="framerate"
              type="number"
              name="v-framerate"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full">
          </div>
        </div>
        <h1 class="mt-8 mb-5 text-white font-bold text-lg">Devices</h1>
        <div class="space-y-5">
          <div class="flex-1 justify-center">
            <label for="a-bitrate" v-text="'Video Device'" class="text-white font-medium mb-1" />
            <select
              ref="videoSelect"
              name="a-bitrate"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full"
              @change="onVideoInputSelect">
            </select>
          </div>
          <div class="flex-1 justify-center">
            <label for="a-bitrate" v-text="'Audio Device'" class="text-white font-medium mb-1" />
            <select
              ref="audioInputSelect"
              name="a-bitrate"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full"
              @change="onAudioInputSelect">
            </select>
          </div>
        </div>
        <h1 class="mt-8 mb-5 text-white font-bold text-lg">Target Config</h1>
        <div class="space-y-5">
          <div class="flex-1 justify-center">
            <label for="fb-url" v-text="'Url'" class="text-white font-medium mb-1" />
            <input 
              v-model="facebookUrl"
              type="text"
              name="fb-url"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full">
          </div>
          <div class="flex-1 justify-center">
            <label for="fb-key" v-text="'Key/Stream name'" class="text-white font-medium mb-1" />
            <input 
              v-model="facebookKey"
              type="text"
              name="fb-url"
              :disabled="disableInputs"
              class="rounded-md px-3 py-1 w-full">
          </div>
        </div>
        <div class="mt-8 flex w-full justify-center items-center">
          <button
            ref="startButton"
            type="button"
            :disabled="disableButton"
            class="text-white font-medium text-lg rounded-lg py-2 px-3"
            :class="{
              'bg-green-400': !isStreaming,
              'bg-red-500': isStreaming
            }"
            v-text="isStreaming ? 'Stop' : 'Start'"
            @click="toggleStreaming"/>
        </div>
      </aside>
      <section class="w-full h-full p-5 order-last">
        <div class="flex flex-row mx-5 mt-8 w-full justify-center">
          <video
            id="videoPlayer"
            name="videoPlayer"
            ref="videoPlayer"
            class="w-3/4 h-96 video-js"
            controls preload="auto" poster="https://www.trecebits.com/wp-content/uploads/2017/10/Facebook_Live-.jpg"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref} from "vue";

const videoPlayer       = ref(null);
const audioInputSelect  = ref(null);
const videoSelect       = ref(null);
const audiobitrate      = ref(64);
const width             = ref(1280);
const height            = ref(720);
const framerate         = ref(30);
const facebookUrl       = ref('rtmps://live-api-s.facebook.com:443/rtmp/');
const facebookKey       = ref('');
const devices           = ref(null);

const disableInputs     = ref(false);
const disableButton     = ref(false);
const isStreaming       = ref(false);

const errorCallback = (e) => {
  console.log('Error', e)
};
const gotDevices = (deviceInfos) => {
  console.log(deviceInfos);
  devices.value = deviceInfos;
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
        'Microphone ' + (audioInputSelect.value.length + 1);
      audioInputSelect.value.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'Camera ' +
        (videoSelect.value.length + 1);
      videoSelect.value.appendChild(option);
    }
  }
}
const onAudioInputSelect = event => {
  videoPlayer.value.setSinkId(event.target.value)
    .then(function() {
      console.log('Audio input device attached: ' + event.target.value);
    })
    .catch(errorCallback);
}
const onVideoInputSelect = event => {
  videoPlayer.value.setSinkId(event.target.value)
    .then(function() {
      console.log('Video device attached: ' + event.target.value);
    })
    .catch(errorCallback);
}

const requestMedia = () => {
  navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(errorCallback);
  const constraints = { 
    audio: {
      sampleRate: audiobitrate.value, 
      echoCancellation: true,
      noiseSuppression: true,
      mozNoiseSuppression: true,
      mozAutoGainControl: true,

      googEchoCancellation: true,
      googAutoGainControl: true,
      googExperimentalAutoGainControl: true,
      googNoiseSuppression: true,
      googExperimentalNoiseSuppression: true,
      googTypingNoiseDetection: true,
      googNoiseReduction: true,
    },
		video:{
      width: { min: 720, ideal: width.value, max: 1920 },
      height: { min: 480, ideal: height.value, max: 1080 },
      frameRate: {ideal: framerate.value}
    }
	};
  navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    console.log('Using video device: ' + videoTracks[0].label);
    console.log('Using audio device: ' + audioTracks[0].label);

    stream.onended = function() {
      console.log('Stream ended');
    };

    window.stream = stream; // make variable available to console
    videoPlayer.value.srcObject = stream;
  })
  .catch(errorCallback);
};
const toggleStreaming = () => {
  if(isStreaming){
    window.ipcRenderer.send("streamStop");
  }else{
    const videoTracks = window.stream.getVideoTracks();
    const audioTracks = window.stream.getAudioTracks();
    const data = {
        fbkey: facebookKey.value,
        url: facebookUrl.value,
        audiobitrate: audiobitrate.value,
        size: `${width.value}x${height.value}`,
        framerate: framerate.value,
        video: videoTracks[0].label,
        audio: audioTracks[0].label
    }
    disableInputs.value = true
    disableButton.value = true

    window.ipcRenderer.send("streamStart", data);
  }
};
onMounted(() =>{
  requestMedia()
})

window.ipcRenderer.on('streamStarted', (e) => {
  console.log(e);
  isStreaming.value = true
})
</script>
