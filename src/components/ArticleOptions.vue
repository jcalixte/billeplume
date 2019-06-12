<template>
  <div class="article-options">
    <div>
      <h4 class="title">Police d'écriture</h4>
      <ul>
        <li v-for="(f, k) in fontTypes" :key="k">
          <button :class="{ 'is-main': isFontSelected(f) }" @click="selectFont(f)">{{ f }}</button>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="title">Couleur</h4>
      <ul>
        <li v-for="(c, l) in colors" :key="l">
          <button
            :class="{ 'is-main': isColorSelected(c.value) }"
            :style="`border-color: ${c.value}; background-color: ${c.value};`"
            @click="selectColor(c.value)"
          >{{ c.label }}</button>
        </li>
      </ul>
    </div>
    <div>
      <h4>Musique</h4>
      <music-player/>
    </div>
    <div>
      <h4 class="title">Progression</h4>
      <ul>
        <li v-for="p in progressTypes" :key="p">
          <button
            :class="{ 'is-main': isProgressTypeSelected(p) }"
            @click="selectProgressType(p)"
          >{{ progressTypeLabel[p] }}</button>
        </li>
      </ul>
    </div>
    <div v-if="id">
      <h4 class="title">Publication</h4>
      <p>
        <button @click="publish">publier</button>
        &nbsp;
        <a
          v-if="isPublished"
          :href="publishedLink"
          target="_blank"
          rel="noreferrer"
        >Version {{ version }}</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import colors from '@/data/colors'
import Font from '@/enums/Font'
import ProgressType, { progressTypeLabel } from '@/enums/ProgressType'
import IArticle from '@/models/IArticle'
import IColor from '@/models/IColor'

@Component({
  components: {
    'music-player': () => import('./MusicPlayer.vue')
  }
})
export default class ArticleOptions extends Vue {
  @Prop({ type: String, default: '' })
  private id!: string
  @Prop({ type: String, default: '' })
  private slug!: string
  @Prop({ type: String, required: true })
  private font!: string
  @Prop({ type: String, required: true })
  private color!: string
  @Prop({ type: Number, required: true })
  private articleProgressType!: ProgressType
  @Prop({ type: Number, default: 0 })
  private version!: number
  private colors: IColor[] = colors
  private progressTypes: ProgressType[] = [
    ProgressType.none,
    ProgressType.all,
    ProgressType.year,
    ProgressType.month,
    ProgressType.day
  ]
  private progressTypeLabel = progressTypeLabel
  private fontTypes: Font[] = [
    Font.serif,
    Font.sansSerif,
    Font.cursive,
    Font.handwriting,
    Font.monospace
  ]

  public selectFont(font: string): void {
    this.$emit('update:font', font)
  }

  public isFontSelected(font: string): boolean {
    return this.font === font
  }

  public selectColor(color: string): void {
    this.$emit('update:color', color)
  }

  public isColorSelected(color: string): boolean {
    return this.color === color
  }

  public selectProgressType(progressType: number): void {
    this.$emit('update:articleProgressType', progressType)
  }

  public isProgressTypeSelected(progressType: number): boolean {
    return this.articleProgressType === progressType
  }

  public publish(): void {
    this.$emit('publish')
  }

  public get isPublished(): boolean {
    return !!(this.version && this.id && this.slug)
  }

  public get publishedLink(): string {
    return `https://plumebille.azurewebsites.net/article/${this.slug}/${
      this.id
    }`
  }
}
</script>

<style scoped lang="scss">
.article-options {
  display: flex;
  justify-items: center;
  justify-content: space-around;
  flex-wrap: wrap;

  .title {
    margin: 0 0 -10px;
  }

  p {
    margin: 15px;
  }

  ul {
    margin: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  li {
    margin: 5px;
  }
}
</style>
