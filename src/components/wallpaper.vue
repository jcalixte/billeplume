<template>
  <div class="wallpaper" :style="style">
    <slot></slot>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'wallpaper',
    computed: {
      ...mapGetters(['backgrounds', 'musics', 'preference']),
      background () {
        if (this.preference.background && this.backgrounds) {
          return this.backgrounds.find(b => b.name === this.preference.background)
        }
        return null
      },
      style () {
        if (!this.background) {
          return null
        }
        return {
          'background-image': `url("${this.background.src}")`,
          color: this.background.color
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  .wallpaper {
    background-color: aliceblue;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center; 
    width: 100%;
    flex: auto;
    transition: background-image 1s ease-in-out;
  }
</style>
