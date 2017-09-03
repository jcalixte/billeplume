<template>
  <div class='posts'>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'posts',
    computed: {
      ...mapGetters(['posts'])
    }
  }
</script>

<style lang='scss' scoped>
  // .posts {

  // }
</style>
