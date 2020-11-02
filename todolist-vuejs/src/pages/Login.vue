<template>
  <section class="login">
    <div class="main">
      <h1 class="logo"><span>Ma Todo Liste</span></h1>
      <h2>Connexion</h2>
      <div class="container-small">
        <div v-if="error" class="">{{ error }}</div>
        <div class="bloc-grey">
          <form action="#" @submit.prevent="submit">
            <input id="email" v-model="form.email" placeholder="email" type="email" class="full-width" name="email" value required autofocus>
            <input id="password" v-model="form.password" placeholder="mot de passe" type="password" class="full-width" name="password" required>
            <div class="flex all-1 xs">
              <button type="submit" class="btn-violet display-block">
                Se connecter
              </button>
              <router-link to="/" class="m-top-xs">Retour</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="sass">
@import "./assets/sass/login.sass"
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
