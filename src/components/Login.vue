<template>
  <section class="login">
      <div v-if="error" class="">{{ error }}</div>
      <form action="#" @submit.prevent="submit">
        <input id="email" v-model="form.email" placeholder="email" type="email" class="full-width" name="email" value required autofocus>
        <input id="password" v-model="form.password" placeholder="mot de passe" type="password" class="full-width" name="password" required>
        <div class="flex all-1 xs m-top-sm">
          <button type="submit" class="btn-violet display-block">
            Se connecter
          </button>
        </div>
      </form>
  </section>
</template>

<style lang="sass">
@import "../../assets/sass/login"
</style>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null
    }
  },
  methods: {
    submit () {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          this.$router.replace({ name: 'home' })
        })
        .catch(err => {
          this.error = err.message
        })
    }
  }
}
</script>
