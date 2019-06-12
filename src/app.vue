<template>
  <div id="app">
    <router-view/>
    <service-worker-watcher />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import musicService from '@/services/MusicService'

@Component({
  components: {
    'music-player': () => import('@/components/MusicPlayer.vue'),
    'service-worker-watcher': () => import('@/components/ServiceWorkerWatcher.vue')
  }
})
export default class App extends Vue {}
</script>
