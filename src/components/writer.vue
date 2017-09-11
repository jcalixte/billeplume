<template>
  <div class="writer">
    <input type="text" class="input title-post" placeholder="Titre" v-model="title">
    <div v-if="post">
      {{ post.date|date }}
      {{ post.date|time }}
    </div>
    
    <textarea name="content" id="content" cols="40" rows="10" v-model="content" class="textarea"></textarea>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import debounce from 'lodash/debounce'

  export default {
    name: 'writer',
    props: {
      id: { type: String, required: true }
    },
    data () {
      return {
        localId: null
      }
    },
    mounted () {
      this.localId = this.id
    },
    methods: {
      ...mapActions(['syncPosts', 'updatePost', 'setCurrentPostId', 'resetCurrentPost']),
      saveTitle: debounce(function (title) {
        if (this.localId) {
          this.updatePost({
            id: this.localId,
            uid: this.user.uid,
            title: title,
            content: this.content
          })
        }
      }, 3000),
      saveContent: debounce(function (content) {
        if (this.localId) {
          this.updatePost({
            id: this.localId,
            uid: this.user.uid,
            title: this.title,
            content: content
          })
        }
      }, 3000)
    },
    computed: {
      ...mapGetters(['user', 'posts', 'currentPostId']),
      post () {
        return this.posts.find(p => p.id === this.localId)
      },
      title: {
        get () {
          if (this.localId && this.currentPostId !== this.localId) {
            this.setCurrentPostId(this.localId)
          }
          return this.post ? this.post.title : null
        },
        set (val) {
          if (this.localId) {
            this.saveTitle(val)
          }
        }
      },
      content: {
        get () {
          return this.post ? this.post.content : null
        },
        set (val) {
          if (this.localId) {
            this.saveContent(val)
          }
        }
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (this.id) {
        this.localId = this.id
        this.setCurrentPostId(this.localId)
      }
      next()
    },
    beforeRouteLeave (to, from, next) {
      this.localId = null
      this.resetCurrentPost()
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../styles/constants';
  
  .writer {
    padding: 15px;
  }

  .input, .textarea {
    box-shadow: none;
  }
  
  input {
    color: inherit;
    display: inline-block;
    text-align: center;
    margin-bottom: 15px;

    &.title-post {
      border: none;
      border-bottom: 1px solid rgba(0,0,0,.12);
      background-color: transparent;
    }
  }
  
  textarea {
    border: none;
    background-color: transparent;
    color: inherit;
    font-family: 'Montserrat Alternates', sans-serif;
    margin-top: 15px;
  }
</style>
