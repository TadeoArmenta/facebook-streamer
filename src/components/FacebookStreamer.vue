<template>
  <div class="h-full w-full flex flex-col justify-center items-center bg-gray-600">
    <div class="inline-block absolute top-0 right-0">
    </div>
    <div class="flex flex-row mx-5 mt-10 w-full justify-center">
      <video ref="videoPlayer" class="video-js vjs-default-skin w-3/4 h-96" />
    </div>
  </div>
</template>

<script setup>
import videojs from 'video.js';
import 'video.js/dist/video-js.css'
import {onMounted, ref} from "vue";
const src = ref('rtmp://localhost:5050/live/video')
const videoPlayer = ref(null);
const player = ref(null);
const onPlayerReady = (it) => {
  console.log('onPlayerReady', it);
}
onMounted(() =>{
  player.value = videojs(videoPlayer.value, {
    autoplay: true,
    controls: true,
    poster: 'https://vjs.zencdn.net/v/oceans.png',
    sources: [
      {
        src: 'http://localhost:8000/live/video/index.m3u8',
      }
    ]
  }, onPlayerReady)
})
</script>
