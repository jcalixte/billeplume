<template>
  <div class="dropdown is-right" :class="{ 'is-active': dropdownActive }">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click.prevent="toggle">
        <span class="flaticon-more"></span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="user">
      <div class="dropdown-content" @click="hide">
        <a href="#" class="dropdown-item" @click.prevent="addPost">Nouveau billet</a>
        <a href="#" class="dropdown-item" @click.prevent="deletePost">Supprimer le billet actuel</a>
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

  export default {
    name: 'context-option',
    data () {
      return {
        dropdownActive: false,
        sharable: navigator.share !== undefined
      }
    },
    methods: {
      ...mapActions(['newPost', 'removePost']),
      toggle () {
        this.dropdownActive = !this.dropdownActive
      },
      hide () {
        this.dropdownActive = false
      },
      addPost () {
        if (this.user && this.user.uid) {
          this.newPost(this.user.uid)
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
              text: 'Notez avec l\'inspiration',
              url: url
            })
          } catch (err) {
            console.error(err)
          }
        }
      }
    },
    computed: {
      ...mapGetters(['user', 'currentPostId'])
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
