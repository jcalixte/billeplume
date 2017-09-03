<template>
  <header>
    <div class="user menu">
      <user></user>
    </div>
    <img src="../assets/logo.png" class="logo" alt="Billet Inspiration">
    <loading></loading>
    <div class="context-option menu">
      <context-option></context-option>
    </div>
  </header>
</template>

<script>
  import user from './user'
  import contextOption from './context-option'
  import loading from './loading'

  export default {
    name: 'app-header',
    components: {
      user,
      contextOption,
      loading
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
    color: #000000;
    text-align: center;

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

    @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

    .user {
      float: left;
    }

    .context-option {
      float: right;
    }
    
    [class^="flaticon-"]:before {
      font-size: 30px;
      margin-left: 0;
    }
  }
</style>
