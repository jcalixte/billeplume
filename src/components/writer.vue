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
    name: 'hello',
    props: {
      postId: { type: Number, required: true }
    },
    mounted () {
      if (this.postId) { 
        this.setCurrentPostId(this.postId)
      }
    },
    methods: {
      ...mapActions(['syncPosts', 'updatePost', 'setCurrentPostId']),
      saveTitle: debounce(function (title) {
        if (this.id) {
          this.updatePost({
            id: this.id,
            uid: this.user.uid,
            title: title,
            content: this.content
          })
        }
      }, 500),
      saveContent: debounce(function (content) {
        if (this.id) {
          this.updatePost({
            id: this.id,
            uid: this.user.uid,
            title: this.title,
            content: content
          })
        }
      }, 500)
    },
    computed: {
      ...mapGetters(['user', 'posts']),
      post () {
        return this.posts.find(p => p.id === this.id)
      },
      title: {
        get () {
          return this.post ? this.post.title : null
        },
        set (val) {
          if (this.id) {
            this.saveTitle(val)
          }
        }
      },
      content: {
        get () {
          return this.post ? this.post.content : null
        },
        set (val) {
          if (this.id) {
            this.saveContent(val)
          }
        }
      }
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
    display: inline-block;
    text-align: center;
    margin-bottom: 15px;

    &.title-post {
      border: none;
      border-bottom: 1px solid rgba(0,0,0,.12);
    }
  }
  
  textarea {
    border: none;
    background-color: rgba($primary, .1);
    font-family: 'Montserrat Alternates', sans-serif;
    margin-top: 15px;
  }
</style>
