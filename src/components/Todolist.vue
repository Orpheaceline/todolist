<template>
  <section v-if="user.loggedIn" class="todoapp">
    <header class="header">
      <input id="new_todo" v-model="todo.title" type="text" class="new-todo" placeholder="Ajouter une tache" @keyup.enter="addTodo">
    </header>
    <div class="content">
      <ul class="list-style-none todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id" class="todo" :class="{completed: todo.isCompleted}">
          <div class="view">
            <div class="flex space-sm">
              <div class="input-checkbox">
                <input type="checkbox" class="fake-check" :checked="todo.isCompleted" @change="updateTodoItem(todo.id, $event)">
              </div>
              <div class="todo-infos">
                <label v-show="isEditing != todo.id" @dblclick="editTodo(todo)">{{ todo.title }}</label>
                <input v-show="isEditing === todo.id" v-model="todo.title" @keyup.enter="saveTodo(todo.id, $event)">
                <div class="todo-info">
                  <strong>{{ todo.user.data.displayName }}</strong> -
                  <span>{{ todo.createdAt }}</span>
                </div>
              </div>
              <button class="no-btn-style destroy align-right" title="Supprimer cette tache" @click="deleteToDo(todo.id)" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-content m-top-sm">
      <div class="delete-all-done text-left">
        <a href="" @click="clearCompleted" v-show="type === 'completed' || type === 'all'">
          <i class="fa fa-level-down-alt"></i>
          Supprimer les taches finies
        </a>
      </div>
      <div class="flex h-end v-middle m-top-md">
        <span class="todo-count grey align-left"><strong>{{ activeTodos.length }}</strong> tâches à faire</span>
        <ul class="list-style-none filters flex space-xs v-middle" v-show="completedTodos.length">
          <li><a href="#" class="btn-grey btn-xs" :class="{'btn-violet': type === ''}" @click="setFilterType('')">A faire</a></li>
          <li><a href="#" class="btn-grey btn-xs" :class="{'btn-violet': type === 'completed'}" @click="setFilterType('completed')">Faites</a></li>
          <li><a href="#" class="btn-grey btn-xs" :class="{'btn-violet': type === 'all'}" @click="setFilterType('all')">Toutes</a></li>
        </ul>
      </div>
    </div>
  </section>
  <section v-else>
    <div class="flex all-2 space-xs">
      <div>
        <router-link to="login" class="button display-block">Se Connecter</router-link>
      </div>
      <div>
        <router-link to="register" class="button display-block">S'inscrire</router-link>
      </div>
    </div>
  </section>
</template>

<style lang="sass">
@import "./assets/sass/todo.sass"
</style>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data () {
    return {
      todo: {
        title: ''
      },
      todos: [],
      type: '',
      isEditing: ''
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: 'user'
    }),
    activeTodos () {
      return this.todos.filter(t => !t.isCompleted)
    },
    completedTodos () {
      return this.todos.filter(t => t.isCompleted)
    },
    filteredTodos () {
      return _.orderBy(this.todos.filter(todo => {
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
  created () {
    this.getTodos()
  },
  methods: {
    addTodo () {
      firebase
        .firestore()
        .collection('todos')
        .add({
          title: this.todo.title,
          createdAt: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleString(),
          isCompleted: false,
          user: this.user
        })
    },
    async getTodos () {
      const todosRef = await firebase.firestore().collection('todos').orderBy('createdAt', 'desc')
      todosRef.onSnapshot(snap => {
        this.todos = []
        snap.forEach(doc => {
          const todo = doc.data()
          todo.id = doc.id
          this.todos.push(todo)
          this.todo.title = ''
        })
      })
    },
    updateTodoItem (docId, e) {
      const isChecked = e.target.checked
      firebase
        .firestore()
        .collection('todos')
        .doc(docId)
        .update({
          isCompleted: isChecked
        })
    },
    editTodo (todo) {
      this.isEditing = todo.id
    },
    saveTodo (docId, e) {
      firebase
        .firestore()
        .collection('todos')
        .doc(docId)
        .update({
          title: e.target.value
        })
        .then(_ => {
          this.isEditing = ''
        })
    },
    deleteToDo (docId) {
      firebase
        .firestore()
        .collection('todos')
        .doc(docId)
        .delete()
    },
    clearCompleted () {
      this.todos = this.activeTodos
    },
    setFilterType (type) {
      this.type = type
    }
  }
}
</script>
