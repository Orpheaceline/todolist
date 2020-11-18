<template>
  <div>
    <hide-at breakpoint="mediumAndAbove">
      <nav class="navbar">
        <div class="container">
          <div class="flex space-sm v-center h-center">
            <router-link to="/" class="logo small"></router-link>
            <template v-if="user.loggedIn">
                <strong class="align-center">{{ user.data.displayName }}</strong>
                <Dropdown id="menu-toggle" name="Dropdown" class="dark-menu align-right text-center">
                  <slot>
                    <li><router-link to="/" class="m-top-xs">Voir les listes</router-link></li>
                    <li><router-link to="manage-list">Modifier les listes</router-link></li>
                    <li class="border-top-violet m-top-sm"><a href="" class="nav-link" @click.prevent="signOut">Se déconnecter</a></li>
                  </slot>
                </Dropdown>
            </template>
            <template v-else>
              <span>Veuillez vous connecter.</span>
            </template>
          </div>
        </div>
      </nav>
    </hide-at>
    <show-at breakpoint="mediumAndAbove">
      <nav class="navbar" v-if="user.loggedIn">
        <div class="container">
          <ul class="nls flex space-xxs h-center v-center">
            <li><router-link to="/" class="m-top-xs">Accueil</router-link></li>
            <li class="border-left-violet-med m-left-xs p-left-sm"><router-link to="manage-list" class="m-top-xs">Modifier les listes</router-link></li>
            <li class="border-left-violet-med m-left-xs p-left-sm align-right">Bienvenue <strong>{{ user.data.displayName }}</strong> !</li>
            <li class="border-left-violet-med m-left-sm">
              <a href="" class="nav-link" @click.prevent="signOut">Se déconnecter<i class="fa fa-sign-out m-left-xs"></i></a>
            </li>
          </ul>
        </div>
      </nav>
    </show-at>
  </div>
</template>

<script>
import {showAt, hideAt} from 'vue-breakpoints'
import { mapGetters } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import Dropdown from 'components/Dropdown'

export default {
  components: {
    hideAt,
    showAt,
    Dropdown
  },
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
