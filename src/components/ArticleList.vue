<template>
  <div class="article-list">
    <div v-if="articles.length" class="article-container">
      <ul>
        <li v-for="article in articles" :key="article._id">
          <button class="is-main" @click="select(article._id)">
            {{ article.title }}
          </button>
          <p v-if="article.chapter">Chapitre {{ article.chapter }}.</p>
          <p>
            {{ article.date | fulldate }}
          </p>
          <div>
            <button class="action-article" @click="saveArticles(article)">
              <img class="icon" alt="Exporter" src="../assets/icons/upload.svg">
            </button>
            <button class="action-article" @click="remove(article._id)">
              <img class="icon" alt="Supprimer" src="../assets/icons/delete.svg">              
            </button>
          </div>
        </li>
      </ul>
      <div class="action">
        <button @click="chooseFile">
          <img class="icon" alt="Charger" src="../assets/icons/download.svg">
        </button>
        <button @click="saveArticles()">
          <img class="icon" alt="Exporter" src="../assets/icons/upload.svg">
        </button>
      </div>
    </div>
    <div v-else>
      <p>Aucun billet enregistré.</p>
      <div class="action">
        <button @click="chooseFile">
          <img class="icon" alt="Charger" src="../assets/icons/download.svg">
        </button>
      </div>
    </div>
    <input type="file" ref="file" accept=".bp">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import articleService from '@/services/ArticleService'
import IArticle from '@/models/IArticle'
import bus, { ARTICLE_CHANGE } from '@/utils/bus-event'

@Component
export default class ArticleList extends Vue {
  public articles: IArticle[] = []

  public async created(): Promise<void> {
    await this.getArticles()
    bus.$on(ARTICLE_CHANGE, this.getArticles)
    if (this.$refs.file) {
      const file = this.$refs.file as HTMLInputElement
      file.addEventListener('change', this.download)
    }
  }

  public beforeDestroy(): void {
    bus.$off(ARTICLE_CHANGE, this.getArticles)
    if (this.$refs.file) {
      const file = this.$refs.file as HTMLInputElement
      file.addEventListener('change', this.download)
    }
  }

  public chooseFile(): void {
    if (this.$refs.file) {
      const file = this.$refs.file as HTMLInputElement
      file.click()
    }
  }

  public download(fileEvent: any): void {
    if (fileEvent &&
      fileEvent.target &&
      fileEvent.target.files) {
      const file = fileEvent.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async () => {
          if (!reader.result) {
            return
          }
          const result: string = reader.result.toString()
          const articleList: IArticle[] = JSON.parse(result)
          if (articleList && articleList.length) {
            for (const article of articleList) {
              await articleService.add(article)
            }
          }
        }
        reader.readAsText(file)
      }
    }
  }

  public saveArticles(article?: IArticle): void {
    const element = document.createElement('a')
    const saving = article
      ? articleService.unmodel(article)
      : articleService.unmodel(...this.articles)
    const content = JSON.stringify(saving)
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `billeplume-${new Date().toISOString()}.bp`)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  public async getArticles(): Promise<void> {
    this.articles = await articleService.getAll()
  }

  public async remove(id: string): Promise<void> {
    await articleService.remove(id)
    this.$emit('select', id)
  }

  public select(id: string) {
    this.$emit('select', id)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables';

h3 {
  margin: 40px 0 0;
}
.article-list {
  input {
    display: none;
    visibility: hidden;
  }
}
.article-container {
  display: flex;
  button.action-article {
    margin: 5px 5px 0;
    img {
      width: 20px;
    }
  }
}
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex: 1;
  justify-content: center;
}
li {
  display: flex;
  flex-direction: column;
  flex-basis: content;
  justify-content: space-between;
  margin: 0 10px;
  padding: 15px;
  border: 2px solid $primary;
  min-height: 150px;
  width: 150px;
}
a {
  color: #383838;
  text-decoration: none;
}
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 50px;
  button {
    margin: 5px 5px 5px;
  }
}
</style>
