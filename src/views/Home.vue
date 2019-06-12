<template>
  <div class="home">
    <article-compose />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ArticleCompose from '@/components/ArticleCompose.vue'

@Component({
  components: {
    ArticleCompose
  },
})
export default class Home extends Vue {}
</script>
