<template>
  <div class="article-compose" v-if="article">
    <div class="title">
      <input
        type="text"
        name="title"
        class="article-title content"
        :class="article.font"
        :placeholder="project"
        v-model.trim="article.title"
      >
      <h3 v-if="article.chapter">Chapitre {{ article.chapter }}</h3>
    </div>
    <div class="param-action">
      <img
        @click="activeTab('param')"
        src="../assets/icons/param.svg"
        alt="parameters"
        class="icon toggle param"
        :class="{ selected: tab === 'param' }"
      >
      <img
        @click="newArticle"
        src="../assets/icons/add.svg"
        alt="new article"
        class="icon new-article"
      >
      <img
        @click="activeTab('article-list')"
        src="../assets/icons/param.svg"
        alt="view articles"
        class="icon toggle article-list"
        :class="{ selected: tab === 'article-list' }"
      >
    </div>
    <div class="main-content">
      <textarea
        name="content"
        v-model.trim="article.content"
        class="content"
        :class="article && article.font"
        :placeholder="placeholder"
      ></textarea>
    </div>
    <div class="notification">
      <div class="word-count">{{ wordCount }}</div>
      <div class="progress" v-if="article.progressType !== progressType.none">
        <div v-if="article.progressType === progressType.all">
          <div>j
            <time-progress :type="progressType.day"/>
          </div>
          <div>m
            <time-progress :type="progressType.month"/>
          </div>
          <div>a
            <time-progress :type="progressType.year"/>
          </div>
        </div>
        <div v-else>
          <time-progress :type="article.progressType"/>
        </div>
      </div>
      <div v-if="article.title">
        <img class="icon" @click="newChapter" src="../assets/icons/right-arrow.svg">
      </div>
    </div>

    <div class="param-container tab" v-if="article" v-show="tab === 'param'">
      <article-options
        :id="article._id"
        :slug="article.slug"
        :font.sync="article.font"
        :color.sync="article.color"
        :article-progress-type.sync="article.progressType"
        :version="article.version"
        @publish="publish"
      />
    </div>
    <div class="article-list-container tab" v-show="tab === 'article-list'">
      <article-list @select="selectArticle"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import articleService from '@/services/ArticleService'
import ProgressType from '@/enums/ProgressType'
import IArticle from '@/models/IArticle'
import projects from '@/data/projects'
import { debounce } from 'lodash-es'

const saveArticle = debounce((article: IArticle, emit?: boolean) => {
  if (!article._id) {
    if (article.title) {
      articleService.add(article)
    }
  } else {
    articleService.save(article, emit)
  }
}, 500)

@Component({
  components: {
    'article-list': () => import('@/components/ArticleList.vue'),
    'article-options': () => import('@/components/ArticleOptions.vue'),
    'time-progress': () => import('@/components/TimeProgress.vue')
  }
})
export default class ArticleCompose extends Vue {
  @Prop({ type: String, default: '' })
  public id!: string
  public article: IArticle = articleService.create()
  public progressType = ProgressType
  public project: string = projects[Math.floor(Math.random() * projects.length)]
  public tab: string = ''

  public async created(): Promise<void> {
    if (this.id) {
      this.article =
        (await articleService.get(this.id)) || articleService.create()
    } else {
      this.article = (await articleService.getLast()) || articleService.create()
    }
    document.addEventListener('backbutton', this.backbutton)
  }

  public destroyed(): void {
    document.removeEventListener('backbutton', this.backbutton)
  }

  public backbutton(): boolean {
    if (this.tab) {
      this.tab = ''
      return false
    }
    // @ts-ignore
    const app: any = navigator.app as an
    if (app && app.exitApp) {
      app.exitApp()
    }
    return true
  }

  public async newArticle(): Promise<void> {
    if (this.article.title) {
      await articleService.save(this.article)
    }
    this.article = articleService.create()
  }

  public async selectArticle(id: string): Promise<void> {
    const article = await articleService.get(id)
    if (article) {
      if (this.article._id) {
        await articleService.save(this.article)
      }
    }
    this.article = article || articleService.create()
    this.tab = ''
  }

  public activeTab(tab: string) {
    if (this.tab !== tab) {
      this.tab = tab
    } else {
      this.tab = ''
    }
  }

  public async newChapter(): Promise<void> {
    if (!this.article) {
      return
    }
    if (!this.article.chapter) {
      this.article.chapter = 1
      await articleService.save(this.article, true)
    }
    this.article = await articleService.newChapter(this.article)
  }

  public save(emit?: boolean): void {
    if (this.article) {
      saveArticle(this.article, emit)
    }
  }

  public async publish(): Promise<void> {
    const success = await articleService.publish(this.article)
    if (success) {
      alert('Article publié !')
    } else {
      alert('Problème lors de la publication')
    }
  }

  public get contentFiltered(): string {
    if (!this.article || !this.article.content) {
      return ''
    }
    return this.article.content
      .normalize('NFD')
      .replace(/\W/g, ' ')
      .replace(/\s\s+/g, ' ')
      .trim()
  }

  public get wordCount(): number {
    if (!this.contentFiltered) {
      return 0
    }
    return this.contentFiltered.split(' ').length
  }

  public get placeholder(): string {
    return `Même ${this.project} a commencé par une feuille blanche...`
  }

  @Watch('article.title', { immediate: true })
  public onTitleChange() {
    this.save(true)
    this.tab = ''
  }

  @Watch('article.content', { immediate: true })
  public onContentChange() {
    this.save()
    this.tab = ''
  }

  @Watch('article.color', { immediate: true })
  public onColorChange(color: string) {
    if (document.documentElement) {
      document.documentElement.style.setProperty('--top-color', color)
    }
    this.save()
  }

  @Watch('article.font', { immediate: true })
  public onFontChange(font: string) {
    this.save()
  }

  @Watch('article.progressType', { immediate: true })
  public onProgressTypeChange(font: string) {
    this.save()
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
$top-color: #f7b380;
$bottom-color: #fff;
$space: 15px;

:root {
  --top-color: $top-color;
}
body {
  background: $top-color;
  background: linear-gradient(to bottom, var(--top-color), $bottom-color)
    no-repeat;
}

.title {
  margin: $space;
}
.article-compose {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;

  .main-content {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .tab {
    background-color: lighten($primary, 10%);
    padding: $space;
    max-height: 65vh;
    overflow: auto;
  }
  .article-title {
    border: none;
    font-size: 24pt;
    font-variant: small-caps;
    background-color: transparent;
    text-align: center;
    width: 100%;
    &:focus {
      outline: none;
    }
  }
  textarea {
    font-size: 16pt;
    resize: none;
    padding: $space;
    width: calc(100% - #{$space} * 2);
    max-width: 800px;
    min-height: 100%;
    text-align: justify;
    &,
    &:focus {
      border: none;
      background-color: transparent;
      outline: none;
    }
  }

  .content {
    &.cursive {
      font-family: 'Baloo', cursive;
      font-size: 18pt;
      font-variant: none;
    }

    &.monospace {
      font-family: 'Source Code Pro', monospace;
    }

    &.sans-serif {
      font-family: 'Quicksand', sans-serif;
    }

    &.serif {
      font-family: 'Alegreya', serif;
    }

    &.handwriting {
      font-family: 'Courgette', cursive;
      font-size: 18pt;
      font-variant: none;
    }
  }
}
.param-action {
  img {
    &:hover {
      cursor: pointer;
    }
    &.selected {
      background-color: lighten($primary, 10%);
      border-radius: 50%;
    }
    &.param {
      transform: rotate(90deg);
      &.active {
        transform: rotate(0.5turn);
      }
    }
    &.article-list {
      &.active {
        transform: rotate(0.25turn);
      }
    }
    &.toggle {
      will-change: transform;
      transition: transform 0.3s ease-out;
    }
  }
}
.notification {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-family: 'Source Code Pro', monospace;
  text-align: left;
  padding: $space;
  .word-count {
    font-size: 18pt;
    flex: 1;
  }
  .progress {
    flex: 3;
  }
  .word-count,
  .progress {
    text-align: center;
  }
  img {
    vertical-align: text-top;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
