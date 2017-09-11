<template>
  <header :class="{ writing: !!currentPostId }">
    <div class="user menu">
      <context-user></context-user>
    </div>
    <img src="../assets/logo.png" class="logo" alt="Billet Inspiration">
    <loading></loading>
    <div class="context-option menu">
      <context-option></context-option>
    </div>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'
  import contextUser from './context-user'
  import contextOption from './context-option'
  import loading from './loading'

  export default {
    name: 'app-header',
    components: {
      contextUser,
      contextOption,
      loading
    },
    computed: {
      ...mapGetters(['currentPostId'])
    }
  }
</script>

<style lang="scss">
  @import '../styles/constants';

  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: $primary;
    text-align: center;
    transition: background-color 1s ease-in-out;

    &.writing {
      background-color: $primary-transparent;
    }

    .button {
      color: inherit;

      &:active, &:hover, &:visited, &:focus {
        color: inherit;
      }
    }

    .menu {
      height: 56px;
      line-height: 56px;
    }

    .title {
      font-size: 20px;
      line-height: 1;
      letter-spacing: .02em;
      font-weight: 400;
    }

    .logo {
      vertical-align: middle;
    }

    .user {
      position: absolute;
      top: 0;
      left: 15px;
    }

    .context-option {
      position: absolute;
      top: 0;
      right: 15px;
    }
    
    [class^="flaticon-"]:before {
      font-size: 30px;
      margin-left: 0;
    }
  }
</style>
