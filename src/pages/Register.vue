<template>
  <section class="login">
    <div class="main">
      <h1 class="logo"><span>Ma Todo Liste</span></h1>
      <h2>Inscription</h2>
      <div class="container-small m-top-md">
        <div v-if="error" class="">{{error}}</div>
        <div class="bloc-grey">
          <form action="#" @submit.prevent="submit">
            <input id="name" type="name" class="full-width" placeholder="pseudo" name="name" value required autofocus v-model="form.name"/>
            <input id="email" type="email" class="full-width" placeholder="email" name="email" value required autofocus v-model="form.email"/>
            <input id="password" type="password" class="full-width" placeholder="mot de passe" name="password" required v-model="form.password"/>
            <div class="flex all-1 xs h-center">
              <button type="submit" class="btn-violet display-block m-top-sm">
                S'inscrire
              </button>
              <router-link to="/" class="m-top-xs text-center">Retour</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      form: {
        name: '',
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
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then(data => {
              this.$router.replace({ name: 'home' })
            })
        })
        .catch(err => {
          this.error = err.message
        })
    }
  }
}
</script>
