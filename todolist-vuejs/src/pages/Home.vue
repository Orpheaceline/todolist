<template>
  <div>
    <Navigation name="Home"/>
    <h1 class="logo"><span>Ma Todo Liste</span></h1>
    <section v-if="user.loggedIn" class="p-lg container">
      <ul class="nls menu-tab flex all-2 space-sm m-bottom-lg">
        <li v-for="(list, index) in getLists" :key="list.id" class="list-todo">
          <a :href="'todo-' + list.id" class="bloc-violet no-p flex space-md" :class="{ 'active': index === 0 }" v-on:click.stop.prevent="showTab($event)">
            <span class="icon small">
              <i class="font-xl fa" :class="'fa-' + list.icon"></i>
            </span>
            <h2 class="main font-xl text-left">{{ list.name }}</h2>
          </a>
        </li>
      </ul>
      <div class="tab" :class="{ 'hide': index !== 0 }" ref="Tab" v-for="(list, index) in getLists" :key="list.id" :id="'todo-' + list.id">
        <Todolist class="todolist" :list="list" />
      </div>
    </section>
    <section v-else>
      <div class="container-small">
        <div class="flex all-2 space-xs text-center">
          <div>
            <router-link to="login" class="button display-block">Se Connecter</router-link>
          </div>
          <div>
            <router-link to="register" class="button display-block">S'inscrire</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navigation from 'components/Navbar'
import Todolist from 'components/Todolist'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    Navigation,
    Todolist
  },
  data () {
    return {
      lists: [],
      list: ''
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getLists'
    ])
  },
  created: function () {
    this.$store.dispatch('setLists')
  },
  methods: {
    showTab (e) {
      const target = e.currentTarget.getAttribute('href')
      const allLink = e.target.closest('.menu-tab').getElementsByTagName('a')
      const allTab = this.$refs.Tab
      allLink.forEach((element) => {
        element.classList.remove('active')
      })
      allTab.forEach((element) => {
        element.classList.add('hide')
      })
      e.currentTarget.classList.add('active')
      document.getElementById(target).classList.remove('hide')
    }
  }
}
</script>
