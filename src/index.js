import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import store from './store'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import moment from 'moment'
import VueFilterPluralize from '@vuejs-community/vue-filter-pluralize'
// import VueTouch from 'vue-touch'

Object.defineProperty(Vue.prototype, '$moment', { value: moment })
moment.locale('fr')
Vue.use(VueFilterPluralize)
// Vue.use(VueTouch)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: 'AIzaSyDJ_KAAdhEwPPgkmFnNnzDsbkIDRwpRCkU',
  authDomain: 'todolist-80064.firebaseapp.com',
  databaseURL: 'https://todolist-80064.firebaseio.com',
  projectId: 'todolist-80064',
  storageBucket: 'todolist-80064.appspot.com',
  messagingSenderId: '41532131486',
  appId: '1:41532131486:web:47da008d6a4753c041538f',
  measurementId: 'G-F71D5N44TH'
}

firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('fetchUser', user)
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
