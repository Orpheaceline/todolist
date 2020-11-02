<template>
  <div>
    <section v-if="user.loggedIn" class="todoapp">
      <header class="header flex space-xs">
        <div class="main">
          <input :id="'add-todo-' + list.id" v-model="todo.name" type="text" placeholder="Ajouter une tache" @keyup.enter="addTodo">
        </div>
        <Datepicker ref="datePicker" v-model="todo.dueDate" :language="fr" format="dd/MM/yyyy" :class="{empty: !todo.dueDate}" @closed="addTodo"/>
      </header>
      <div class="content">
        <div class="flex v-middle m-top-sm m-bottom-sm">
          <span class="align-left grey">Il y a <strong>{{ activeTodos.length }}</strong> tâches à faire</span>
          <Dropdown id="menu-toggle" name="Dropdown">
            <slot>
              <li><a href="#" :class="{'active': type === ''}" @click="setFilterType('')">Afficher les tâches à faire ({{ activeTodos.length }})</a></li>
              <li><a href="#" :class="{'active': type === 'completed'}" @click="setFilterType('completed')">Afficher les tâches finies ({{ completedTodos.length }})</a></li>
              <li><a href="#" :class="{'active': type === 'all'}" @click="setFilterType('all')">Afficher toutes les tâches ({{ AllTodos.length }})</a></li>
              <li class="border-top-grey m-top-sm">
                <a href="" v-on:click.stop.prevent="clearCompleted">
                  Supprimer les taches finies ({{ completedTodos.length }})
                </a>
              </li>
            </slot>
          </Dropdown>
        </div>
        <ul class="nls task-list">
          <TodoTask v-for="todo in filteredTodos" :key="todo.id" :todo="todo" v-if="todo.list === list.id"/>
        </ul>
      </div>
    </section>
  </div>
</template>

<style lang="sass">
@import "./assets/sass/todo.sass"
</style>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Datepicker from 'vuejs-datepicker'
import { fr } from 'vuejs-datepicker/dist/locale'
import { db } from '../index'

import Dropdown from 'components/Dropdown'
import TodoTask from "./TodoTask"

export default {
  name: 'Todolist',
  components: {
    TodoTask,
    Datepicker,
    Dropdown
  },
  props: {
    list: Object
  },
  data () {
    return {
      todos: [],
      todo: {
        name: null
      },
      type: null,
      showTopMenu: false,
      today: this.$moment().format(),
      fr: fr
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getTodos'
    ]),
    AllTodos () {
      return this.getTodos.filter(todo => todo.list === this.list.id)
    },
    activeTodos () {
      return this.getTodos.filter(todo => todo.isCompleted === false && todo.list === this.list.id)
    },
    completedTodos () {
      return this.getTodos.filter(todo => todo.isCompleted === true && todo.list === this.list.id)
    },
    filteredTodos () {
      return _.orderBy(this.getTodos.filter(todo => {
        switch (this.type) {
          case 'all':
            return true
          case 'completed':
            return todo.isCompleted
          default:
            return !todo.isCompleted
        }
      }), ['isCompleted'])
    }
  },
  created: function () {
    this.$store.dispatch('setTodos', this.list.id)
  },
  methods: {
    addTodo () {
      db.collection('todos').add({
        list: this.list.id,
        name: this.todo.name,
        createdAt: this.$moment().format(),
        isCompleted: false,
        dueDate: this.todo.dueDate ? this.$moment(this.todo.dueDate).format() : null,
        user: this.user
      })
      this.todo.name = ''
      this.$refs.datePicker.clearDate()
    },
    setFilterType (type) {
      this.type = type
    },
    clearCompleted () {
      this.getTodos.forEach(todo => {
        if (todo.isCompleted) {
          db.collection('todos')
            .doc(todo.id)
            .delete()
        }
      })
    }
  }
}
</script>
