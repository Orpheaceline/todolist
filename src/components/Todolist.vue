<template>
  <div>
    <section v-if="user.loggedIn" class="todoapp">
      <div ref="alertRed" class="alert-red flex space-sm v-center h-center hide">
        <i class="fa fa-exclamation fa-circle-red extra-small m-right-sm"></i>
        Veuillez compléter le champ ci dessous.
      </div>
      <header class="header flex-form">
        <input ref="todoName" :id="'add-todo-' + list.id" v-model="todo.name" type="text" placeholder="Ajouter une tache" @keyup.enter="addTodo()">
        <Datepicker ref="datePicker" v-model="todo.dueDate" :language="fr" format="dd/MM/yyyy" :class="{empty: !todo.dueDate}" @closed="addTodo"/>
      </header>
      <div class="content">
        <div class="flex space-xs v-center m-top-sm m-bottom-sm">
          <div class="main bloc-violet-light bloc-radius bloc-xs">
            <div class="flex space-xs v-center">
              <i class="fa fa-info fa-circle-violet extra-small"></i>
              <div class="violet-light text-left">
                <template v-if="activeTodos.length">
                  <span v-show="list.name === 'Todo List'">{{ activeTodos.length | pluralize('fr', ['Il y a une tâche à faire.', 'Il y a ' + activeTodos.length + ' tâches à faire.']) }}</span>
                  <span v-show="list.name === 'Travel List'">{{ activeTodos.length | pluralize('fr', ['Il y a un endroit à visiter.', 'Il y a ' + activeTodos.length + ' endroits à visiter.']) }}</span>
                  <span v-show="list.name === 'Watch List'">{{ activeTodos.length | pluralize('fr', ['Il y a un film ou une série à regarder.', 'Il y a ' + activeTodos.length + ' films / séries à regarder.']) }}</span>
                  <span v-show="list.name === 'Shopping List'">{{ activeTodos.length | pluralize('fr', ['Il y a une chose à acheter en course.', 'Il y a ' + activeTodos.length + ' choses à acheter en course.']) }}</span>
                </template>
                <template v-else>
                  <span>Cette liste est vide.</span>
                </template>
              </div>
            </div>
          </div>
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


<!--travel: 'Il y a un endroit à visiter. | Il y a {count} ',-->
<!--shopping: 'Il y a une chose à acheter en course. | Il y a {count} ',-->
<!--watch: 'Il y a un film ou série à regarder. | Il y a {count} '-->


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
      if (this.todo.name) {
        db.collection('todos').add({
          list: this.list.id,
          name: this.todo.name,
          createdAt: this.$moment().format(),
          isCompleted: false,
          isEditing: false,
          dueDate: this.todo.dueDate ? this.$moment(this.todo.dueDate).format() : null,
          user: this.user
        })
        this.todo.name = ''
        this.$refs.datePicker.clearDate()
      } else {
        this.$refs.todoName.classList.add('red')
        this.$refs.alertRed.classList.remove('hide')
      }

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
