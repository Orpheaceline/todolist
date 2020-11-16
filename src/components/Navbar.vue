<template>
  <nav class="navbar" v-if="user.loggedIn">
    <div class="container">
      <ul class="nls flex space-xxs h-middle v-middle">
        <li>
          <router-link to="/" class="m-top-xs">Accueil</router-link>
        </li>
        <li class="border-left-violet-med m-left-xs p-left-sm">
          <router-link to="manage-list" class="m-top-xs">Modifier les listes</router-link>
        </li>
        <li class="border-left-violet-med m-left-xs p-left-sm">Bienvenue <strong>{{ user.data.displayName }}</strong> !</li>
        <li class="border-left-violet-med m-left-xs p-left-sm">
          <a href="" class="nav-link" @click.prevent="signOut"><i class="fa fa-sign-out"></i></a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  computed: {
    ...mapGetters({
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
