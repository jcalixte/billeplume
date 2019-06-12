<template>
  <div class="spotify-player">
    <div class="music-selector" @click="stopMusic" :class="{ selected: !selectedMusic }">
      <img class="note" src="../assets/icons/mute.svg">
    </div>
    <div
      v-for="(music, k) in musics"
      :key="k"
      @click="selectMusic(music)"
      class="music-selector"
      :style="getStyle(music)"
      :class="{ selected: selectedMusic === music }"
    >
      <img class="note" src="../assets/icons/note.svg">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IImportMusic from '@/models/IImportMusic'
import bus, { MUSIC_UPDATE } from '@/utils/bus-event'
import { media, mediaList } from '@/utils/music-list'

@Component
export default class SpotifyPlayer extends Vue {
  @Prop({ type: Boolean, default: true })
  public enable!: boolean
  public musics: string[] = media
  public selectedMusic: string = ''
  public flush: HTMLAudioElement = new Audio()

  public async mounted(): Promise<void> {
    this.flush.loop = true
    if (this.enable) {
      // musicService.initPlayer()
    }
    bus.$on(MUSIC_UPDATE, this.manageMusic)
  }

  public beforeDestroy(): void {
    bus.$off(MUSIC_UPDATE, this.manageMusic)
  }

  public manageMusic(state: any): void {
    // tslint:disable-next-line:no-console
    console.log({ state })
  }

  public getStyle(music: string): any {
    return {
      'background-color': mediaList[music].color
    }
  }

  public stopMusic(): void {
    this.selectedMusic = ''
    this.flush.pause()
  }

  public async selectMusic(music: string): Promise<void> {
    this.selectedMusic = music
    const m: string = await mediaList[music].media()
    this.flush.pause()
    this.flush.src = m
    this.flush.load()
    this.flush.play()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.spotify-player {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.music-selector {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-block;
  background-color: rgb(163, 163, 163);
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
  &.selected {
    border: 2px solid white;
  }
}
</style>
