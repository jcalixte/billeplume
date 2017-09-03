<template>
  <div class="dropdown" :class="{ 'is-active': dropdownActive }">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click.prevent="toggle">
        <span class="flaticon-user-2"></span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content" @click="hide">
        <div v-if="posts && posts.length" class="post-container">
          <h3>Billets</h3>
          <router-link class="dropdown-item post" v-for="(post, key) in posts" v-if="post && key < 3" :key="post.id"
                       :to="{ name: 'writer', params: { id: post.id }}">
            {{ post.title }}
          </router-link>
          <router-link :to="{ name: 'posts'}" class="dropdown-item" v-if="posts && posts.length > maxItem">
            Tous les billets
          </router-link>
        </div>
        <div v-if="user">
          <hr class="dropdown-divider">
          <a href="#" class="dropdown-item">
            {{ user.email }}
          </a>
          <a href="#" class="dropdown-item" @click.prevent="disconnect">
            Se déconnecter
          </a>
        </div>
        <div v-else>
          <router-link :to="{ name: 'login'}" class="dropdown-item" v-if="!user">Se connecter / S'inscrire</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'user',
    data () {
      return {
        dropdownActive: false,
        init: true,
        maxItem: 3
      }
    },
    mounted () {
      if (this.user) {
        this.syncPosts(this.user.uid)
        this.init = false
      }
    },
    methods: {
      ...mapActions(['logout', 'syncPosts', 'setCurrentPost', 'resetPost']),
      toggle () {
        this.dropdownActive = !this.dropdownActive
      },
      hide () {
        this.dropdownActive = false
      },
      async disconnect () {
        await this.logout()
        this.resetPost()
      }
    },
    computed: {
      ...mapGetters(['user', 'posts'])
    },
    watch: {
      user (val) {
        if (this.init && val.uid) {
          this.syncPosts(val.uid)
          this.init = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button {
    background: transparent;
    border: none;
    display: inline;
  }

  .post-container {
    a.dropdown-item {
      padding-right: 0;
    }
  }
</style>
