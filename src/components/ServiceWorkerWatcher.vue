<template>
  <div class="service-worker-watcher" v-if="newServiceWorker && !close">
    <button @click="close = true">&times;</button>
    <p>
      Une nouvelle version de l'application vient d'être installée !
    </p>
    <p>Elle sera disponible au prochain démarrage de Bille Plume.</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import bus from '@/utils/bus-event'

@Component
export default class ServiceWorkerWatcher extends Vue {
  @Getter
  public newServiceWorker!: boolean
  public close: boolean = false
}
</script>

<style scoped lang="scss">
@import '../styles/variables';
$size: 30px;
.service-worker-watcher {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 15px;
  background-color: $primary;
  color: $dark-text-color;
  button {
    background-color: $light-text-color;
    border-color: $light-text-color;
    float: right;
    width: $size;
    height: $size;
    font-size: 20px;
    padding: 0;
  }
}
</style>
