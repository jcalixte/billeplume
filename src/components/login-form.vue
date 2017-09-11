<template>
  <div class='login-form'>
    <form @submit.prevent="submit">
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label" for="email">Email</label>
        </div>
        <div class="field-body control">
          <input type="email" id="email" name="email" class="input" v-model="email" placeholder="email">
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label" for="password">Mot de passe</label>
        </div>
        <div class="field-body control">
          <input type="password" name="password" id="password" v-model="password" class="input">
        </div>
      </div>
      <div v-if="isRegister" class="field is-horizontal">
        <div class="field-label">
          <label class="label" for="repeat-password">Confirmation mot de passe</label>
        </div>
        <div class="field-body control">
          <input type="password" name="repeat-password" id="repeat-password" v-model="repeatPassword" class="input">
        </div>
      </div>
      <input type="submit" class="button is-primary" :value="label">
    </form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'login-form',
    props: {
      type: { type: String, default: 'login' }
    },
    data () {
      return {
        email: null,
        password: null,
        repeatPassword: null
      }
    },
    methods: {
      ...mapActions(['register', 'login', 'syncPosts']),
      async submit () {
        switch (this.type) {
          case 'register':
            await this.register({
              email: this.email,
              password: this.password
            })
            this.$emit('submitted')
            break

          case 'login':
          default:
            let user = await this.login({
              email: this.email,
              password: this.password
            })
            this.syncPosts(user.uid)
            this.$emit('submitted')
            break
        }
      }
    },
    computed: {
      label () {
        switch (this.type) {
          case 'register':
            return 'S\'inscrire'

          case 'login':
          default:
            return 'Se connecter'
        }
      },
      isRegister () {
        return this.type === 'register'
      }
    }
  }
</script>
