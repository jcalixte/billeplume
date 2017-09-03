<template>
  <img src="../assets/loading.png" class="loading" :class="{ visible: !!counter }" alt="Chargement...">
</template>

<script>
  import { default as bus, LOADING, FINISHED } from '@/utils/bus-event'

  export default {
    name: 'loading',
    data () {
      return {
        counter: 0
      }
    },
    created () {
      bus.$on(LOADING, (k) => {
        this.counter++
      })
      bus.$on(FINISHED, (k) => {
        this.counter--
        if (this.counter < 0) {
          this.counter = 0
        }
      })
    }
  }
</script>

<style lang='scss' scoped>
  .loading {
    position: absolute;
    margin: auto;
    top: 3px;
    left: calc(50% - 25px);
    animation: spin 3s linear infinite;
    visibility: hidden;
    
    &.visible {
      visibility: visible;
    }
  }
</style>