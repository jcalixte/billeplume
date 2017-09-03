<template>
  <div class='login columns'>
    <div class="column is-half">
      <h2>Se connecter</h2>
      <login-form @submitted="submitted"></login-form>
    </div>
    <div class="column is-half">
      <h2>S'inscrire</h2>
      <login-form @submitted="submitted" type="register"></login-form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import loginForm from './login-form'

  export default {
    name: 'login',
    components: {
      loginForm
    },
    methods: {
      submitted () {
        if (this.user) {
          this.$router.push('writer')
        }
      }
    },
    computed: {
      ...mapGetters(['user'])
    }
  }
</script>
