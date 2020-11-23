<template>
  <div>
    <Navigation name="Home"/>
    <show-at breakpoint="mediumAndAbove">
      <h1 class="logo m-top-md"><span>Ma Todo Liste</span></h1>
    </show-at>
    <section v-if="user.loggedIn" class="container">
      <ul class="nls menu-tab flex sm-5 space-sm-min-sm space-xs-max-sm space-xxs-max-xs m-top-md m-bottom-md h-center">
        <li v-for="(list, index) in getLists" :key="list.id" class="list-todo flex">
          <a :href="'todo-' + list.id" class="no-p flex v-center" :class="{ 'active': index === 0 }" v-on:click.stop.prevent="showTab($event)">
            <span class="icon">
              <i class="font-xl fa" :class="'fa-' + list.icon"></i>
            </span>
            <h2 class="main font-xl text-left hide-sm">{{ list.name }}</h2>
          </a>
        </li>
      </ul>
      <div class="tab" :class="{ 'hide': index !== 0 }" ref="Tab" v-for="(list, index) in getLists" :key="list.id" :id="'todo-' + list.id">
        <Todolist class="todolist" :list="list" />
      </div>
    </section>
    <section v-else>
      <div class="container-small">
        <h2 class="m-top-md">Todolist App'</h2>
        <div class="bloc-violet bloc-lg full-width m-top-md">
          <p class="violet text-center no-m">Bienvenue sur cette application de Todolist. Cette espace est réservé aux membres.</p>
          <div class="text-center m-top-md">
            <Login name="Home"/>
<!--            <router-link to="register" class="m-top-xs in-block">S'inscrire</router-link>-->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {showAt, hideAt} from 'vue-breakpoints'
import Navigation from 'components/Navbar'
import Login from 'components/Login'
import Todolist from 'components/Todolist'
import { mapGetters } from 'vuex'
import {db} from "../index";

export default {
  name: 'Home',
  components: {
    hideAt,
    showAt,
    Login,
    Navigation,
    Todolist
  },
  data () {
    return {
      todos: [],
      lists: [],
      list: ''
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getLists',
      'getTodos'
    ])
  },
  created: function () {
    this.$store.dispatch('setLists').then(() => {
      this.setEditingToFalse()
    })
  },
  methods: {
    setEditingToFalse () {
      this.getTodos.forEach(todo => {
        db.collection('todos')
          .doc(todo.id)
          .update({
            isEditing: false
          })
      })
    },
    showTab (e) {
      const target = e.currentTarget.getAttribute('href')
      const allLink = e.target.closest('.menu-tab').getElementsByTagName('a')
      const allTab = this.$refs.Tab

      this.setEditingToFalse()

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
