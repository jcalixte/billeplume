<template>
  <div class='home'>
    <div v-if="user">
      <div v-if="posts.length">
        <h1 class="title">Vos billets</h1>
        <ul>
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
        </ul>
        <hr>
      </div>
      <router-link :to="{ name: 'writer'}" class="button is-primary">Écrire</router-link>
    </div>
    <div v-else>
      <router-link :to="{ name: 'login'}" class="button">Se connecter / S'inscrire</router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',
    computed: {
      ...mapGetters(['user', 'posts'])
    }
  }
</script>
