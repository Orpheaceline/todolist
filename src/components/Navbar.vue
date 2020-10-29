<template>
  <nav class="navbar" v-if="user.loggedIn">
    <div class="container">
      <ul class="list-style-none flex space-xxs h-middle">
          <li class="nav-item">Connecté en tant que <strong>{{ user.data.displayName }}</strong></li>
          <li class="nav-item">
            <a href="" class="nav-link" @click.prevent="signOut">(Se déconnecter)</a>
          </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'

export default {
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: 'user'
    })
  },
  methods: {
    signOut () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: 'home'
          })
        })
    }
  }
}
</script>
