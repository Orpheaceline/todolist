import Vue from 'vue'
import Vuex from 'vuex'
import { db } from './index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    lists: [],
    todos: []
  },
  getters: {
    user (state) {
      return state.user
    },
    getLists (state) {
      return state.lists
    },
    getTodos (state) {
      return state.todos
    }
  },
  mutations: {
    setLoggedIn (state, value) {
      state.user.loggedIn = value
    },
    setUser (state, data) {
      state.user.data = data
    },
    async setLists (state) {
      let lists = []
      await db.collection('todolists').orderBy('createdAt').onSnapshot((snapshot) => {
        lists = []
        snapshot.forEach((doc) => {
          lists.push({
            id: doc.id,
            ...doc.data()
          })
        })
        state.lists = lists
      })
    },
    async setTodos (state) {
      let todos = []
      await db.collection('todos').onSnapshot((snapshot) => {
        todos = []
        snapshot.forEach((doc) => {
          const todo = doc.data()
          todo.id = doc.id
          todos.push(todo)
        })
        state.todos = todos
      })
    }
  },
  actions: {
    fetchUser ({ commit }, user) {
      commit('setLoggedIn', user !== null)
      if (user) {
        commit('setUser', {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid
        })
      } else {
        commit('SetUser', null)
      }
    },
    setLists (context) {
      context.commit('setLists')
    },
    setTodos (context) {
      context.commit('setTodos')
    }
  }
})
