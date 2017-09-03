<template>
  <section id="app" class="hero is-fullheight">
    <!-- Hero header: will stick at the top -->
    <div class="hero-head">
      <app-header></app-header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container has-text-centered">
        <router-view></router-view>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      Fabriqué par Julien Calixte
      <router-link :to="{ name: 'about'}">À propos</router-link>
    </div>
  </section>
</template>

<script>
  import appHeader from './components/app-header'

  export default {
    name: 'app',
    components: {
      appHeader
    }
  }
</script>

<style lang="scss">
  @import "~bulma";
  @import "~notyf/dist/notyf.min";
  @import "./styles/constants";
  @import "./styles/main";
  @import './assets/icons/flaticon.css';

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $dark-text;

    .hero-foot {
      padding: 5px 15px;
    }
  }
</style>
