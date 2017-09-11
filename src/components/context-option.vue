<template>
  <div class="dropdown is-right" :class="{ 'is-active': dropdownActive }">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click.prevent="toggle">
        <span class="flaticon-more"></span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="user">
      <div class="dropdown-content">
        <a href="#" class="dropdown-item" @click.prevent="newPost">Nouveau billet</a>
        <a href="#" class="dropdown-item" @click.prevent="deletePost">Supprimer le billet actuel</a>
        
        <div class="select is-info">
          <select id="background" name="background" v-model="background">
            <option v-for="bg in backgrounds" :key="bg.name" :value="bg.name">{{ bg.name }}</option>
          </select>
        </div>

        <div v-if="sharable">
          <hr class="dropdown-divider">
          <a href="#" class="dropdown-item" @click.prevent="share">Partager</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { default as bus, LOADING, FINISHED } from '@/utils/bus-event'

  export default {
    name: 'context-option',
    data () {
      return {
        dropdownActive: false,
        sharable: navigator.share !== undefined
      }
    },
    methods: {
      ...mapActions(['addPost', 'removePost', 'saveBackGround', 'saveFont', 'saveMusic']),
      toggle () {
        this.dropdownActive = !this.dropdownActive
      },
      hide () {
        this.dropdownActive = false
      },
      async newPost () {
        if (this.user && this.user.uid) {
          bus.$emit(LOADING, 'adding-post')
          let post = await this.addPost(this.user.uid)
          this.$router.push({ name: 'writer', params: { id: post.id } })
          bus.$emit(FINISHED, 'adding-post')
        }
      },
      deletePost () {
        if (this.user && this.user.uid && this.currentPostId) {
          this.removePost({ uid: this.user.uid, id: this.currentPostId })
        }
      },
      async share () {
        if (this.sharable) {
          let url = document.location.href
          let canonicalElement = document.querySelector('link[rel=canonical]')
          if (canonicalElement) {
            url = canonicalElement.href
          }
          try {
            await navigator.share({
              title: 'Bille Plume',
              text: 'Notez avec inspiration',
              url: url
            })
          } catch (err) {
            console.error(err)
          }
        }
      }
    },
    computed: {
      ...mapGetters(['user', 'preference', 'currentPostId', 'backgrounds']),
      background: {
        get () {
          return this.preference.background
        },
        set (val) {
          this.saveBackGround(val)
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
</style>
