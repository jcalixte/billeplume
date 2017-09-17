<template>
  <spinner :depth="1" :size="50" class="loading" color="#01a3a2" :class="{ visible }"></spinner>
</template>

<script>
  import spinner from './spinner'
  import { default as bus, LOADING, FINISHED } from '@/utils/bus-event'

  export default {
    name: 'loading',
    components: {
      spinner
    },
    data () {
      return {
        counter: {},
        visible: false
      }
    },
    created () {
      bus.$on(LOADING, (k) => {
        if (!(k in this.counter)) {
          this.counter[k] = 0
        }
        this.counter[k]++
        this.manageVisibility()
      })
      bus.$on(FINISHED, (k) => {
        if (k in this.counter) {
          this.counter[k]--
          if (this.counter[k] < 0) {
            this.counter[k] = 0
          }
        }
        this.manageVisibility()
      })
    },
    methods: {
      manageVisibility () {
        let i = 0
        for (let k in this.counter) {
          i += this.counter[k]
        }
        this.visible = !!i
      }
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
    opacity: 0;
    transition: opacity .5s;
    
    &.visible {
      visibility: visible;
      opacity: 1;
    }
  }
</style>