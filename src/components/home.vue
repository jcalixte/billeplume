<template>
  <div class='home'>
    <div v-if="user">
      <div v-if="posts.length">
        <h1 class="title">Vos billets</h1>
        <ul>
          <li v-for="post in posts" :key="post.id">
            <router-link :to="{ name: 'writer', params: { id: post.id }}">{{ post.title }}</router-link>
          </li>
        </ul>
      </div>
      <br>
      <router-link v-if="posts && posts[0]" :to="{ name: 'writer', params: { id: posts[0].id }}" class="button is-primary">Écrire</router-link>
      <a href="#" v-else class="button is-primary" @click.prevent="newPost">Écrire</a>
    </div>
    <div v-else>
      <router-link :to="{ name: 'login'}" class="button is-primary">Se connecter / S'inscrire</router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { default as bus, LOADING, FINISHED } from '@/utils/bus-event'

  export default {
    name: 'home',
    computed: {
      ...mapGetters(['user', 'addPost', 'posts']),
      async newPost () {
        if (this.user && this.user.uid) {
          bus.$emit(LOADING, 'adding-post')
          let post = await this.addPost(this.user.uid)
          this.$router.push({ name: 'writer', params: { id: post.id } })
          bus.$emit(FINISHED, 'adding-post')
        }
      }
    }
  }
</script>
